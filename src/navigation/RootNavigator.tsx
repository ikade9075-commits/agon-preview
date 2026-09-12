import React from 'react';
import { View, StyleSheet, Platform, I18nManager } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { HomeScreen } from '../screens/HomeScreen';
import { AzkarCategoriesScreen } from '../screens/AzkarCategoriesScreen';
import { TasbeehScreen } from '../screens/TasbeehScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ZikrListScreen } from '../screens/ZikrListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { CategoryId } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  ZikrList: { categoryId: CategoryId };
  Favorites: undefined;
  Achievements: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  const { colors, isDark } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="الرئيسية"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          height: Platform.OS === 'ios' ? 84 : 68 + Math.min(insets.bottom, 12),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 4 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="الرئيسية"
        component={HomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="الأذكار"
        component={AzkarCategoriesScreen}
        options={{
          tabBarLabel: 'الأذكار',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="المسبحة"
        component={TasbeehScreen}
        options={{
          tabBarLabel: 'المسبحة',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'radio-button-on' : 'radio-button-off-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="الإعدادات"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'الإعدادات',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export const RootNavigator = () => {
  const { colors, isDark } = useApp();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="ZikrList" component={ZikrListScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
