import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState, useMemo } from 'react';

const BaiLamThem4 = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState<{ name: string; price: number }[]>(
    []
  );

  const handleSubmit = () => {
    setProducts([...products, { name, price: +price }]);
  };
  const total = useMemo(() => {
    console.log('Tính toán lại ...');
    const result = products?.reduce((_result, prod) => {
      return _result + prod.price;
    }, 0);
    return result;
  }, [products]);

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput value={name} placeholder="Nhập tên" onChangeText={setName} />
      </View>
      <View style={styles.input}>
        <TextInput
          value={price}
          placeholder="Nhập giá"
          onChangeText={setPrice}
        />
      </View>
      <View style={styles.btn}>
        <Button title="Thêm" onPress={handleSubmit} />
      </View>
      <Text style={styles.sumPrice}>Tổng giá: {total}</Text>
      {products?.map((product, index) => (
        <Text style={styles.cal} key={index}>
          {product.name} - {product.price}
        </Text>
      ))}
    </View>
  );
};

export default BaiLamThem4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
    alignContent: 'center',
    justifyContent: 'center',
  },
  sumPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  btn: {
    margin: 20,
    borderRadius: 5,
  },
  cal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
});
