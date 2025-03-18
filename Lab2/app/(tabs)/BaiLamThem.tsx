import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect, useRef, memo } from 'react';

const BaiLamThem = () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const handleIncrease = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    // prevCount.current = count;
  }, [count]);

  useEffect(() => {
    console.log('useEffect này chạy mỗi lần component render, count = ', count);
  });

  useEffect(() => {
    console.log('useEffect chỉ chạy lần đầu tiên khi component render');
  }, []);

  useEffect(() => {
    console.log(
      'useEffect khởi chạy khi count thay đổi giá trị, count = ',
      count
    );
  }, [count]);

  //useRef
  const prevCount = useRef<number | undefined>();

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  console.log('prevCount = ', prevCount.current, 'count = ', count);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ví dụ về useState, useEffect, useRef</Text>
      <Text style={styles.textCount}>{count}</Text>
      <View style={styles.button}>
        <Button title="Tăng" onPress={handleIncrease} />
      </View>
    </View>
  );
};

export default BaiLamThem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
    alignContent: 'center',
    justifyContent: 'center',
  },
  textCount: {
    fontSize: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    width: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  seperate: {
    marginVertical: 10,
  },
});
