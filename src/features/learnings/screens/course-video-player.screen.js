import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Audio, Video } from "expo-av";
import { Asset } from "expo-asset";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";
import { parseDurationLabelToSeconds } from "../../../services/learnings/course-duration.utils";
import { normalizeCoursePreviewType } from "../../../services/learnings/course-preview.mock";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";
const AUTO_HIDE_DELAY_MS = 2200;
const HIDDEN_TRANSLATE_Y = 180;
const MOCK_VIDEO_MODULES = [
  require("../../../../assets/TestVideo.mp4"),
  require("../../../../assets/testvid2.mp4"),
];
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
  const hideControlsTimerRef = useRef(null);
  const hasShownInitialControlsRef = useRef(false);
  const controlsAnimation = useRef(new Animated.Value(0)).current;
  const course = route?.params?.course;
  const contentItem = route?.params?.contentItem;
  const selectedVideoModule = useMemo(() => {
    const courseContent = course?.courseContent ?? [];
    const videoItems = courseContent.filter((item) => {
      const contentType = normalizeCoursePreviewType(
        item?.contentType ?? item?.fileFormat
      );
      return contentType === "video";
    });

    const currentVideoIndex = videoItems.findIndex(
      (item) => item?.contentId === contentItem?.contentId
    );
    const resolvedIndex =
      currentVideoIndex >= 0
        ? Math.min(currentVideoIndex, MOCK_VIDEO_MODULES.length - 1)
        : 0;

    return MOCK_VIDEO_MODULES[resolvedIndex];
  }, [contentItem?.contentId, course?.courseContent]);
  const fallbackDurationSeconds = useMemo(() => {
    const parsedSeconds = parseDurationLabelToSeconds(
      contentItem?.contentDuration
    );
    return parsedSeconds > 0 ? parsedSeconds : 8 * 60 + 3;
  }, [contentItem?.contentDuration]);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [videoSource, setVideoSource] = useState(null);
  const currentTimeSeconds = Math.max(
    0,
    (playbackStatus?.positionMillis ?? 0) / 1000
  );
  const totalDurationSeconds =
    playbackStatus?.durationMillis && playbackStatus.durationMillis > 0
      ? playbackStatus.durationMillis / 1000
      : fallbackDurationSeconds;
  const isPlaying = Boolean(playbackStatus?.isPlaying);
  const isLoaded = Boolean(playbackStatus?.isLoaded);
  const [areControlsVisible, setAreControlsVisible] = useState(false);
  const progressPercent = Math.min(
    1,
    totalDurationSeconds > 0 ? currentTimeSeconds / totalDurationSeconds : 0
  );
  const controlsOpacity = controlsAnimation;
  const controlsTranslateY = controlsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [HIDDEN_TRANSLATE_Y, 0],
  });

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

  const clearHideControlsTimer = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
  }, []);

  const animateControls = useCallback(
    (visible) => {
      setAreControlsVisible(visible);
      Animated.timing(controlsAnimation, {
        toValue: visible ? 1 : 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [controlsAnimation]
  );

  const scheduleAutoHide = useCallback(() => {
    clearHideControlsTimer();
    hideControlsTimerRef.current = setTimeout(() => {
      animateControls(false);
    }, AUTO_HIDE_DELAY_MS);
  }, [animateControls, clearHideControlsTimer]);

  const showControls = useCallback(() => {
    animateControls(true);
    if (isPlaying) {
      scheduleAutoHide();
    } else {
      clearHideControlsTimer();
    }
  }, [animateControls, clearHideControlsTimer, isPlaying, scheduleAutoHide]);

  const hideControls = useCallback(() => {
    clearHideControlsTimer();
    animateControls(false);
  }, [animateControls, clearHideControlsTimer]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let isActive = true;

    const prepareVideoSource = async () => {
      setVideoSource(null);
      setVideoErrorMessage("");
      try {
        const localAsset = Asset.fromModule(selectedVideoModule);
        await localAsset.downloadAsync();
        const resolvedUri = localAsset.localUri ?? localAsset.uri;

        if (isActive && resolvedUri) {
          setVideoSource({ uri: resolvedUri });
        }
      } catch {
        if (isActive) {
          setVideoSource(selectedVideoModule);
        }
      }
    };

    prepareVideoSource();

    return () => {
      isActive = false;
    };
  }, [selectedVideoModule]);

  useEffect(() => {
    return () => {
      clearHideControlsTimer();
    };
  }, [clearHideControlsTimer]);

  useEffect(() => {
    if (!isLoaded || hasShownInitialControlsRef.current) {
      return;
    }

    hasShownInitialControlsRef.current = true;
    showControls();
  }, [isLoaded, showControls]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isPlaying) {
      showControls();
      return;
    }

    if (areControlsVisible) {
      scheduleAutoHide();
    }
  }, [areControlsVisible, isLoaded, isPlaying, scheduleAutoHide, showControls]);

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
      <Pressable
        style={styles.videoContainer}
        onPress={() => {
          if (areControlsVisible) {
            hideControls();
            return;
          }
          showControls();
        }}
      >
        {videoSource ? (
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            androidImplementation="exoplayer"
            resizeMode="contain"
            shouldPlay={true}
            isMuted={false}
            volume={1.0}
            useNativeControls={false}
            onLoad={() => {
              setVideoErrorMessage("");
            }}
            onError={(error) => {
              const parsedError =
                typeof error === "string"
                  ? error
                  : JSON.stringify(error ?? "Unknown video error");
              setVideoErrorMessage(parsedError);
            }}
            onPlaybackStatusUpdate={(status) => {
              setPlaybackStatus(status);
              if (status?.error) {
                setVideoErrorMessage(String(status.error));
              }
              if (status?.didJustFinish) {
                markCurrentContentViewed();
              }
            }}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text variant="label" style={styles.loadingText}>
              Loading video...
            </Text>
          </View>
        )}
        {videoErrorMessage ? (
          <View style={styles.errorContainer}>
            <Text variant="label" style={styles.errorText}>
              Video error: {videoErrorMessage}
            </Text>
          </View>
        ) : null}

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
                  showControls();
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
        </Animated.View>
      </Pressable>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#132029",
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#0D1116",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  loadingText: {
    color: "#DDE8F3",
  },
  errorContainer: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  errorText: {
    color: "#FFB4B4",
    fontSize: 12,
  },
  controlsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  timelineWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "rgba(12, 20, 28, 0.42)",
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
