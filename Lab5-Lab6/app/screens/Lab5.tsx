import { StyleSheet, TouchableOpacity, Image, Text, View, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import pickImage from '../utils/imagePickerHelper';
import { addImage } from '../configs/imageSlice';


export default function Lab5({ navigation }: any) {
    const dispatch = useDispatch();
    const images = useSelector((state: any) => state.images?.selectedImages || []);

    const handlePickImage = async () => {
        try {
            const result = await pickImage();
            if (result) {
                dispatch(addImage(result));
                console.log('Image picked:', result);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    console.log('Selected images:', images);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Image Picker Demo</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handlePickImage}
            >
                <Text style={styles.buttonText}>Pick Image from Library</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {images && images.length > 0 ? (
                    images.map((image: any, index: any) => (
                        <View key={index} style={styles.imageWrapper}>
                            {image.assets && image.assets[0] && (
                                <Image
                                    source={{ uri: image.assets[0].uri }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noImageText}>No images selected</Text>
                )}
            </View>

            <View style={{ marginTop: 100 }}></View>
            <Button
                title="Go to Bai1Screen"
                onPress={() => navigation.navigate('Bai1Screen')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    button: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
    },
    imageWrapper: {
        width: 150,
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    noImageText: {
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
});