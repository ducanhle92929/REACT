// app/(tabs)/explore.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut, User } from 'firebase/auth';

const Explore = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Check if the user is already signed in on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserInfo(user);
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In
  const onGoogleSignIn = async () => {
    try {
      // Use signInWithPopup for web-based Google Sign-In
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUserInfo(user);
      Alert.alert('Success', `Signed in as ${user.displayName}`);
    } catch (error: any) {
      Alert.alert('Sign-In Error', error.message);
    }
  };

  // Handle Sign-Out
  const onSignOut = async () => {
    try {
      await signOut(auth);
      setUserInfo(null);
      Alert.alert('Success', 'You have been signed out.');
    } catch (error: any) {
      Alert.alert('Sign-Out Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.text}>Chào {userInfo.displayName}</Text>
          <Text style={styles.text}>{userInfo.email}</Text>
          <Button title="Đăng xuất" onPress={onSignOut} color="#f4a261" />
        </>
      ) : (
        <Button title="Đăng nhập với Google" onPress={onGoogleSignIn} color="#f4a261" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Explore;