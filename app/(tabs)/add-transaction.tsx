import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '@/contexts/FinanceContext';
import { Calendar, DollarSign, FileText, Tag, TrendingUp, TrendingDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function AddTransaction() {
  const { addTransaction, categories, darkMode } = useFinance();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    addTransaction({
      amount: numericAmount,
      description,
      category: selectedCategory,
      type: transactionType,
      date,
    });
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setTransactionType('expense');
    setDate(new Date().toISOString().split('T')[0]);
    Alert.alert('Success', 'Transaction added successfully!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#18181B' : '#F3F4F6' }}>
      <View style={[styles.gradientBg, darkMode ? styles.gradientBgDark : null]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[styles.title, darkMode ? styles.titleDark : null]}>Add Transaction</Text>
        <LinearGradient
          colors={['#FDE68A', '#EC4899', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.formCard, styles.cardShadow]}
        >
          {/* Transaction Type Toggle */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>Transaction Type</Text>
            <View style={[styles.typeToggle, darkMode ? styles.typeToggleDark : null]}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  styles.typeButtonLeft,
                  transactionType === 'income' ? styles.activeIncomeButton : null,
                  darkMode ? styles.typeButtonDark : null,
                ]}
                onPress={() => setTransactionType('income')}
              >
                <TrendingUp size={20} color={transactionType === 'income' ? '#10B981' : (darkMode ? '#A5B4FC' : '#6366F1')} />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === 'income' ? styles.activeIncomeText : null,
                    darkMode ? styles.typeButtonTextDark : null,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  styles.typeButtonRight,
                  transactionType === 'expense' ? styles.activeExpenseButton : null,
                  darkMode ? styles.typeButtonDark : null,
                ]}
                onPress={() => setTransactionType('expense')}
              >
                <TrendingDown size={20} color={transactionType === 'expense' ? '#EF4444' : (darkMode ? '#A5B4FC' : '#6366F1')} />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === 'expense' ? styles.activeExpenseText : null,
                    darkMode ? styles.typeButtonTextDark : null,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>Amount</Text>
            <View style={styles.inputRow}>
              <DollarSign size={20} color={darkMode ? '#A5B4FC' : '#6366F1'} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, darkMode ? styles.inputDark : null]}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor={darkMode ? '#A5B4FC' : '#9ca3af'}
              />
            </View>
          </View>
          {/* Description Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>Description</Text>
            <View style={styles.inputRow}>
              <FileText size={20} color={darkMode ? '#A5B4FC' : '#6366F1'} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, darkMode ? styles.inputDark : null]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor={darkMode ? '#A5B4FC' : '#9ca3af'}
              />
            </View>
          </View>
          {/* Category Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryOption, selectedCategory === category.name ? styles.activeCategoryOption : null, darkMode ? styles.categoryOptionDark : null]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <Text style={[styles.categoryText, selectedCategory === category.name ? styles.activeCategoryText : null, darkMode ? styles.categoryTextDark : null]}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Date Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>Date</Text>
            <View style={styles.inputRow}>
              <Calendar size={20} color={darkMode ? '#A5B4FC' : '#6366F1'} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, darkMode ? styles.inputDark : null]}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={darkMode ? '#A5B4FC' : '#9ca3af'}
              />
            </View>
          </View>
          {/* Submit Button */}
          <TouchableOpacity
            onPressIn={() => { scale.value = withSpring(0.95); }}
            onPressOut={() => { scale.value = withSpring(1); }}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.submitButton, animatedBtnStyle]}>
              <Text style={[styles.submitButtonText, darkMode ? styles.submitButtonTextDark : null]}>Add Transaction</Text>
            </Animated.View>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'transparent',
    // Simulate a vibrant gradient with multiple colors
    // Use Expo LinearGradient for real gradient, here fallback to layered colors
    backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #FDE68A 100%)',
    opacity: 0.9,
  },
  gradientBgDark: {
    backgroundImage: 'linear-gradient(135deg, #18181B 0%, #6366F1 60%, #EC4899 100%)',
    opacity: 0.95,
  },
  cardShadow: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  containerDark: {
    backgroundColor: '#18181B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
    textShadowColor: '#A5B4FC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleDark: {
    color: '#A5B4FC',
    textShadowColor: '#6366F1',
  },
  formCard: {
  backgroundColor: 'rgba(255,255,255,0.85)',
  borderRadius: 28,
  padding: 28,
  marginBottom: 18,
  },
  formCardDark: {
  backgroundColor: 'rgba(24,24,27,0.92)',
  shadowColor: '#A5B4FC',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
  },
  sectionTitleDark: {
    color: '#A5B4FC',
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    borderRadius: 14,
    overflow: 'hidden',
  },
  typeToggleDark: {
    backgroundColor: '#27272A',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typeButtonDark: {
    backgroundColor: '#18181B',
  },
  typeButtonLeft: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  typeButtonRight: {
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  activeIncomeButton: {
    backgroundColor: '#10B981',
  },
  activeExpenseButton: {
    backgroundColor: '#EF4444',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
  typeButtonTextDark: {
    color: '#A5B4FC',
  },
  activeIncomeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeExpenseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  inputDark: {
    backgroundColor: '#18181B',
    color: '#A5B4FC',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    paddingLeft: 4,
  },
  categoryScroll: {
    marginVertical: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#A5B4FC',
  },
  categoryOptionDark: {
    backgroundColor: '#18181B',
    borderColor: '#A5B4FC',
  },
  activeCategoryOption: {
    borderColor: '#EC4899',
    backgroundColor: '#FCE7F3',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  categoryTextDark: {
    color: '#A5B4FC',
  },
  activeCategoryText: {
    color: '#EC4899',
    fontWeight: 'bold',
  },
  submitButton: {
  backgroundColor: '#EC4899',
  borderRadius: 18,
  paddingVertical: 18,
  alignItems: 'center',
  marginTop: 18,
  shadowColor: '#EC4899',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.18,
  shadowRadius: 16,
  elevation: 6,
  },
  submitButtonDark: {
  backgroundColor: '#6366F1',
  },
  submitButtonText: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  textShadowColor: '#FDE68A',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
  },
  submitButtonTextDark: {
  color: '#FDE68A',
  textShadowColor: '#EC4899',
  },
});