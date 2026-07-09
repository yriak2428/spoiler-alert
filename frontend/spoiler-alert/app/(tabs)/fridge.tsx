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
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import your functional components
import AddItem from '../components/addItem';
import AddPhoto from '../components/addPhoto';

// --- Types ---
interface FridgeItem {
  id: string;
  name: string;
  expiryDate: string;
  type: 'vegetable' | 'dairy' | 'meat' | 'grain' | 'other';
  isExpiringSoon?: boolean;
}

interface CategoryProps {
  title: string;
  items: FridgeItem[];
  isOpen: boolean;
  onToggle: () => void;
}

// --- Mock Data ---
const INITIAL_DATA: Record<string, FridgeItem[]> = {
  'FRUITS AND VEGETABLES': [
    { id: '1', name: 'CABBAGE', expiryDate: '06/02/2026', type: 'vegetable' },
    { id: '2', name: 'CANNED CORN', expiryDate: '20/02/2026', type: 'vegetable' },
  ],
  'MEAT AND DAIRY': [
    { id: '3', name: 'MEIJI MILK', expiryDate: '31/01/2026', type: 'dairy', isExpiringSoon: true },
    { id: '4', name: 'CREAM CHEESE', expiryDate: '02/02/2026', type: 'dairy', isExpiringSoon: true },
    { id: '5', name: 'CHICKEN WINGS', expiryDate: '03/02/2026', type: 'meat', isExpiringSoon: true },
    { id: '6', name: 'BACON', expiryDate: '20/02/2026', type: 'meat' },
  ],
  'OTHERS': [
    { id: '7', name: 'BREAD LOAF', expiryDate: '09/02/2026', type: 'other' },
  ],
};

// --- Components ---

const ItemCard = ({ item }: { item: FridgeItem }) => {
  const getBorderColor = () => {
    if (item.isExpiringSoon) return '#FFEBEE'; 
    if (item.type === 'vegetable') return '#E8F5E9'; 
    return '#E3F2FD'; 
  };

  const getIcon = () => {
    switch (item.type) {
      case 'vegetable': return 'leaf';
      case 'dairy': return 'water';
      case 'meat': return 'food-steak';
      case 'other': return 'bread-slice';
      default: return 'dots-horizontal';
    }
  };

  const getIconBg = () => {
    if (item.isExpiringSoon) return '#FFEBEE';
    if (item.type === 'vegetable') return '#B9F6CA';
    return '#BBDEFB';
  };

  const getIconColor = () => {
    if (item.isExpiringSoon) return '#B71C1C';
    if (item.type === 'vegetable') return '#1B5E20';
    return '#0D47A1';
  };

  return (
    <View style={[styles.itemCard, { borderColor: getBorderColor() }]}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBg() }]}>
        <MaterialCommunityIcons name={getIcon()} size={24} color={getIconColor()} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemExpiry}>Exp: {item.expiryDate}</Text>
      </View>
      <MaterialCommunityIcons 
        name={item.isExpiringSoon ? "alert-circle" : "dots-horizontal"} 
        size={24} 
        color={item.isExpiringSoon ? "#D32F2F" : "#757575"} 
      />
    </View>
  );
};

const CategorySection = ({ title, items, isOpen, onToggle }: CategoryProps) => (
  <View style={styles.categoryWrapper}>
    <TouchableOpacity style={styles.categoryHeader} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <MaterialCommunityIcons 
        name={isOpen ? "chevron-up" : "chevron-down"} 
        size={24} 
        color="#5D4037" 
      />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.itemsList}>
        {items.map(item => <ItemCard key={item.id} item={item} />)}
      </View>
    )}
  </View>
);

const Fridge = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'FRUITS AND VEGETABLES': true,
    'MEAT AND DAIRY': true,
    'OTHERS': true,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="fridge" size={28} color="#D35400" />
          <Text style={styles.headerTitle}>MY FRIDGE</Text>
        </View>
      </View>

      {/* Main Scroll Container */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.entries(INITIAL_DATA).map(([title, items]) => (
          <CategorySection
            key={title}
            title={title}
            items={items}
            isOpen={openCategories[title]}
            onToggle={() => toggleCategory(title)}
          />
        ))}
      </ScrollView>
      
      {/* Persistent Sticky Action Row at the bottom */}
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D35400',
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 16,
  },
  categoryWrapper: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5D4037',
    letterSpacing: 0.5,
  },
  itemsList: {
    marginTop: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263238',
  },
  itemExpiry: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButtonContainer: {
    flex: 1,
  },
});

export default Fridge;