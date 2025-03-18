import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import CustomInput from '../../components/CustomInput';

const bai3: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <CustomInput
            title="Username"
            value={text}
            onChangeText={setText}
            placeholder="Enter your username"
            required={true}
          />

          <CustomInput
            title="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            required={true}
            eyePassword={true}
            secureTextEntry={!passwordVisible}
            onPressEyeIcon={() => setPasswordVisible(!passwordVisible)}
          />

          <CustomInput
            title="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            error={
              email && !email.includes('@')
                ? 'Please enter a valid email address'
                : ''
            }
            keyboardType="email-address"
            description="We'll never share your email with anyone else"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
});

export default bai3;
