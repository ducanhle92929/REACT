import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ExternalControllerProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    currentTrackTitle: string;
}

export default function ExternalController({
    isPlaying,
    onPlayPause,
    onNext,
    onPrevious,
    currentTrackTitle,
}: ExternalControllerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.trackTitle}>Đang phát: {currentTrackTitle}</Text>
            <View style={styles.controlsContainer}>
                <MaterialIcons
                    name="skip-previous"
                    size={40}
                    color="#00FF00"
                    onPress={onPrevious}
                />
                <MaterialIcons
                    name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
                    size={50}
                    style={styles.playIcon}
                    color="#00FF00"
                    onPress={onPlayPause}
                />
                <MaterialIcons
                    name="skip-next"
                    size={40}
                    color="#00FF00"
                    onPress={onNext}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#222831",
        padding: 20,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#444",
    },
    trackTitle: {
        color: "#EEEEEE",
        fontSize: 18,
        marginBottom: 10,
    },
    controlsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "60%",
    },
    playIcon: {
        marginHorizontal: 30,
    },
});
