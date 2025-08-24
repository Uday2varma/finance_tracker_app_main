

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { PieChart, LineChart, Grid } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop, Circle, G, Rect, Text as SVGText } from 'react-native-svg';

const pieData = [
  { key: 1, amount: 500, svg: { fill: '#EF4444' }, label: 'Food' },
  { key: 2, amount: 400, svg: { fill: '#F59E42' }, label: 'Transport' },
  { key: 3, amount: 300, svg: { fill: '#3B82F6' }, label: 'Shopping' },
  { key: 4, amount: 200, svg: { fill: '#10B981' }, label: 'Bills' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
// Example monthly data for each category
const foodData = [50, 80, 60, 90, 100, 70, 50];
const transportData = [30, 40, 35, 50, 60, 45, 30];
const shoppingData = [20, 30, 25, 40, 50, 35, 20];
const billsData = [40, 60, 55, 70, 80, 65, 40];

const totalExpenses = pieData.reduce((sum, item) => sum + item.amount, 0);
const highestCategory = pieData.reduce((max, item) => item.amount > max.amount ? item : max, pieData[0]);
const lowestCategory = pieData.reduce((min, item) => item.amount < min.amount ? item : min, pieData[0]);
const allLineData = foodData.concat(transportData, shoppingData, billsData);
const averageExpense = (allLineData.reduce((sum: number, v: number) => sum + v, 0) / allLineData.length).toFixed(2);

export default function ChartsScreen() {
  const { darkMode } = useFinance();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={[styles.gradientBg, darkMode ? styles.gradientBgDark : null]} />
  <Text style={[styles.title, darkMode ? styles.titleDark : null, styles.titleAccent]}>Expenses Analytics</Text>

      {/* Summary Cards */}
  <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, darkMode ? styles.summaryCardDark : null, styles.cardShadow, { borderLeftColor: '#EF4444' }]}>  
          <Text style={[styles.summaryLabel, darkMode ? styles.summaryLabelDark : null]}>Total Expenses</Text>
          <Text style={[styles.summaryValue, darkMode ? styles.summaryValueDark : null]}>₹{totalExpenses}</Text>
        </View>
  <View style={[styles.summaryCard, darkMode ? styles.summaryCardDark : null, styles.cardShadow, { borderLeftColor: '#3B82F6' }]}>  
          <Text style={[styles.summaryLabel, darkMode ? styles.summaryLabelDark : null]}>Avg/Month</Text>
          <Text style={[styles.summaryValue, darkMode ? styles.summaryValueDark : null]}>₹{averageExpense}</Text>
        </View>
      </View>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, darkMode ? styles.summaryCardDark : null, styles.cardShadow, { borderLeftColor: highestCategory.svg.fill }]}>  
          <Text style={[styles.summaryLabel, darkMode ? styles.summaryLabelDark : null]}>Highest Category</Text>
          <Text style={[styles.summaryValue, darkMode ? styles.summaryValueDark : null]}>{highestCategory.label} (₹{highestCategory.amount})</Text>
        </View>
  <View style={[styles.summaryCard, darkMode ? styles.summaryCardDark : null, styles.cardShadow, { borderLeftColor: lowestCategory.svg.fill }]}>  
          <Text style={[styles.summaryLabel, darkMode ? styles.summaryLabelDark : null]}>Lowest Category</Text>
          <Text style={[styles.summaryValue, darkMode ? styles.summaryValueDark : null]}>{lowestCategory.label} (₹{lowestCategory.amount})</Text>
        </View>
      </View>

      {/* Pie Chart Panel */}
  <View style={[styles.chartPanel, darkMode ? styles.chartPanelDark : null, styles.cardShadow]}>
  <Text style={[styles.panelTitle, darkMode ? styles.panelTitleDark : null]}>Expenses by Category</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PieChart
            style={{ height: 140, width: 140 }}
            valueAccessor={({ item }: { item: { amount: number } }) => item.amount}
            data={pieData}
            spacing={0}
            outerRadius={'90%'}
          />
          <View style={{ marginLeft: 16 }}>
            {pieData.map((item) => (
              <View key={item.key} style={styles.legendRow}>
                <View style={[styles.legendDot, darkMode ? styles.legendDotDark : null, { backgroundColor: item.svg.fill }]} />
                <Text style={[styles.legendLabel, darkMode ? styles.legendLabelDark : null]}>{item.label}</Text>
                <Text style={[styles.legendValue, darkMode ? styles.legendValueDark : null]}>₹{item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Line Chart Panel - Multi-category Area Chart Style */}
  <View style={[styles.chartPanel, darkMode ? styles.chartPanelDark : null, styles.cardShadow]}>
  <Text style={[styles.panelTitle, darkMode ? styles.panelTitleDark : null]}>Expenses Over Time</Text>
        {/* Legend */}
        <View style={styles.legendAreaRow}>
          <View style={styles.legendAreaItem}><View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} /><Text style={styles.legendLabel}>Food</Text></View>
          <View style={styles.legendAreaItem}><View style={[styles.legendDot, { backgroundColor: '#F59E42' }]} /><Text style={styles.legendLabel}>Transport</Text></View>
          <View style={styles.legendAreaItem}><View style={[styles.legendDot, { backgroundColor: '#60A5FA' }]} /><Text style={styles.legendLabel}>Shopping</Text></View>
          <View style={styles.legendAreaItem}><View style={[styles.legendDot, { backgroundColor: '#10B981' }]} /><Text style={styles.legendLabel}>Bills</Text></View>
        </View>
        <View style={{ height: 240 }}>
          {/* Food Line Chart */}
          <LineChart
            style={StyleSheet.absoluteFill}
            data={foodData}
            svg={{ stroke: '#3B82F6', strokeWidth: 3 }}
            contentInset={{ top: 40, bottom: 40 }}
            curve={require('d3-shape').curveMonotoneX}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: '#CBD5E1', strokeDasharray: [2, 2] }} />
            {foodData.map((value, index) => {
              const x = (index / (foodData.length - 1)) * 320;
              const y = 240 - ((value - Math.min(...foodData.concat(transportData, shoppingData, billsData))) / (Math.max(...foodData.concat(transportData, shoppingData, billsData)) - Math.min(...foodData.concat(transportData, shoppingData, billsData))) * 160 + 40);
              return (
                <G key={index}>
                  <Circle cx={x} cy={y} r={3} fill="#3B82F6" opacity={0.7} />
                </G>
              );
            })}
          </LineChart>
          {/* Transport Line Chart */}
          <LineChart
            style={StyleSheet.absoluteFill}
            data={transportData}
            svg={{ stroke: '#F59E42', strokeWidth: 3 }}
            contentInset={{ top: 40, bottom: 40 }}
            curve={require('d3-shape').curveMonotoneX}
          >
            {transportData.map((value, index) => {
              const x = (index / (transportData.length - 1)) * 320;
              const y = 240 - ((value - Math.min(...foodData.concat(transportData, shoppingData, billsData))) / (Math.max(...foodData.concat(transportData, shoppingData, billsData)) - Math.min(...foodData.concat(transportData, shoppingData, billsData))) * 160 + 40);
              return (
                <G key={index}>
                  <Circle cx={x} cy={y} r={3} fill="#F59E42" opacity={0.7} />
                </G>
              );
            })}
          </LineChart>
          {/* Shopping Line Chart */}
          <LineChart
            style={StyleSheet.absoluteFill}
            data={shoppingData}
            svg={{ stroke: '#60A5FA', strokeWidth: 3 }}
            contentInset={{ top: 40, bottom: 40 }}
            curve={require('d3-shape').curveMonotoneX}
          >
            {shoppingData.map((value, index) => {
              const x = (index / (shoppingData.length - 1)) * 320;
              const y = 240 - ((value - Math.min(...foodData.concat(transportData, shoppingData, billsData))) / (Math.max(...foodData.concat(transportData, shoppingData, billsData)) - Math.min(...foodData.concat(transportData, shoppingData, billsData))) * 160 + 40);
              return (
                <G key={index}>
                  <Circle cx={x} cy={y} r={3} fill="#60A5FA" opacity={0.7} />
                </G>
              );
            })}
          </LineChart>
          {/* Bills Line Chart */}
          <LineChart
            style={StyleSheet.absoluteFill}
            data={billsData}
            svg={{ stroke: '#10B981', strokeWidth: 3 }}
            contentInset={{ top: 40, bottom: 40 }}
            curve={require('d3-shape').curveMonotoneX}
          >
            {billsData.map((value, index) => {
              const x = (index / (billsData.length - 1)) * 320;
              const y = 240 - ((value - Math.min(...foodData.concat(transportData, shoppingData, billsData))) / (Math.max(...foodData.concat(transportData, shoppingData, billsData)) - Math.min(...foodData.concat(transportData, shoppingData, billsData))) * 160 + 40);
              return (
                <G key={index}>
                  <Circle cx={x} cy={y} r={3} fill="#10B981" opacity={0.7} />
                </G>
              );
            })}
          </LineChart>
          {/* Axis labels */}
          <View style={styles.axisRow}>
            {months.map((m, i) => (
              <Text key={m} style={styles.axisLabel}>{m}</Text>
            ))}
          </View>
        </View>
      </View>
  </ScrollView>
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
  cardShadow: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  titleAccent: {
    textShadowColor: '#FDE68A',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    color: '#EC4899',
  },
  containerDark: {
    backgroundColor: '#18181B',
  },
  titleDark: {
    color: '#A5B4FC',
  },
  summaryCardDark: {
    backgroundColor: '#23232A',
    borderColor: '#6366F1',
  },
  summaryLabelDark: {
    color: '#A5B4FC',
  },
  summaryValueDark: {
    color: '#A5B4FC',
  },
  chartPanelDark: {
    backgroundColor: '#23232A',
    borderColor: '#6366F1',
  },
  panelTitleDark: {
    color: '#A5B4FC',
    textShadowColor: '#6366F1',
  },
  legendDotDark: {
    borderColor: '#6366F1',
  },
  legendLabelDark: {
    color: '#A5B4FC',
  },
  legendValueDark: {
    color: '#A5B4FC',
  },
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(180deg, #F9FAFB 0%, #E0E7FF 100%)',
    padding: 16,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 6,
    borderLeftWidth: 5,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  chartPanel: {
    backgroundColor: 'rgba(236,72,153,0.08)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#EC4899',
    letterSpacing: 0.5,
    textShadowColor: '#F9A8D4',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  legendLabel: {
    fontSize: 13,
    color: '#111827',
    width: 70,
  },
  legendValue: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  axisLabel: {
    fontSize: 13,
    color: '#6366F1',
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
  },
  legendAreaRow: {
    flexDirection: 'row',
    marginBottom: 8,
    marginLeft: 8,
    flexWrap: 'wrap',
  },
  legendAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
    marginBottom: 4,
  },
});
