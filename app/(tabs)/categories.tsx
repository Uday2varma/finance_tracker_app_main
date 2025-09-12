import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance, Category } from '@/contexts/FinanceContext';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#FFB347', '#87CEEB', '#98FB98', '#F0E68C'
];

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, setBudget, getBudget, getCategoryUsage, darkMode } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSelectedColor(colors[0]);
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert('Cannot Edit', 'Default categories cannot be edited');
      return;
    }
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedColor(category.color);
    setShowModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert('Cannot Delete', 'Default categories cannot be deleted');
      return;
    }
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category.id) },
      ]
    );
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert('Validation Error', 'Category name cannot be empty');
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryName.trim(),
        color: selectedColor,
        isDefault: false,
      });
    } else {
      addCategory({
        name: categoryName.trim(),
        color: selectedColor,
        isDefault: false,
      });
    }
    setShowModal(false);
    setCategoryName('');
    setSelectedColor(colors[0]);
    setEditingCategory(null);
  };

  function renderCategory({ item }: { item: Category }) {
    // Choose a unique gradient for each category based on its color
    const gradients: { [key: string]: string[] } = {
      Food: ['#ffecd2', '#fcb69f', '#ff6b6b'],
      Travel: ['#a1c4fd', '#c2e9fb', '#4ecdc4'],
      Rent: ['#d4fc79', '#96e6a1', '#45b7d1'],
      Salary: ['#fbc2eb', '#a6c1ee', '#96ceb4'],
      Utilities: ['#f9d423', '#ff4e50', '#ffeaa7'],
      Entertainment: ['#a18cd1', '#fbc2eb', '#dda0dd'],
    };
    const gradientColors: [string, string, string] = gradients[item.name] ? gradients[item.name] as [string, string, string] : ["#e0eafc", "#cfdef3", item.color];
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.categoryCard, styles.cardShadow]}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryLeft}>
            <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryType}>
                {item.isDefault ? 'Default Category' : 'Custom Category'}
              </Text>
            </View>
          </View>
          <View style={styles.categoryActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditCategory(item)}
              disabled={item.isDefault}
            >
              <Edit3 size={16} color={item.isDefault ? '#9ca3af' : '#3B82F6'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteCategory(item)}
              disabled={item.isDefault}
            >
              <Trash2 size={16} color={item.isDefault ? '#9ca3af' : '#EF4444'} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Budget Section */}
        <View style={styles.budgetSection}>
          <Text style={styles.budgetLabel}>Budget (₹):</Text>
          <TextInput
            style={styles.budgetInput}
            keyboardType="numeric"
            value={getBudget(item.name)?.toString() || ''}
            onChangeText={text => {
              const val = Number(text);
              if (!isNaN(val) && val >= 0) setBudget(item.name, val);
            }}
            placeholder="Set budget"
            placeholderTextColor="#9ca3af"
          />
          <View style={styles.progressRow}>
            <View style={styles.progressBarOuter}>
              <View style={[styles.progressBarInner, {
                width: `${Math.min(getCategoryUsage(item.name) / (getBudget(item.name) || 1), 1) * 100}%`,
                backgroundColor: item.color
              }]} />
            </View>
            <Text style={styles.progressText}>
              ₹{getCategoryUsage(item.name)} / ₹{getBudget(item.name) || 0}
            </Text>
          </View>
          {(() => {
            const budget = getBudget(item.name);
            return typeof budget === 'number' && budget > 0 && getCategoryUsage(item.name) > budget ? (
              <Text style={styles.alertText}>Over budget!</Text>
            ) : null;
          })()}
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#18181B' : '#F3F4F6' }}>
      <View style={[styles.gradientBg, darkMode ? styles.gradientBgDark : null]} />
      {categories.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: darkMode ? '#A5B4FC' : '#6366F1', fontSize: 18, marginBottom: 16, textAlign: 'center' }}>
            No categories found. Add your first category to get started!
          </Text>
          <TouchableOpacity
            onPress={handleAddCategory}
            style={{ backgroundColor: '#3B82F6', borderRadius: 24, padding: 16, marginTop: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>+ Add Category</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={null}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        activeOpacity={0.8}
        onPress={handleAddCategory}
        style={{ position: 'absolute', right: 24, bottom: 32 }}
      >
        <Animated.View style={[styles.addButton, animatedBtnStyle]}>
          <Plus size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalOverlay, { zIndex: 1000 }]}> 
          <View style={[styles.modalCard, darkMode ? styles.modalCardDark : null, styles.cardShadow, { alignSelf: 'center', marginTop: '30%', minHeight: 340 }]}> 
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCategory}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.modalContent, { paddingBottom: 12 }]}> 
              <View style={[styles.inputSection, { marginBottom: 10 }]}> 
                <Text style={styles.inputLabel}>Category Name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { marginBottom: 16, zIndex: 2, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' }
                  ]}
                  value={categoryName}
                  onChangeText={setCategoryName}
                  placeholder="Enter category name"
                  placeholderTextColor="#9ca3af"
                  autoFocus
                />
              </View>
              <View style={[styles.colorSection, { marginBottom: 18, zIndex: 1 }]}> 
                <Text style={styles.inputLabel}>Color</Text>
                <View style={styles.colorGrid}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColorOption,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.previewSection}> 
                <Text style={styles.inputLabel}>Preview</Text>
                <View style={styles.previewCard}>
                  <View
                    style={[styles.categoryColor, { backgroundColor: selectedColor }]}
                  />
                  <Text style={styles.previewText}>
                    {categoryName || 'Category Name'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'transparent',
    // Simulate gradient with a light accent color
    opacity: 0.9,
  },
  gradientBgDark: {
    backgroundColor: '#18181B',
    opacity: 0.95,
  },
  cardShadow: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  animatedBtn: {
    transform: [{ scale: 1 }],
  },
  budgetSection: {
    marginTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 6,
    width: 120,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressBarOuter: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E7FF',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  alertText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryCard: {
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A5B4FC',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  categoryType: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#eff6ff',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  modalCardDark: {
    backgroundColor: '#23232A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 12,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorSection: {
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#3B82F6',
  },
  previewSection: {
    marginBottom: 16,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    padding: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
});