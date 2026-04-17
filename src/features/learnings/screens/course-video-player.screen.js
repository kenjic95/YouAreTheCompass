import React, { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";
import { parseDurationLabelToSeconds } from "../../../services/learnings/course-duration.utils";

const bottomActions = [
  { id: "back", icon: "chevron-back-outline" },
  { id: "rewind", icon: "play-back" },
  { id: "playPause" },
  { id: "forward", icon: "play-forward" },
  { id: "next", icon: "list" },
];

export const CourseVideoPlayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const course = route?.params?.course;
  const contentItem = route?.params?.contentItem;
  const totalDurationSeconds = useMemo(() => {
    const parsedSeconds = parseDurationLabelToSeconds(
      contentItem?.contentDuration
    );
    return parsedSeconds > 0 ? parsedSeconds : 8 * 60 + 3;
  }, [contentItem?.contentDuration]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const progressPercent = Math.min(
    1,
    totalDurationSeconds > 0 ? currentTimeSeconds / totalDurationSeconds : 0
  );

  useEffect(() => {
    if (!isPlaying || currentTimeSeconds >= totalDurationSeconds) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentTimeSeconds((previousSeconds) =>
        Math.min(totalDurationSeconds, previousSeconds + 1)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTimeSeconds, isPlaying, totalDurationSeconds]);

  const formatClock = (seconds) => {
    const safeSeconds = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="videocam-outline" size={42} color="#F3F6F9" />
          <Text variant="label" style={styles.placeholderTitle}>
            {contentItem?.contentTitle ?? "Course Video"}
          </Text>
          <Text style={styles.placeholderSubtitle}>
            {course?.courseTitle ?? "Course"} video player area
          </Text>
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

        <View style={styles.bottomBar}>
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
                if (action.id === "playPause") {
                  setIsPlaying((previousValue) => !previousValue);
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
    backgroundColor: "#2B3D4A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  placeholderTitle: {
    color: "#F7FBFF",
    marginTop: 12,
    textAlign: "center",
  },
  placeholderSubtitle: {
    color: "#D6E4EF",
    marginTop: 6,
    textAlign: "center",
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
