// import { StyleSheet, Text, View, Button } from 'react-native';
// import React, { useState, useEffect, useRef, memo } from 'react';

// const BaiLamThem = () => {
//   const [count, setCount] = useState(0);
//   const [count2, setCount2] = useState(0);

//   const handleIncrease = () => {
//     setCount(count + 1);
//   };

//   useEffect(() => {
//     // prevCount.current = count;
//   }, [count]);

//   useEffect(() => {
//     console.log('useEffect này chạy mỗi lần component render, count = ', count);
//   });

//   useEffect(() => {
//     console.log('useEffect chỉ chạy lần đầu tiên khi component render');
//   }, []);

//   useEffect(() => {
//     console.log(
//       'useEffect khởi chạy khi count thay đổi giá trị, count = ',
//       count
//     );
//   }, [count]);

//   //useRef
//   const prevCount = useRef<number | undefined>();

//   useEffect(() => {
//     prevCount.current = count;
//   }, [count]);

//   console.log('prevCount = ', prevCount.current, 'count = ', count);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Ví dụ về useState, useEffect, useRef</Text>
//       <Text style={styles.textCount}>{count}</Text>
//       <View style={styles.button}>
//         <Button title="Tăng" onPress={handleIncrease} />
//       </View>
//     </View>
//   );
// };

// export default BaiLamThem;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 22,
//     alignContent: 'center',
//     justifyContent: 'center',
//   },
//   textCount: {
//     fontSize: 30,
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 20,
//     textAlign: 'center',
//   },
//   button: {
//     width: 100,
//     alignSelf: 'center',
//     marginTop: 10,
//   },
//   seperate: {
//     marginVertical: 10,
//   },
// });
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function MovingBoxAnimation() {
  // Create a shared value for the vertical position
  const offset = useSharedValue(100);

  // Create animated style based on the offset value
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  // Function to move the box to a random position
  const moveBox = () => {
    // Generate random position within screen bounds (leaving margin at top and bottom)
    const randomPosition = Math.random() * (height - 200) + 50;
    // Animate to the new position with spring animation for smooth movement
    offset.value = withSpring(randomPosition, {
      damping: 15,
      stiffness: 100,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyles]} />
      
      <TouchableOpacity style={styles.button} onPress={moveBox}>
        <Text style={styles.buttonText}>Move</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 400,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#3498db',
    borderRadius: 10,
    position: 'absolute',
    left: '50%',
    marginLeft: -50, // Half of width to center
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});