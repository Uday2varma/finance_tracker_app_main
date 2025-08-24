import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useFinance, FilterOptions } from '@/contexts/FinanceContext';

interface FilterModalProps {
  visible: boolean;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onClose: () => void;
}

export default function FilterModal({
  visible,
  filters,
  onApplyFilters,
  onClose,
}: FilterModalProps) {
  const { categories } = useFinance();
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = { type: 'all' };
    setTempFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Filter Transactions</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Transaction Type Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Type</Text>
            <View style={styles.typeOptions}>
              {['all', 'income', 'expense'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    tempFilters.type === type && styles.activeTypeOption,
                  ]}
                  onPress={() => updateFilter('type', type)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      tempFilters.type === type && styles.activeTypeOptionText,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryGrid}>
              <TouchableOpacity
                style={[
                  styles.categoryOption,
                  !tempFilters.category && styles.activeCategoryOption,
                ]}
                onPress={() => updateFilter('category', undefined)}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    !tempFilters.category && styles.activeCategoryOptionText,
                  ]}
                >
                  All Categories
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    tempFilters.category === category.name && styles.activeCategoryOption,
                  ]}
                  onPress={() => updateFilter('category', category.name)}
                >
                  <View
                    style={[
                      styles.categoryColor,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      tempFilters.category === category.name && styles.activeCategoryOptionText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Range</Text>
            <View style={styles.dateInputs}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempFilters.startDate || ''}
                  onChangeText={(value) => updateFilter('startDate', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>End Date</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempFilters.endDate || ''}
                  onChangeText={(value) => updateFilter('endDate', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Amount Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amount Range</Text>
            <View style={styles.amountInputs}>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Min</Text>
                <TextInput
                  style={styles.amountInput}
                  value={tempFilters.minAmount ? String(tempFilters.minAmount) : ''}
                  onChangeText={value => updateFilter('minAmount', value ? Number(value) : undefined)}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Max</Text>
                <TextInput
                  style={styles.amountInput}
                  value={tempFilters.maxAmount ? String(tempFilters.maxAmount) : ''}
                  onChangeText={value => updateFilter('maxAmount', value ? Number(value) : undefined)}
                  placeholder="Any"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Notes/Description Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes/Description</Text>
            <TextInput
              style={styles.notesInput}
              value={tempFilters.notes || ''}
              onChangeText={value => updateFilter('notes', value)}
              placeholder="Search notes or description..."
              placeholderTextColor="#9ca3af"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(99,102,241,0.10)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(236,72,153,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: '#EC4899',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EC4899',
    letterSpacing: 1,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  typeOptions: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    borderRadius: 14,
    overflow: 'hidden',
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeTypeOption: {
    backgroundColor: '#EC4899',
  },
  typeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  activeTypeOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 2,
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
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  activeCategoryOptionText: {
    color: '#EC4899',
    fontWeight: 'bold',
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: 'rgba(236,72,153,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#EC4899',
    borderWidth: 1,
    borderColor: '#EC4899',
  },
  amountInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: 'rgba(236,72,153,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#EC4899',
    borderWidth: 1,
    borderColor: '#EC4899',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: 'rgba(236,72,153,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#EC4899',
    borderWidth: 1,
    borderColor: '#EC4899',
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderTopWidth: 1,
    borderTopColor: '#6366F1',
  },
  applyButton: {
    backgroundColor: '#EC4899',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});