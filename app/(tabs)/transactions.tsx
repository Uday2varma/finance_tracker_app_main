import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance, FilterOptions, Transaction } from '@/contexts/FinanceContext';
import { Filter, Trash2, CreditCard as Edit3 } from 'lucide-react-native';
import FilterModal from '@/components/FilterModal';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function Transactions() {
  const { transactions, categories, deleteTransaction, getFilteredTransactions, darkMode } = useFinance();
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = getFilteredTransactions(filters);

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6B7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <LinearGradient
      colors={['#FDE68A', '#EC4899', '#6366F1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.transactionCard, styles.cardShadow]}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: getCategoryColor(item.category) },
            ]}
          />
          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionDescription, darkMode ? styles.transactionDescriptionDark : null]}>{item.description}</Text>
            <Text style={[styles.transactionMeta, darkMode ? styles.transactionMetaDark : null]}>
              {item.category} • {formatDate(item.date)}
            </Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              darkMode ? styles.transactionAmountDark : null,
              { color: item.type === 'income' ? '#10B981' : '#EF4444' },
            ]}
          >
            {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
          </Text>
          <View style={styles.transactionActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteTransaction(item)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No transactions found</Text>
      <Text style={styles.emptyStateText}>
        {filters.type !== 'all' || filters.category || filters.startDate
          ? 'Try adjusting your filters'
          : 'Add your first transaction using the "+" tab'}
      </Text>
    </View>
  );

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.type && filters.type !== 'all') {
      activeFilters.push(filters.type);
    }
    if (filters.category) {
      activeFilters.push(filters.category);
    }
    if (filters.startDate && filters.endDate) {
      activeFilters.push('date range');
    }
    return activeFilters.length > 0 ? activeFilters.join(', ') : 'All transactions';
  };

  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#18181B' : '#F3F4F6' }}>
      <View style={[styles.gradientBg, darkMode ? styles.gradientBgDark : null]} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>
            {filteredTransactions.length} transactions • {getFilterSummary()}
          </Text>
        </View>
        <TouchableOpacity
          onPressIn={() => { scale.value = withSpring(0.95); }}
          onPressOut={() => { scale.value = withSpring(1); }}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.filterButton, animatedBtnStyle]}>
            <Filter size={20} color="#3B82F6" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <FilterModal
        visible={showFilters}
        filters={filters}
        onApplyFilters={setFilters}
        onClose={() => setShowFilters(false)}
      />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #FDE68A 100%)',
    opacity: 0.9,
  },
  gradientBgDark: {
    backgroundImage: 'linear-gradient(135deg, #18181B 0%, #6366F1 60%, #EC4899 100%)',
    opacity: 0.95,
  },
  transactionCardDark: {
    backgroundColor: '#18181B',
    borderColor: '#6366F1',
  },
  transactionDescriptionDark: {
    color: '#A5B4FC',
  },
  transactionMetaDark: {
    color: '#A5B4FC',
  },
  transactionAmountDark: {
    color: '#A5B4FC',
  },
  filterButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    // Simulate gradient with a light accent color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    letterSpacing: 1,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6366F1',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
    backgroundColor: '#e0f2fe',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: 'rgba(236,72,153,0.08)',
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  transactionMeta: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  transactionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});