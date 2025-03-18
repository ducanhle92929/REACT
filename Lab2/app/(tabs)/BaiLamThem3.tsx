import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useCallback, memo } from 'react';

const BaiLamThem3 = () => {
  const [count, setCount] = useState(0);

  const handleIncrease1 = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textCount}>{count}</Text>
      <ContentUseCallBack onIncrease={handleIncrease1} />
    </View>
  );
};

export default BaiLamThem3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export const ContentUseCallBack = memo(({ onIncrease }: any) => {
  console.log('re-render');
  return (
    <View>
      <Text>useCallBack</Text>
      <Button title="Tăng" onPress={onIncrease} />
    </View>
  );
});
