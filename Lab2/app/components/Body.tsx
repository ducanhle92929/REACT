import {
  StyleSheet,
  Text,
  View,
  Button,
  ToastAndroid,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';

type BodyProps = {
  onUpdateInfo: (user: { name: string; avatar: string }) => void;
  onClickChangeBgFooter: () => void;
};

const Body: React.FC<BodyProps> = ({ onUpdateInfo, onClickChangeBgFooter }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleUpdate = () => {
    const randomNum = Math.floor(Math.random() * 1000);

    if (name.length > 0 && link.length > 0) {
      if (link.startsWith('http')) {
        onUpdateInfo({ name, avatar: link });
      } else {
        ToastAndroid.show('Link ảnh không hợp lệ', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Vui lòng nhập đủ thông tin', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập link ảnh"
        value={link}
        onChangeText={setLink}
      />

      <View style={styles.button}>
        <Button title="Cập nhật thông tin" onPress={handleUpdate} />
      </View>
      <View style={styles.button}>
        <Button title="Đổi màu footer" onPress={onClickChangeBgFooter} />
      </View>
    </View>
  );
};

export default Body;

const styles = StyleSheet.create({
  input: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  container: {
    flex: 1,
  },
  button: {
    margin: 10,
  },
});
