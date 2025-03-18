import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useContext, createContext, useState } from 'react';

export const ThemeContext = createContext('light');

const BaiLamThem5 = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={theme}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>UseContextScreen</Text>
        <Button title="Đổi theme" onPress={toggleTheme} />
        <Paragraph />
      </View>
    </ThemeContext.Provider>
  );
};

export default BaiLamThem5;

const styles = StyleSheet.create({});

export function Paragraph() {
  const theme = useContext(ThemeContext);
  return (
    <View style={{ backgroundColor: theme === 'light' ? 'white' : 'gray' }}>
      <Text>
        Lớp học React Native là một lớp học tuyệt vời, với những kiến thức cực
        kỳ dễ học và trần đầy yêu thương
      </Text>
    </View>
  );
}
