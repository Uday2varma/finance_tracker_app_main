import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '@/contexts/FinanceContext';
import { Sun, Moon, Bell, Info, DollarSign, Palette, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function SettingsScreen() {
  const { darkMode, setDarkMode } = useFinance();
  const scale = useSharedValue(1);
  const animatedToggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#18181B' : '#F3F4F6' }}>
      <View style={[styles.gradientBg, darkMode ? styles.gradientBgDark : null]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* User Profile Section */}
        <View style={[styles.profileContainer, darkMode && styles.darkProfileContainer, styles.cardShadow]}>
          <View style={styles.profileAvatar}><User size={36} color={darkMode ? '#F9A8D4' : '#6366F1'} /></View>
          <View>
            <Text style={[styles.profileName, darkMode && styles.darkText]}>Uday Kumar</Text>
            <Text style={[styles.profileEmail, darkMode && styles.darkText]}>uday@email.com</Text>
          </View>
        </View>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>Settings</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPressIn={() => { scale.value = withSpring(0.95); }}
            onPressOut={() => { scale.value = withSpring(1); }}
            style={styles.toggleIcon}
          >
            <Animated.View style={animatedToggleStyle}>
              {darkMode ? <Moon size={24} color="#EC4899" /> : <Sun size={24} color="#6366F1" />}
            </Animated.View>
          </TouchableOpacity>
          <Text style={[styles.toggleLabel, darkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#A5B4FC', true: '#6366F1' }}
            thumbColor={darkMode ? '#EC4899' : '#fff'}
          />
        </View>
        <View style={[styles.cardRow]}>
          <LinearGradient
            colors={['#FDE68A', '#EC4899', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.cardShadow]}
          >
            <View style={styles.cardHeader}><DollarSign size={20} color={darkMode ? '#F9A8D4' : '#6366F1'} /><Text style={[styles.cardTitle, darkMode && styles.darkText]}>Change Currency</Text></View>
            <Text style={[styles.cardDesc, darkMode && styles.darkText]}>Switch between ₹, $, etc.</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#FDE68A', '#EC4899', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.cardShadow]}
          >
            <View style={styles.cardHeader}><Palette size={20} color={darkMode ? '#F9A8D4' : '#6366F1'} /><Text style={[styles.cardTitle, darkMode && styles.darkText]}>Theme</Text></View>
            <Text style={[styles.cardDesc, darkMode && styles.darkText]}>Light/Dark mode, accent colors</Text>
          </LinearGradient>
        </View>
        <View style={[styles.cardRow]}>
          <LinearGradient
            colors={['#FDE68A', '#EC4899', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.cardShadow]}
          >
            <View style={styles.cardHeader}><Bell size={20} color={darkMode ? '#F9A8D4' : '#6366F1'} /><Text style={[styles.cardTitle, darkMode && styles.darkText]}>Notifications</Text></View>
            <Text style={[styles.cardDesc, darkMode && styles.darkText]}>Budget alerts, reminders</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#FDE68A', '#EC4899', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.cardShadow]}
          >
            <View style={styles.cardHeader}><Info size={20} color={darkMode ? '#F9A8D4' : '#6366F1'} /><Text style={[styles.cardTitle, darkMode && styles.darkText]}>About</Text></View>
            <Text style={[styles.cardDesc, darkMode && styles.darkText]}>App Version: 1.0.0
Contact Support</Text>
          </LinearGradient>
        </View>
      </ScrollView>
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
  cardShadow: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#18181B',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
    textShadowColor: '#A5B4FC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  darkTitle: {
    color: '#EC4899',
    textShadowColor: '#6366F1',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 18,
  },
  toggleIcon: {
    marginRight: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
    marginRight: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 6,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  darkCard: {
    backgroundColor: '#23272F',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#6366F1',
  },
  cardDesc: {
    fontSize: 14,
    color: '#374151',
  },
  darkText: {
    color: '#F9A8D4',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
  },
  darkProfileContainer: {
    backgroundColor: '#23272F',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A5B4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
});
