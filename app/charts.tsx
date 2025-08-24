import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart, LineChart } from 'react-native-svg-charts';
import * as d3 from 'd3';
import { useFinance } from '@/contexts/FinanceContext';

type MonthlyData = { [month: string]: { income: number; expense: number } };

export default function ChartsScreen() {
  const { transactions, categories, getFilteredTransactions } = useFinance();
  const filteredTransactions = getFilteredTransactions({ type: 'all' });

  // Pie chart data
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

  // Line chart data
  const monthlyData: MonthlyData = {};
  filteredTransactions.forEach(transaction => {
    const month = transaction.date.substring(0, 7); // YYYY-MM format
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    monthlyData[month][transaction.type] += transaction.amount;
  });
  const lineChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      const d = data as { income: number; expense: number };
      return { month, balance: d.income - d.expense };
    });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Charts Overview</Text>
      <View style={styles.chartsRow}>
        {/* Pie Chart */}
        {categoryData.length > 0 && (
          <View style={styles.chartPanel}>
            <Text style={styles.chartPanelTitle}>Category Distribution</Text>
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
        )}
        {/* Line Chart */}
        {lineChartData.length > 1 && (
          <View style={styles.chartPanel}>
            <Text style={styles.chartPanelTitle}>Monthly Balance Trend</Text>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartPanel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flex: 1,
    minWidth: 180,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  chartPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  pieChart: {
    height: 180,
    width: 180,
    marginBottom: 12,
  },
  lineChart: {
    height: 180,
    width: 180,
    marginBottom: 12,
  },
  legendContainer: {
    width: '100%',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  monthLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});
