import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExternalController from "../components/ExternalController";
import TrackPlayer, { Capability, State, usePlaybackState, Event, useTrackPlayerEvents } from "react-native-track-player";

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
    const [sliderValue, setSliderValue] = useState(0);
    const playbackState = usePlaybackState(); // Theo dõi trạng thái phát nhạc
    const [currentTrack, setCurrentTrack] = useState(0);

    useEffect(() => {
        setupPlayer();
        return () => {
            TrackPlayer.destroy(); // Hủy TrackPlayer khi component unmount
        };
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if (event.nextTrack != null) {
            const trackIndex = await TrackPlayer.getCurrentTrack();
            setCurrentTrack(trackIndex || 0); // Cập nhật bài hát hiện tại
        }
    });

    const setupPlayer = async () => {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
            ],
            notificationCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
            ],
            compactCapabilities: [Capability.Play, Capability.Pause],
        });

        // Thêm danh sách phát
        await TrackPlayer.add(
            playlist.map((track) => ({
                id: track.title,
                url: track.uri,
                title: track.title,
                artwork: track.image,
            }))
        );

        // Phát bài đầu tiên
        await TrackPlayer.play();
    };

    const handlePlayPause = async () => {
        const state = await TrackPlayer.getState();
        if (state === State.Playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const handleNext = async () => {
        await TrackPlayer.skipToNext();
    };

    const handlePrevious = async () => {
        await TrackPlayer.skipToPrevious();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#222831" }}>
            <View style={{ flex: 6, justifyContent: "center", alignItems: "center" }}>
                <Image
                    source={{ uri: playlist[currentTrack].image }}
                    style={{ width: 200, height: 200 }}
                />
            </View>
            <ExternalController
                isPlaying={playbackState === State.Playing}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentTrackTitle={playlist[currentTrack].title}
            />
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
