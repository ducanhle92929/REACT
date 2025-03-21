// import { StyleSheet, Text, View, Button } from 'react-native';
// import React, { useState, memo } from 'react';

// const BaiLamThem2 = () => {
//   const [count, setCount] = useState(0);
//   const [count2, setCount2] = useState(0);

//   const handleIncrease = () => {
//     setCount((prev) => prev + 1);
//   };
//   const handleIncrease2 = () => {
//     setCount2((prev) => prev + 1);
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Ví dụ 1 về memo</Text>
//       <Text style={styles.textCount}>
//         {count} - {count2}
//       </Text>
//       <Button title="Tăng state 1" onPress={handleIncrease} />
//       <View style={styles.seperate} />
//       <Button title="Tăng state 2" onPress={handleIncrease2} />
//       <Content count={count} />
//     </View>
//   );
// };

// export default BaiLamThem2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container1: {
//     marginTop: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textCount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   seperate: {
//     marginVertical: 10,
//   },
// });

// type ContentProps = {
//   count: number;
// };

// export const Content = memo(({ count }: ContentProps) => {
//   console.log('re-render in Content, count =  ', count);
//   return (
//     <View style={styles.container1}>
//       <Text>Lop hoc Da Nen Tang 2</Text>
//     </View>
//   );
// });
import React, { useState, useRef, memo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Generate dummy data
const DATA = Array.from({ length: 50 }, (_, index) => ({
  id: String(index),
  title: `Item ${index}`,
}));

// Memoized item component to prevent unnecessary re-renders
const Item = memo(({ item, visibleItems }) => {
  // Check if this item is visible in the viewport
  const isVisible = visibleItems.includes(item.id);
  
  // Create animated styles for opacity and scale
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 500 }),
      transform: [
        { scale: withTiming(isVisible ? 1 : 0.8, { duration: 500 }) }
      ],
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyles]}>
      <Text style={styles.itemText}>{item.title}</Text>
    </Animated.View>
  );
});

export default function AnimatedFlatList() {
  // Track which items are currently visible
  const [visibleItems, setVisibleItems] = useState([]);
  
  // Configure viewability config
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is in viewport
  });

  // Handle changes to visible items
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    // Extract IDs of visible items
    const visibleItemIds = viewableItems.map(item => item.key);
    setVisibleItems(visibleItemIds);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Animated List</Text>
      
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Item item={item} visibleItems={visibleItems} />
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
  },
});