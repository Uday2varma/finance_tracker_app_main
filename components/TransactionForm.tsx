import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface TransactionFormProps {
  onSubmit: (transaction: {
    amount: number;
    date: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
  }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = () => {
    if (!amount || !date || !category) return;
    onSubmit({
      amount: parseFloat(amount),
      date,
      description,
      category,
      type,
    });
    setAmount('');
    setDate('');
    setDescription('');
    setCategory('');
    setType('expense');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Type</Text>
      <View style={styles.typeSwitchContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'column',
    gap: 18,
    padding: 20,
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#6366F1',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5B4FC',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: 'white',
    color: '#6366F1',
    fontWeight: '600',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  typeSwitchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  typeButtonActive: {
    backgroundColor: '#EC4899',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#EC4899',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default TransactionForm;
