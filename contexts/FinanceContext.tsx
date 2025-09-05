import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../components/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  frequency: 'monthly' | 'weekly' | 'yearly';
  nextDate: string; // ISO date string
}

interface FinanceContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  savingsGoals: { [goalName: string]: { target: number; saved: number } };
  setSavingsGoal: (goalName: string, target: number) => void;
  addToSavings: (goalName: string, amount: number) => void;
  getSavingsProgress: (goalName: string) => number;
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  getFilteredTransactions: (filters: FilterOptions) => Transaction[];
  budgets: { [category: string]: number };
  setBudget: (category: string, amount: number) => void;
  getBudget: (category: string) => number | undefined;
  getCategoryUsage: (category: string) => number;
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (rt: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurringTransaction: (id: string, rt: Omit<RecurringTransaction, 'id'>) => void;
  deleteRecurringTransaction: (id: string) => void;
  getSuggestions: () => string[];
  predictExpenses: () => { [category: string]: number };
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'income' | 'expense' | 'all';
  minAmount?: number;
  maxAmount?: number;
  notes?: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#FF6B6B', isDefault: true },
  { id: '2', name: 'Travel', color: '#4ECDC4', isDefault: true },
  { id: '3', name: 'Rent', color: '#45B7D1', isDefault: true },
  { id: '4', name: 'Salary', color: '#96CEB4', isDefault: true },
  { id: '5', name: 'Utilities', color: '#FFEAA7', isDefault: true },
  { id: '6', name: 'Entertainment', color: '#DDA0DD', isDefault: true },
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3000,
    date: '2024-01-15',
    description: 'Monthly Salary',
    category: 'Salary',
    type: 'income'
  },
  {
    id: '2',
    amount: 1200,
    date: '2024-01-01',
    description: 'Rent Payment',
    category: 'Rent',
    type: 'expense'
  },
  {
    id: '3',
    amount: 250,
    date: '2024-01-10',
    description: 'Groceries',
    category: 'Food',
    type: 'expense'
  },
  {
    id: '4',
    amount: 150,
    date: '2024-01-12',
    description: 'Electric Bill',
    category: 'Utilities',
    type: 'expense'
  },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);


