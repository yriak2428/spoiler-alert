import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- Types ---
interface Ingredient {
  name: string;
  amount?: string;
}

interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string;
  color: string;
}

// --- Shared Fridge Inventory Data ---
// In a full build, this would be imported from a shared state/context file.
// Added 'TOMATO' and 'SALT' here so you can instantly see the counter work!
const CURRENT_FRIDGE_INVENTORY = [
  'CABBAGE',
  'CANNED CORN',
  'MEIJI MILK',
  'CREAM CHEESE',
  'CHICKEN WINGS',
  'BACON',
  'BREAD LOAF',
  'TOMATO',
  'SALT'
];

// --- Mock Recipes Data ---
const RECIPES_DATA = {
  nearlyExpiring: [
    {
      id: '1',
      title: 'RED SAUCE PASTA',
      color: '#FFEBEE',
      ingredients: [
        { name: 'TOMATO', amount: '2PCS' },
        { name: 'SALT', amount: '2 TBSP' },
        { name: 'PASTA', amount: '150 GRAMS' },
        { name: 'SUGAR', amount: '1 TBSP' },
        { name: 'PINCH OF BASIL' },
      ],
      instructions: [
        'Boil pasta in salted water until al dente.',
        'Crush fresh tomatoes and simmer in a pan with sugar and salt.',
        'Toss the pasta directly into the sauce and garnish with fresh basil leaves.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80',
    },
  ],
  mixed: [
    {
      id: '2',
      title: 'PINEAPPLE PIZZA',
      color: '#E3F2FD',
      ingredients: [
        { name: 'DICED PINEAPPLE' },
        { name: 'FLOUR', amount: '150 GRAMS' },
        { name: 'BACON' }, // Matches item directly in fridge
        { name: 'YEAST' },
      ],
      instructions: [
        'Prepare and roll out your pizza dough baseline.',
        'Spread an even base layer of tomato sauce and shredded mozzarella.',
        'Scatter your diced pineapples and chosen meats evenly across the top.',
        'Bake at 220°C for 12-15 minutes until the crust edges are completely golden.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    },
  ],
  nonExpiring: [
    {
      id: '3',
      title: 'EGG TART',
      color: '#E8F5E9',
      ingredients: [
        { name: 'EGG YOLKS', amount: '4PCS' },
        { name: 'HEAVY CREAM', amount: '100ML' },
        { name: 'MILK', amount: '100ML' }, // Will match 'MEIJI MILK'
        { name: 'SUGAR', amount: '40 GRAMS' },
        { name: 'PASTRY SHEETS' },
      ],
      instructions: [
        'Whisk egg yolks, heavy cream, milk, and sugar together until perfectly smooth.',
        'Press your pastry sheets firmly into the designated tart molds.',
        'Strain the liquid mixture into the shells to avoid pockets.',
        'Bake at 200°C for roughly 20 minutes until the center custard sets.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1637273483570-10e72651892e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ],
};

// --- Helper Inventory Matcher Logic ---
const checkHasIngredient = (ingredientName: string): boolean => {
  return CURRENT_FRIDGE_INVENTORY.some(fridgeItem => 
    fridgeItem.toLowerCase().includes(ingredientName.toLowerCase()) ||
    ingredientName.toLowerCase().includes(fridgeItem.toLowerCase())
  );
};

// --- Components ---

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Calculate matching items dynamically from the fridge array
  const itemsOwned = recipe.ingredients.filter(ing => checkHasIngredient(ing.name)).length;
  const totalItems = recipe.ingredients.length;

  const toggleDropdown = () => {
    Animated.timing(rotationAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const rotateValue = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={[styles.card, { backgroundColor: recipe.color }]}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
        <View style={styles.ingredientInfo}>
          <Text style={styles.ingredientTitle}>INGREDIENTS:</Text>
          {recipe.ingredients.map((ing, idx) => {
            const owned = checkHasIngredient(ing.name);
            return (
              <Text 
                key={idx} 
                style={[
                  styles.ingredientText, 
                  { color: owned ? '#1B5E20' : '#555', fontWeight: owned ? '900' : '700' }
                ]}
              >
                {owned ? '✓' : '•'} {ing.name} {ing.amount && ing.amount}
              </Text>
            );
          })}
        </View>
        
        <TouchableOpacity 
          style={styles.playButtonContainer} 
          onPress={toggleDropdown}
          activeOpacity={0.7}
        >
          <Animated.View 
            style={[
              styles.playButton, 
              { 
                backgroundColor: recipe.id === '1' ? '#D32F2F' : recipe.id === '2' ? '#1976D2' : '#388E3C',
                transform: [{ rotate: rotateValue }]
              }
            ]}
          >
            <MaterialCommunityIcons name="play" size={20} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      {isExpanded && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>HOW TO COOK:</Text>
          {recipe.instructions.map((step, idx) => (
            <Text key={idx} style={styles.stepText}>
              {idx + 1}. {step}
            </Text>
          ))}
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.progressText}>
          YOU HAVE {itemsOwned}/{totalItems} ITEMS NEEDED FOR THIS RECIPE
        </Text>
      </View>
    </View>
  );
};

const RecipeSection = ({ title, recipes }: { title: string; recipes: Recipe[] }) => (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>{title}</Text>
    {recipes.map(recipe => (
      <RecipeCard key={recipe.id} recipe={recipe} />
    ))}
  </View>
);

const Recipes = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#D35400" />
          <Text style={styles.headerTitle}>MY RECIPES</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
           <MaterialCommunityIcons name="refresh" size={26} color="#D35400" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RecipeSection title="FOR NEARLY EXPIRING:" recipes={RECIPES_DATA.nearlyExpiring} />
        <RecipeSection title="FOR NEARLY EXPIRING + NON EXPIRING:" recipes={RECIPES_DATA.mixed} />
        <RecipeSection title="FOR NON EXPIRING:" recipes={RECIPES_DATA.nonExpiring} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D35400',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 30,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  ingredientInfo: {
    flex: 1,
    marginLeft: 16,
  },
  ingredientTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#333',
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 10,
    lineHeight: 14,
  },
  playButtonContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  instructionsTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#263238',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#455A64',
    lineHeight: 16,
    marginBottom: 4,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    letterSpacing: -0.5,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#666',
    marginTop: 4,
  },
});

export default Recipes;