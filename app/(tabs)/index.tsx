import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, LineChart } from 'react-native-svg-charts';
import { useFinance, FilterOptions } from '@/contexts/FinanceContext';
import { Calendar, Filter, TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import FilterModal from '@/components/FilterModal';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const { transactions, categories, getFilteredTransactions } = useFinance();
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = getFilteredTransactions(filters);
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Prepare pie chart data
  const categoryData = categories.map(category => {
    const categoryTransactions = filteredTransactions.filter(
      t => t.category === category.name
    );
    const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      key: category.id,
      value: amount,
      svg: { fill: category.color },
      arc: { outerRadius: '100%', padAngle: 0.02 },
      label: category.name,
      amount: amount,
    };
  }).filter(item => item.value > 0);

  // Prepare line chart data for monthly trends
  const monthlyData = {};
  filteredTransactions.forEach(transaction => {
    const month = transaction.date.substring(0, 7); // YYYY-MM format
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    monthlyData[month][transaction.type] += transaction.amount;
  });

  const lineChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      balance: data.income - data.expense,
    }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Finance Dashboard</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color="#10B981" />
              <Text style={styles.cardLabel}>Income</Text>
            </View>
            <Text style={[styles.cardAmount, styles.incomeAmount]}>
              ${totalIncome.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <View style={styles.cardHeader}>
              <TrendingDown size={24} color="#EF4444" />
              <Text style={styles.cardLabel}>Expenses</Text>
            </View>
            <Text style={[styles.cardAmount, styles.expenseAmount]}>
              ${totalExpenses.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.balanceCard]}>
            <View style={styles.cardHeader}>
              <Wallet size={24} color="#3B82F6" />
              <Text style={styles.cardLabel}>Balance</Text>
            </View>
            <Text style={[styles.cardAmount, { color: balance >= 0 ? '#10B981' : '#EF4444' }]}>
              ${balance.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Category Distribution Chart */}
        {categoryData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Category Distribution</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                style={styles.pieChart}
                data={categoryData}
                innerRadius="40%"
                padAngle={0.02}
              />
              <View style={styles.legendContainer}>
                {categoryData.slice(0, 6).map((item, index) => (
                  <View key={item.key} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.svg.fill }]} />
                    <Text style={styles.legendText}>
                      {item.label}: ${item.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Monthly Trend Chart */}
        {lineChartData.length > 1 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Monthly Balance Trend</Text>
            <LineChart
              style={styles.lineChart}
              data={lineChartData.map(d => d.balance)}
              svg={{ stroke: '#3B82F6', strokeWidth: 3 }}
              contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
              curve={d3.curveNatural}
            />
            <View style={styles.monthLabels}>
              {lineChartData.map((item, index) => (
                <Text key={index} style={styles.monthLabel}>
                  {new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Recent Transactions</Text>
          {filteredTransactions.slice(0, 5).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View 
                  style={[
                    styles.transactionIcon,
                    { backgroundColor: categories.find(c => c.name === transaction.category)?.color || '#6B7280' }
                  ]}
                />
                <View>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text 
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '600',
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#10B981',
  },
  expenseAmount: {
    color: '#EF4444',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    height: 200,
    width: screenWidth * 0.4,
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  lineChart: {
    height: 200,
    marginBottom: 8,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  monthLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});