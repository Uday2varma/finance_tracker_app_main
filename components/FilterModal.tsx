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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#EF4444',
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
    color: '#1f2937',
    marginBottom: 12,
  },
  typeOptions: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeTypeOption: {
    backgroundColor: '#3B82F6',
  },
  typeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTypeOptionText: {
    color: 'white',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  activeCategoryOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#eff6ff',
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
    color: '#6b7280',
  },
  activeCategoryOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
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
    color: '#374151',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});