import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  getFilteredTransactions: (filters: FilterOptions) => Transaction[];
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'income' | 'expense' | 'all';
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
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...updatedTransaction, id } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
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
      
      return true;
    });
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