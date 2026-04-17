import React, { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Video } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";
import { parseDurationLabelToSeconds } from "../../../services/learnings/course-duration.utils";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";
const bottomActions = [
  { id: "back", icon: "chevron-back-outline" },
  { id: "rewind", icon: "play-back" },
  { id: "playPause" },
  { id: "forward", icon: "play-forward" },
  { id: "next", icon: "list-sharp" },
];

export const CourseVideoPlayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const videoRef = useRef(null);
  const course = route?.params?.course;
  const contentItem = route?.params?.contentItem;
  const fallbackDurationSeconds = useMemo(() => {
    const parsedSeconds = parseDurationLabelToSeconds(
      contentItem?.contentDuration
    );
    return parsedSeconds > 0 ? parsedSeconds : 8 * 60 + 3;
  }, [contentItem?.contentDuration]);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const currentTimeSeconds = Math.max(
    0,
    (playbackStatus?.positionMillis ?? 0) / 1000
  );
  const totalDurationSeconds =
    playbackStatus?.durationMillis && playbackStatus.durationMillis > 0
      ? playbackStatus.durationMillis / 1000
      : fallbackDurationSeconds;
  const isPlaying = Boolean(playbackStatus?.isPlaying);
  const progressPercent = Math.min(
    1,
    totalDurationSeconds > 0 ? currentTimeSeconds / totalDurationSeconds : 0
  );

  const formatClock = (seconds) => {
    const safeSeconds = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const seekBySeconds = async (deltaSeconds) => {
    if (!playbackStatus?.isLoaded || !videoRef.current) {
      return;
    }

    const currentMillis = playbackStatus.positionMillis ?? 0;
    const durationMillis =
      playbackStatus.durationMillis ??
      Math.round(fallbackDurationSeconds * 1000);
    const deltaMillis = deltaSeconds * 1000;
    const nextPositionMillis = Math.min(
      Math.max(0, currentMillis + deltaMillis),
      Math.max(0, durationMillis)
    );

    await videoRef.current.setPositionAsync(nextPositionMillis);
  };

  const togglePlayPause = async () => {
    if (!playbackStatus?.isLoaded || !videoRef.current) {
      return;
    }

    if (playbackStatus.isPlaying) {
      await videoRef.current.pauseAsync();
      return;
    }

    await videoRef.current.playAsync();
  };

  const markCurrentContentViewed = async () => {
    const courseId = course?.id;
    const contentId = contentItem?.contentId;
    if (!courseId || !contentId) {
      return;
    }

    const progressStorageKey = `${COURSE_PROGRESS_KEY_PREFIX}:${courseId}`;

    try {
      const storedValue = await AsyncStorage.getItem(progressStorageKey);
      const parsedIds = storedValue ? JSON.parse(storedValue) : [];
      const viewedIds = Array.isArray(parsedIds) ? parsedIds : [];

      if (viewedIds.includes(contentId)) {
        return;
      }

      await AsyncStorage.setItem(
        progressStorageKey,
        JSON.stringify([...viewedIds, contentId])
      );
    } catch {
      // Ignore persistence errors in player controls.
    }
  };

  return (
    <SafeArea edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.videoPlaceholder}>
          <Video
            ref={videoRef}
            source={require("../../../../assets/SampleVideo.mov")}
            style={styles.video}
            resizeMode="contain"
            shouldPlay={true}
            useNativeControls={false}
            onPlaybackStatusUpdate={(status) => {
              setPlaybackStatus(status);
              if (status?.didJustFinish) {
                markCurrentContentViewed();
              }
            }}
          />
        </View>

        <View style={styles.timelineWrap}>
          <Text variant="label" style={styles.timeLabel}>
            {formatClock(currentTimeSeconds)} min /{" "}
            {formatClock(totalDurationSeconds)} min
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(0.02, progressPercent) * 100}%` },
              ]}
            />
            <View
              style={[
                styles.progressThumb,
                { left: `${progressPercent * 100}%` },
              ]}
            />
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(12, insets.bottom) },
          ]}
        >
          {bottomActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.8}
              style={[
                styles.actionButton,
                action.id === "playPause" ? styles.actionButtonPrimary : null,
              ]}
              onPress={() => {
                if (action.id === "back") {
                  navigation.goBack();
                }
                if (action.id === "rewind") {
                  seekBySeconds(-10);
                }
                if (action.id === "playPause") {
                  togglePlayPause();
                }
                if (action.id === "forward") {
                  seekBySeconds(10);
                }
                if (action.id === "next") {
                  markCurrentContentViewed();
                }
              }}
            >
              <Ionicons
                name={
                  action.id === "playPause"
                    ? isPlaying
                      ? "pause"
                      : "play"
                    : action.icon
                }
                size={action.id === "playPause" ? 46 : 30}
                color={action.id === "playPause" ? "#3D3D41" : "#424347"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#132029",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  videoPlaceholder: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: "#0D1116",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  timelineWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  timeLabel: {
    width: "100%",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 12,
  },
  progressTrack: {
    width: "100%",
    height: 18,
    borderRadius: 10,
    backgroundColor: "#70757C",
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    height: 18,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  progressThumb: {
    position: "absolute",
    marginLeft: -6,
    width: 12,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#F0F3F6",
  },
  bottomBar: {
    backgroundColor: "#B5D1E8",
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  actionButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F1F2F4",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  actionButtonPrimary: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#6DAFDE",
    marginHorizontal: 6,
  },
});
