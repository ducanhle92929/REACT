// import { StyleSheet, Text, View, Button } from 'react-native';
// import React, { useState, useCallback, memo } from 'react';

// const BaiLamThem3 = () => {
//   const [count, setCount] = useState(0);

//   const handleIncrease1 = useCallback(() => {
//     setCount((prevCount) => prevCount + 1);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.textCount}>{count}</Text>
//       <ContentUseCallBack onIncrease={handleIncrease1} />
//     </View>
//   );
// };

// export default BaiLamThem3;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textCount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export const ContentUseCallBack = memo(({ onIncrease }: any) => {
//   console.log('re-render');
//   return (
//     <View>
//       <Text>useCallBack</Text>
//       <Button title="Tăng" onPress={onIncrease} />
//     </View>
//   );
// });
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, StatusBar, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 100;
const PROFILE_IMAGE_MAX_SIZE = 60;
const PROFILE_IMAGE_MIN_SIZE = 0;

// Sample data for quizzes
const QUIZZES = [
  {
    id: '1',
    title: 'Design System',
    category: 'Product Design',
    progress: '52 %',
    author: 'Brandon',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    title: 'React Native 101',
    category: 'Development',
    progress: '76 %',
    author: 'Jennifer',
    authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    title: 'Agile Basics',
    category: 'Agile Methodology',
    progress: '23 %',
    author: 'Erik',
    authorImage: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    id: '1',
    title: 'Design System',
    category: 'Product Design',
    progress: '52 %',
    author: 'Brandon',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    title: 'React Native 101',
    category: 'Development',
    progress: '76 %',
    author: 'Jennifer',
    authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    title: 'Agile Basics',
    category: 'Agile Methodology',
    progress: '23 %',
    author: 'Erik',
    authorImage: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    id: '1',
    title: 'Design System',
    category: 'Product Design',
    progress: '52 %',
    author: 'Brandon',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    title: 'React Native 101',
    category: 'Development',
    progress: '76 %',
    author: 'Jennifer',
    authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    title: 'Agile Basics',
    category: 'Agile Methodology',
    progress: '23 %',
    author: 'Erik',
    authorImage: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    id: '1',
    title: 'Design System',
    category: 'Product Design',
    progress: '52 %',
    author: 'Brandon',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    title: 'React Native 101',
    category: 'Development',
    progress: '76 %',
    author: 'Jennifer',
    authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    title: 'Agile Basics',
    category: 'Agile Methodology',
    progress: '23 %',
    author: 'Erik',
    authorImage: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
];

// Navigation tabs
const TABS = ['Popular', 'Product Design', 'Development', 'Project'];

export default function ScrollHeaderAnimation() {
  const scrollY = useSharedValue(0);

  // Handle scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated styles for the header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      height: headerHeight,
    };
  });

  // Animated styles for the greeting text
  const greetingAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [0, -30],
      Extrapolate.CLAMP
    );

    return {
      opacity: withSpring(opacity, { damping: 15, stiffness: 100 }),
      transform: [{ translateY: withSpring(translateY, { damping: 15, stiffness: 100 }) }],
    };
  });

  // Animated styles for the profile image
  const profileImageAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [PROFILE_IMAGE_MAX_SIZE, PROFILE_IMAGE_MIN_SIZE],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 0.7],
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      width: withSpring(size, { damping: 15, stiffness: 100 }),
      height: withSpring(size, { damping: 15, stiffness: 100 }),
      opacity: withSpring(opacity, { damping: 15, stiffness: 100 }),
      transform: [{ translateX: withSpring(translateX, { damping: 15, stiffness: 100 }) }],
    };
  });

  // Animated styles for the tabs container
  const tabsContainerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [0, -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 50)],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: withSpring(translateY, { damping: 15, stiffness: 100 }) }],
    };
  });

  // Render a quiz item
  const renderQuizItem = (item, index) => (
    <View key={item.id} style={styles.quizItem}>
      <View style={styles.quizContent}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <View style={styles.quizMeta}>
          <View style={styles.authorContainer}>
            <Image source={{ uri: item.authorImage }} style={styles.authorImage} />
            <Text style={styles.authorName}>{item.author}</Text>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{item.progress}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00a86b" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {/* Profile and Greeting */}
        <View style={styles.profileContainer}>
          <Animated.Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={[styles.profileImage, profileImageAnimatedStyle]}
          />
          <Animated.View style={[styles.greetingContainer, greetingAnimatedStyle]}>
            <Text style={styles.greeting}>Mornin' Mark!</Text>
            <Text style={styles.subGreeting}>Ready for a quiz?</Text>
          </Animated.View>
        </View>
        
        {/* Tabs */}
        <Animated.View style={[styles.tabsContainer, tabsContainerAnimatedStyle]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {TABS.map((tab, index) => (
              <View key={index} style={[styles.tab, index === 0 ? styles.activeTab : null]}>
                <Text style={[styles.tabText, index === 0 ? styles.activeTabText : null]}>{tab}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Popular Quizzes</Text>
          
          {/* Quiz List */}
          <View style={styles.quizList}>
            {QUIZZES.map((quiz, index) => renderQuizItem(quiz, index))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#00a86b', // Green color from the screenshot
    paddingTop: 50,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  // profileContainer: {
  //   // flexDirection: 'column',
  //   // alignItems: 'center',
  //   marginBottom: 20,
  // },
  profileContainer: {
    flexDirection: 'column',  // Stack children vertically (this is default in React Native)
    // alignItems: 'center',     // Center children horizontally
    marginBottom: 20,
  },
  profileImage: {
    width: PROFILE_IMAGE_MAX_SIZE,
    height: PROFILE_IMAGE_MAX_SIZE,
    borderRadius: PROFILE_IMAGE_MAX_SIZE / 2,
    borderWidth: 2,
    borderColor: 'white',
  },
  greetingContainer: {
    marginLeft: 5,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 3,
  },
  tabsContainer: {
    marginBottom: 10,
  },
  tabsScrollContent: {
    paddingRight: 20,
  },
  tab: {
    marginTop: 0,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 30,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quizList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quizItem: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 12,
    color: '#666',
  },
  categoryContainer: {
    marginTop: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    marginLeft: 10,
  },
  progressBadge: {
    backgroundColor: '#5e5ce6', // Purple color from the screenshot
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});