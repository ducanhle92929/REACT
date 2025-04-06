import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useLazyGetPokemonByNameQuery } from '../configs/pokemonAPI';

const Bai2Screen = ({ navigation }: any) => {
  // State để lưu tên pokemon mà người dùng nhập
  const [pokemonName, setPokemonName] = useState('');

  // Hook lazy query: trigger để gọi API, data/error/isLoading để theo dõi trạng thái
  const [trigger, { data, error, isLoading }] = useLazyGetPokemonByNameQuery();

  // Hàm gọi API khi nhấn nút
  const handleSearch = useCallback(() => {
    if (pokemonName.trim()) {
      trigger(pokemonName.toLowerCase());
    }
  }, [pokemonName, trigger]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin pokemon {pokemonName}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên pokemon (vd: ivysaur, pikachu, ...)"
        value={pokemonName}
        onChangeText={setPokemonName}
      />
      <Button title="Tìm kiếm pokemon" onPress={handleSearch} />

      {/* Trạng thái loading */}
      {isLoading && <Text style={styles.info}>Đang tải...</Text>}

      {/* Hiển thị dữ liệu nếu có */}
      {data && (
        <View style={styles.resultContainer}>
          <Text style={styles.info}>Tên: {data.name}</Text>
          <Text style={styles.info}>Chiều cao: {data.height}</Text>
          <Text style={styles.info}>Cân nặng: {data.weight}</Text>
          <Text style={styles.info}>
            Kỹ năng:
            {data.abilities
              .map((abilityObj: any) => abilityObj.ability.name)
              .join(', ')}
          </Text>
        </View>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Text style={styles.error}>
          Không tìm thấy pokemon hoặc có lỗi xảy ra!
        </Text>
      )}

      <View style={{ marginTop: 16 }} />

      <Button
        title="Sang bài 3"
        onPress={() => navigation.navigate('Bai3Screen')}
      />
    </View>
  );
};

export default Bai2Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 10,
    borderRadius: 6,
  },
  resultContainer: {
    marginTop: 16,
  },
  info: {
    fontSize: 16,
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
});
