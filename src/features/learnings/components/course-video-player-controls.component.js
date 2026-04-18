import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/typography/text.component";
import { styles } from "./course-video-player.styles";
import { formatClock } from "../screens/course-video-player.utils";

const bottomActions = [
  { id: "back", icon: "chevron-back-outline" },
  { id: "rewind", icon: "play-back" },
  { id: "playPause" },
  { id: "forward", icon: "play-forward" },
  { id: "next", icon: "chevron-forward-outline" },
];

export const CourseVideoPlayerControls = ({
  areControlsVisible,
  controlsOpacity,
  controlsTranslateY,
  displayedTimeSeconds,
  totalDurationSeconds,
  progressPercent,
  handleProgressTrackLayout,
  handleScrubGrant,
  handleScrubMove,
  handleScrubRelease,
  insetsBottom,
  isPlaying,
  onActionPress,
}) => {
  return (
    <Animated.View
      pointerEvents={areControlsVisible ? "auto" : "none"}
      style={[
        styles.controlsOverlay,
        {
          opacity: controlsOpacity,
          transform: [{ translateY: controlsTranslateY }],
        },
      ]}
    >
      <View style={styles.timelineWrap}>
        <Text variant="label" style={styles.timeLabel}>
          {formatClock(displayedTimeSeconds)} min /{" "}
          {formatClock(totalDurationSeconds)} min
        </Text>

        <View
          style={styles.progressTouchArea}
          onLayout={handleProgressTrackLayout}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleScrubGrant}
          onResponderMove={handleScrubMove}
          onResponderRelease={() => {
            handleScrubRelease().catch(() => {});
          }}
          onResponderTerminationRequest={() => false}
        >
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(0.02, progressPercent) * 100}%` },
              ]}
            />
          </View>
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
          { paddingBottom: Math.max(12, insetsBottom) },
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
            onPress={() => onActionPress(action.id)}
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
    </Animated.View>
  );
};
