import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, memo } from 'react';

const BaiLamThem2 = () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const handleIncrease = () => {
    setCount((prev) => prev + 1);
  };
  const handleIncrease2 = () => {
    setCount2((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text>Ví dụ 1 về memo</Text>
      <Text style={styles.textCount}>
        {count} - {count2}
      </Text>
      <Button title="Tăng state 1" onPress={handleIncrease} />
      <View style={styles.seperate} />
      <Button title="Tăng state 2" onPress={handleIncrease2} />
      <Content count={count} />
    </View>
  );
};

export default BaiLamThem2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seperate: {
    marginVertical: 10,
  },
});

type ContentProps = {
  count: number;
};

export const Content = memo(({ count }: ContentProps) => {
  console.log('re-render in Content, count =  ', count);
  return (
    <View style={styles.container1}>
      <Text>Lop hoc Da Nen Tang 2</Text>
    </View>
  );
});
