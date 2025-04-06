import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  decrement,
  multiply,
  RESET_COUNTER,
} from '../configs/counterSlice';

const Bai1Screen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const count = useSelector((state: any) => state.counter.value);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giá trị biến đếm: {count}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Tăng biến đếm"
            onPress={() => dispatch(increment(1))}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Giảm biến đếm"
            onPress={() => dispatch(decrement(1))}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Mũ bình phương"
            onPress={() => dispatch(multiply(count))}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Reset"
            onPress={() => dispatch(RESET_COUNTER())}
            color="#d9534f"
          />
        </View>

        <View style={styles.button}>
          <Button
            title="Sang bài 2 - Lab6"
            onPress={() => navigation.navigate('Bai2Screen')}
            color="#5bc0de"
          />
        </View>
      </View>
    </View>
  );
};

export default Bai1Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    marginVertical: 8,
  },
});
