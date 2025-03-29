import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
const playlist = [
    {
        title: "Bài 1",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        image: "https://www.bing.com/th?id=OIP.m8wvpHwr7GxZc2_7AAE2GAHaJ4&w=80&h=104&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    },
    {
        title: "Bài 2",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        image: "https://www.bing.com/th?id=OIP.h_REyr4IhtYw-7Zk-aJeLQHaE8&w=153&h=102&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    },
    {
        title: "Bài 3",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        image: "https://th.bing.com/th/id/OIP.CFG1RgZ9gTRtNgk_wWxG8QHaEO?w=293&h=180&c=7&r=0&o=5&dpr=1.1&pid=1.7",
    },
    {
        title: "Bài 4",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        image: "https://th.bing.com/th/id/OIP.CFG1RgZ9gTRtNgk_wWxG8QHaEO?w=293&h=180&c=7&r=0&o=5&dpr=1.1&pid=1.7",
    },
    {
        title: "Bài 5",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        image: "https://www.bing.com/th?id=OIP.xqYunaXLEIiIBgbHGncjBQHaHa&w=105&h=104&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    },
];

export default function Bai3() {
    const navigation = useNavigation();
    const [sliderValue, setSliderValue] = useState(0);
    const soundRef = useRef<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState<Audio.AVPlaybackStatus | null>(null);
    const [currentTrack, setCurrentTrack] = useState(0);
    const insets = useSafeAreaInsets();
    useEffect(() => {
        loadTrack(currentTrack);
        console.log(`Now playing: ${playlist[currentTrack].title}`); // Log current track title

        const interval = setInterval(() => {
            updateSlider();
        }, 500); // Cập nhật mỗi 500ms

        return () => {
            if (soundRef.current) soundRef.current.unloadAsync();
            clearInterval(interval); // Xóa interval khi component unmount
        };
    }, [currentTrack]);

    useEffect(() => {
        setupAudioMode();
        return () => {
            if (soundRef.current) soundRef.current.unloadAsync();
        };
    }, []);

    const setupAudioMode = async () => {
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true, // Allow playback in the background
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        });

        if (soundRef.current) {
            soundRef.current.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    handleNext(); // Automatically play the next track
                }
            });
        }
    };

    const loadTrack = async (index: number) => {
        if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current == null;
        }
        const { sound } = await Audio.Sound.createAsync(
            {
                uri: playlist[index].uri,
            },
            { shouldPlay: true },
            (s) => setStatus(s)
        );
        soundRef.current = sound;
        setIsPlaying(true);
    };
    const updateSlider = async () => {
        if (soundRef.current) {
            const currentStatus = await soundRef.current.getStatusAsync();
            if (currentStatus.isLoaded && currentStatus.durationMillis) {
                setSliderValue(
                    currentStatus.positionMillis / currentStatus.durationMillis
                );
                setStatus(currentStatus); // Cập nhật trạng thái
            }
        }
    };
    const handlePlayPause = async () => {
        if (!soundRef.current) return;

        const currentStatus = await soundRef.current.getStatusAsync();

        if (currentStatus.isLoaded) {
            if (currentStatus.isPlaying) {
                await soundRef.current.pauseAsync();
                setIsPlaying(false);
            } else {
                await soundRef.current.playAsync();
                setIsPlaying(true);
            }
        }
    };

    const handleNext = () => {
        if (currentTrack < playlist.length - 1) {
            setCurrentTrack(currentTrack + 1);
        } else {
            setCurrentTrack(0); // Quay lại bài đầu tiên nếu đang ở bài cuối
        }
    };

    const handlePrevious = () => {
        if (currentTrack > 0) {
            setCurrentTrack(currentTrack - 1);
        } else {
            setCurrentTrack(playlist.length - 1); // Quay lại bài cuối cùng nếu đang ở bài đầu tiên
        }
    };
    const handleSeek = async (value: number) => {
        if (soundRef.current && status?.isLoaded) {
            const position = value * (status.durationMillis || 0);
            await soundRef.current.setPositionAsync(position);
            setSliderValue(value);
        }
    };

    const formatTime = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#222831" }}>
            <View
                style={{
                    flex: 6,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={{
                        uri: playlist[currentTrack].image,
                    }}
                    style={{ width: 200, height: 200 }}
                />
            </View>
            <View style={{ flex: 4 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>{playlist[currentTrack].title}</Text>

                    {/* Thanh trượt thời gian */}
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={sliderValue}
                        onValueChange={(value) => setSliderValue(value)}
                        onSlidingComplete={handleSeek}
                        minimumTrackTintColor="#00FF00"
                        maximumTrackTintColor="#00FF00"
                        thumbTintColor="#00FF00"
                    />

                    {/* Thời gian đã phát / tổng thời gian */}
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            {formatTime(status?.positionMillis || 0)}
                        </Text>
                        <Text style={styles.timeText}>
                            {formatTime(status?.durationMillis || 0)}
                        </Text>
                    </View>

                    {/* Khu vực nút điều khiển */}
                    <View style={styles.controlsContainer}>
                        <MaterialIcons
                            name="arrow-left"
                            size={40}
                            color="#00FF00"
                            onPress={handlePrevious}
                        />
                        <MaterialIcons
                            name={isPlaying ? "pause" : "play-arrow"} // Thay đổi icon dựa trên trạng thái
                            size={50}
                            style={styles.playIcon}
                            color="#00FF00"
                            onPress={handlePlayPause}
                        />
                        <MaterialIcons
                            name="arrow-right"
                            size={40}
                            color="#00FF00"
                            onPress={handleNext}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222831", // Màu nền tối
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: "#EEEEEE",
        marginBottom: 4,
        textAlign: "center",
    },
    artist: {
        fontSize: 16,
        color: "#999",
        marginBottom: 20,
        textAlign: "center",
    },
    slider: {
        width: "100%",
        height: 40,
    },
    timeContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    timeText: {
        color: "#EEEEEE",
        fontSize: 12,
    },
    controlsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 40,
        width: "60%",
    },
    playIcon: {
        marginHorizontal: 30,
    },
});
