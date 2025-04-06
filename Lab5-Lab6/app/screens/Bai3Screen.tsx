import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSignupMutation } from '../configs/authAPI';
import { Picker } from '@react-native-picker/picker';

const Bai3Screen = () => {
  // State cho các trường form
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');

  const [signup, { data, isLoading, error }] = useSignupMutation();

  // Hàm submit form
  const handleSubmit = async () => {
    if (!name || !age || !email || !password || !gender) {
      Alert.alert('Validation Error', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (isNaN(Number(age)) || Number(age) <= 0) {
      Alert.alert('Validation Error', 'Tuổi phải là một số lớn hơn 0!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Email không hợp lệ!');
      return;
    }

    const userData = {
      name,
      age,
      email,
      password,
      gender,
    };

    try {
      const response = await signup(userData).unwrap();
      Alert.alert('Success', 'Đăng ký thành công!');
      console.log('Response data:', response);
    } catch (err: any) {
      Alert.alert('Error', 'Đăng ký thất bại!');
      console.error('Signup error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Form Builder Basic Demo</Text>

      <Text style={styles.label}>Name*</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>User's Age*</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Email*</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password*</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Gender*</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Nam" value="male" />
          <Picker.Item label="Nữ" value="female" />
        </Picker>
      </View>

      <View style={{ marginTop: 20 }} />

      <Button title="Submit" onPress={handleSubmit} />

      {isLoading && <Text style={styles.info}>Đang gửi dữ liệu...</Text>}
      {error && <Text style={styles.error}>Có lỗi xảy ra khi đăng ký!</Text>}
      {data && (
        <Text style={styles.info}>Server trả về: {JSON.stringify(data)}</Text>
      )}
    </View>
  );
};

export default Bai3Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 4,
    padding: 10,
    borderRadius: 6,
  },
  info: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
