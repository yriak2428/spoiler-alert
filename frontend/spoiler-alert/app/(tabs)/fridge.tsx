import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AddItem from '../components/addItem';
import AddPhoto from '../components/addPhoto';
import { ScreenHeader, StatusPill } from '../components/ui';
import { colors, radius, shadow, spacing, type } from '../constants/theme';
import { FoodItem, useFoodItems } from '../components/foodData';

interface CategoryProps {
  title: string;
  items: FoodItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Fruits and Vegetables': 'leaf-outline',
  'Meat and Dairy': 'restaurant-outline',
  Carbohydrates: 'nutrition-outline',
  Others: 'nutrition-outline',
};

const CATEGORIES = ['Fruits and Vegetables', 'Meat and Dairy', 'Carbohydrates', 'Others'];

const ItemCard = ({ item }: { item: FoodItem }) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.iconContainer}>
        <Ionicons name={CATEGORY_ICON[item.category] ?? 'nutrition-outline'} size={20} color={colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemExpiry}>Exp: {item.expiryDate}</Text>
      </View>
     {item.status === 'near' ? (
        <StatusPill label="Soon" status="near" />
      ) : item.status === 'expired' ? (
        <StatusPill label="Expired" status="expired" />
      ) : (
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const CategorySection = ({ title, items, isOpen, onToggle }: CategoryProps) => (
  <View style={styles.categoryWrapper}>
    <TouchableOpacity style={styles.categoryHeader} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.categoryTitle}>{title.toUpperCase()}</Text>
      <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.itemsList}>
        {items.map(item => <ItemCard key={item.id} item={item} />)}
      </View>
    )}
  </View>
);

const Fridge = () => {
  const foodItems = useFoodItems();

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Fruits and Vegetables': true,
    'Meat and Dairy': true,
    'Carbohydrates': true,
    Others: true,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const itemsByCategory = CATEGORIES.reduce<Record<string, FoodItem[]>>((acc, category) => {
    acc[category] = foodItems.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader title="My Fridge" icon="file-tray-stacked-outline" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((title) => (
          <CategorySection
            key={title}
            title={title}
            items={itemsByCategory[title]}
            isOpen={openCategories[title]}
            onToggle={() => toggleCategory(title)}
          />
        ))}
      </ScrollView>

      <View style={styles.actionRow}>
        <View style={styles.actionButtonContainer}>
          <AddItem />
        </View>
        <View style={styles.actionButtonContainer}>
          <AddPhoto />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  categoryWrapper: {
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  categoryTitle: {
    ...type.caption,
    color: colors.textSecondary,
  },
  itemsList: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadow.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    ...type.bodyMedium,
    color: colors.textPrimary,
  },
  itemExpiry: {
    ...type.footnote,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButtonContainer: {
    flex: 1,
  },
});

export default Fridge;