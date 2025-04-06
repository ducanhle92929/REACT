import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
    try {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return null;
        }

        // Pick the image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in pickImage:', error);
        throw error;
    }
};

export default pickImage; 