export function FinanceProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [savingsGoals, setSavingsGoals] = useState<{ [goalName: string]: { target: number; saved: number } }>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<{ [category: string]: number }>({});
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user data from Firestore on login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setTransactions(data.transactions || []);
          setCategories(data.categories || defaultCategories);
          setBudgets(data.budgets || {});
          setSavingsGoals(data.savingsGoals || {});
          setRecurringTransactions(data.recurringTransactions || []);
        } else {
          // If new user, set defaults
          setTransactions([]);
          setCategories(defaultCategories);
          setBudgets({});
          setSavingsGoals({});
          setRecurringTransactions([]);
          await setDoc(doc(db, 'users', user.uid), {
            transactions: [],
            categories: defaultCategories,
            budgets: {},
            savingsGoals: {},
            recurringTransactions: [],
          });
        }
      } else {
        setUserId(null);
        setTransactions([]);
        setCategories([]);
        setBudgets({});
        setSavingsGoals({});
        setRecurringTransactions([]);
      }
    });
    return unsubscribe;
  }, []);

  // Save user data to Firestore when changed
  useEffect(() => {
    if (!userId) return;
    updateDoc(doc(db, 'users', userId), {
      transactions,
      categories,
      budgets,
      savingsGoals,
      recurringTransactions,
    });
  }, [transactions, categories, budgets, savingsGoals, recurringTransactions, userId]);

  const setSavingsGoal = (goalName: string, target: number) => {
    setSavingsGoals(prev => ({
      ...prev,
      [goalName]: { target, saved: prev[goalName]?.saved || 0 }
    }));
  };

  const addToSavings = (goalName: string, amount: number) => {
    setSavingsGoals(prev => {
      const goal = prev[goalName] || { target: 0, saved: 0 };
      return {
        ...prev,
        [goalName]: { ...goal, saved: goal.saved + amount }
      };
    });
  };

  const getSavingsProgress = (goalName: string) => {
    const goal = savingsGoals[goalName];
    if (!goal || goal.target === 0) return 0;
    return Math.min(goal.saved / goal.target, 1);
  };

  const setBudget = (category: string, amount: number) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
  };

  const getBudget = (category: string) => budgets[category];

  const getCategoryUsage = (category: string) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };


  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        transactions: arrayUnion(newTransaction)
      });
    }
  };


  const updateTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...updatedTransaction, id } : transaction
      )
    );
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      // Remove old transaction and add updated one
      const oldTransaction = transactions.find(t => t.id === id);
      if (oldTransaction) {
        await updateDoc(userDocRef, {
          transactions: arrayRemove(oldTransaction)
        });
      }
      await updateDoc(userDocRef, {
        transactions: arrayUnion({ ...updatedTransaction, id })
      });
    }
  };


  const deleteTransaction = async (id: string) => {
    const toDelete = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    if (auth.currentUser && toDelete) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        transactions: arrayRemove(toDelete)
      });
    }
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updatedCategory: Omit<Category, 'id'>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...updatedCategory, id } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category && !category.isDefault) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      // Update transactions that use this category to use a default category
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.category === category.name
            ? { ...transaction, category: 'Food' }
            : transaction
        )
      );
    }
  };

  const getFilteredTransactions = (filters: FilterOptions): Transaction[] => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (filters.startDate && transactionDate < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && transactionDate > new Date(filters.endDate)) {
        return false;
      }
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
        return false;
      }
      if (filters.notes && !transaction.description.toLowerCase().includes(filters.notes.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  // Add a recurring transaction
  const addRecurringTransaction = (rt: Omit<RecurringTransaction, 'id'>) => {
    const newRT = { ...rt, id: Date.now().toString() };
    setRecurringTransactions(prev => [...prev, newRT]);
  };

  // Update a recurring transaction
  const updateRecurringTransaction = (id: string, rt: Omit<RecurringTransaction, 'id'>) => {
    setRecurringTransactions(prev => prev.map(r => r.id === id ? { ...rt, id } : r));
  };

  // Delete a recurring transaction
  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(r => r.id !== id));
  };

  // Auto-add due recurring transactions on mount (and daily)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setRecurringTransactions(prev => {
      let updated = [...prev];
      prev.forEach(rt => {
        if (rt.nextDate <= today) {
          // Add to transactions
          addTransaction({
            amount: rt.amount,
            date: rt.nextDate,
            description: rt.description,
            category: rt.category,
            type: rt.type,
          });
          // Calculate next date
          let next = new Date(rt.nextDate);
          if (rt.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
          if (rt.frequency === 'weekly') next.setDate(next.getDate() + 7);
          if (rt.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
          rt.nextDate = next.toISOString().slice(0, 10);
        }
      });
      return updated;
    });
  }, []);

  // AI-powered suggestions based on spending patterns
  const getSuggestions = () => {
    const suggestions: string[] = [];
    // Example: If food expense > 30% of total, suggest meal planning
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const foodExpense = transactions.filter(t => t.type === 'expense' && t.category === 'Food').reduce((sum, t) => sum + t.amount, 0);
    if (totalExpense > 0 && foodExpense / totalExpense > 0.3) {
      suggestions.push('Consider meal planning or cooking at home to reduce food expenses.');
    }
    // Example: If entertainment > 20%, suggest free activities
    const entertainmentExpense = transactions.filter(t => t.type === 'expense' && t.category === 'Entertainment').reduce((sum, t) => sum + t.amount, 0);
    if (totalExpense > 0 && entertainmentExpense / totalExpense > 0.2) {
      suggestions.push('Try free or low-cost entertainment options to save more.');
    }
    // Example: If salary is high but savings low
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    if (totalIncome > 0 && totalExpense / totalIncome > 0.8) {
      suggestions.push('Set a monthly savings goal and automate transfers to savings.');
    }
    // Add more rules as needed
    return suggestions;
  };

  // Expense prediction using simple average of last 3 months per category
  const predictExpenses = () => {
    const predictions: { [category: string]: number } = {};
    const now = new Date();
    const months: string[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toISOString().slice(0, 7)); // YYYY-MM
    }
    categories.forEach(category => {
      let monthlyTotals: number[] = [];
      months.forEach(month => {
        const monthTotal = transactions.filter(t => t.type === 'expense' && t.category === category.name && t.date.startsWith(month)).reduce((sum, t) => sum + t.amount, 0);
        monthlyTotals.push(monthTotal);
      });
      const avg = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
      predictions[category.name] = Math.round(avg);
    });
    return predictions;
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        getFilteredTransactions,
        budgets,
        setBudget,
        getBudget,
        getCategoryUsage,
        savingsGoals,
        setSavingsGoal,
        addToSavings,
        getSavingsProgress,
        darkMode,
        setDarkMode,
        recurringTransactions,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        getSuggestions,
        predictExpenses,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}