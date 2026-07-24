import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActionSheetIOS, FlatList, Modal, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { homePageStyles } from '../assets/styles/home.style';
import { colors, statusColors } from '../constants/theme';
import AddItem, { AddItemHandle } from '../components/addItem';
import AddPhoto, { AddPhotoHandle } from '../components/addPhoto';
import HomeDashboardSheet from '../components/homeDashboardSheet';
import SemiDonutChart from '../components/semiDonutChart';
import TodaysDate from '../components/todaysDate';
import { Button, Card } from '../components/ui';
import { FoodItem, FoodStatus, useFoodItems, addFoodItem } from '../components/foodData'; 

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Fruits and Vegetables': 'leaf-outline',
  'Meat and Dairy': 'restaurant-outline',
  Carbohydrates: 'nutrition-outline',
  Others: 'nutrition-outline',
};

const FoodCarousel = ({
  title,
  status,
  items,
  styles,
}: {
  title: string;
  status: FoodStatus;
  items: FoodItem[];
  styles: ReturnType<typeof homePageStyles>;
}) => {
  const { fg, bg } = statusColors[status];

  return (
    <Card>
      <View style={styles.itemHeader}>
        <View style={[styles.statusDot, { backgroundColor: fg }]} />
        <Text style={styles.itemHeaderText}>{title}</Text>
      </View>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nothing here yet.</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <View style={[styles.itemTile, { backgroundColor: bg }]}>
              <View style={styles.itemTileIconWrap}>
                <Ionicons name={CATEGORY_ICON[item.category] ?? 'nutrition-outline'} size={16} color={colors.textPrimary} />
              </View>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemMeta} numberOfLines={1}>{item.category}</Text>
              <Text style={styles.itemMeta}>{item.expiryDate}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      )}
    </Card>
  );
};

const Home = () => {
  const styles = homePageStyles();
  const foodItems = useFoodItems();

  const fridgeCount = foodItems.length;
  const nearItems = foodItems.filter((i) => i.status === 'near');
  const safeItems = foodItems.filter((i) => i.status === 'safe');
  const expiredItems = foodItems.filter((i) => i.status === 'expired');
  const wasteCount = expiredItems.length;
  const statusCounts = { safe: safeItems.length, near: nearItems.length, expired: expiredItems.length };

  const addItemRef = useRef<AddItemHandle>(null);
  const addPhotoRef = useRef<AddPhotoHandle>(null);
  const [fallbackSheetVisible, setFallbackSheetVisible] = useState(false);
  const [bannerRevealed, setBannerRevealed] = useState(true);

  const openAddSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Item', 'Scan Item'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) addItemRef.current?.open();
          if (buttonIndex === 2) addPhotoRef.current?.open();
        }
      );
    } else {
      setFallbackSheetVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={bannerRevealed ? 'light-content' : 'dark-content'} />

      <HomeDashboardSheet onRevealChange={setBannerRevealed}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>TODAY</Text>
          <TodaysDate />
        </View>

        <Card>
          <View style={styles.statsRow}>
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>Food in Fridge</Text>
              <Text style={styles.statValue}>{fridgeCount}</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>Food Wasted</Text>
              <Text style={[styles.statValue, { color: statusColors.expired.fg }]}>{wasteCount}</Text>
            </View>
          </View>

          {nearItems.length > 0 && (
            <View style={styles.nearRow}>
              <Ionicons name="time-outline" size={16} color={statusColors.near.fg} />
              <Text style={styles.nearText}>
                Near expiry: {nearItems.map((i) => i.name).join(', ')}
              </Text>
            </View>
          )}
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartLabel}>Food Status</Text>
          <SemiDonutChart counts={statusCounts} />
        </Card>

        <FoodCarousel title="Near Expiry" status="near" items={nearItems} styles={styles} />
        <FoodCarousel title="Safe" status="safe" items={safeItems} styles={styles} />
        <FoodCarousel title="Expired" status="expired" items={expiredItems} styles={styles} />
        <Card>
          <View style={styles.recipeRow}>
            <View style={styles.recipeImagePlaceholder}>
              <Ionicons name="restaurant-outline" size={28} color={statusColors.safe.fg} />
            </View>
            <View style={styles.recipeTextBlock}>
              <Text style={styles.recipeTitle}>Use It Up</Text>
              <Text style={styles.recipeDescription} numberOfLines={2}>
                {nearItems.length > 0
                  ? `A quick recipe idea using ${nearItems.map((i) => i.name).join(' & ')} before they expire.`
                  : 'Recipe ideas based on what needs using up soon will show up here.'}
              </Text>
            </View>
          </View>
          <Button
            title="View Recipe"
            variant="secondary"
            style={styles.recipeCta}
            onPress={() => router.push('/recipes')}
          />
        </Card>

        <TouchableOpacity
          style={styles.expiredCta}
          onPress={() => router.push('/expired-food-guide')}
          activeOpacity={0.8}
        >
          <Ionicons name="alert-circle-outline" size={18} color={statusColors.expired.fg} />
          <Text style={styles.expiredCtaText}>What To Do With Expired Food?</Text>
        </TouchableOpacity>
      </HomeDashboardSheet>

      <View style={styles.fabWrapper}>
        <TouchableOpacity style={styles.fab} onPress={openAddSheet} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#FFFBF5" />
        </TouchableOpacity>
      </View>

      {/* Controlled by the FAB's action sheet; each keeps its own modal/camera UI */}
      <AddItem ref={addItemRef} hideTrigger />
      <AddPhoto ref={addPhotoRef} hideTrigger />

      <Modal visible={fallbackSheetVisible} animationType="slide" transparent onRequestClose={() => setFallbackSheetVisible(false)}>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setFallbackSheetVisible(false)}>
          <View style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>Add to your fridge</Text>
            <Button
              title="Add Item"
              variant="secondary"
              onPress={() => {
                setFallbackSheetVisible(false);
                addItemRef.current?.open();
              }}
            />
            <Button
              title="Scan Item"
              variant="secondary"
              onPress={() => {
                setFallbackSheetVisible(false);
                addPhotoRef.current?.open();
              }}
            />
            <Button title="Cancel" variant="ghost" onPress={() => setFallbackSheetVisible(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default Home
