import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import { StatusBar } from 'expo-status-bar';

const bai1 = () => {
  return (
    <View style={{ flex: 1, marginTop: 22 }}>
      <StatusBar style="auto" />
      <Header
        title="Header"
        iconLeft={require('../../assets/images/back.png')}
        iconRight={require('../../assets/images/react-logo.png')}
      />

      <Header
        title="Trang chủ"
        iconLeft={require('../../assets/images/back.png')}
      />
      <Header iconLeft={require('../../assets/images/back.png')} />
    </View>
  );
};

export default bai1;

const styles = StyleSheet.create({});
