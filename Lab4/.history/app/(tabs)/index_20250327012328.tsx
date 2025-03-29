import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function Bai1() {
  const [selectImage, setSelectImage] = useState<string | null>(null);
  const defaultImage = "https://png.pngtree.com/png-clipart/20200701/original/pngtree-black-default-avatar-png-image_5407174.jpg"; // Default image URL
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền để tiếp tục.");
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectImage(result.assets[0].uri);
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Chụp ảnh" onPress={takePhoto} />
      <Image
        source={{ uri: selectImage || defaultImage }}
        style={{ width: 300, height: 300, marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
