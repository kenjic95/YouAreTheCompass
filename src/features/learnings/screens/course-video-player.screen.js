import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { Animated, Easing, Pressable, View } from "react-native";
import { Audio, Video } from "expo-av";
import { Asset } from "expo-asset";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Text } from "../../../components/typography/text.component";
import { parseDurationLabelToSeconds } from "../../../services/learnings/course-duration.utils";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { normalizeCoursePreviewType } from "../../../services/learnings/course-preview.mock";
import { CourseVideoPlayerControls } from "../components/course-video-player-controls.component";
import { styles } from "../components/course-video-player.styles";
import {
  AUTO_HIDE_DELAY_MS,
  COURSE_PROGRESS_KEY_PREFIX,
  getSelectedVideoModule,
  HIDDEN_TRANSLATE_Y,
} from "./course-video-player.utils";

export const CourseVideoPlayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const videoRef = useRef(null);
  const hideControlsTimerRef = useRef(null);
  const hasShownInitialControlsRef = useRef(false);
  const hasSyncedDurationRef = useRef(false);
  const hasAutoAdvancedRef = useRef(false);
  const controlsAnimation = useRef(new Animated.Value(0)).current;
  const { updateCourse } = useCourseCatalog();

  const course = route?.params?.course;
  const contentItem = route?.params?.contentItem;

  const selectedVideoModule = useMemo(
    () => getSelectedVideoModule(course, contentItem),
    [contentItem, course]
  );

  const fallbackDurationSeconds = useMemo(() => {
    const parsedSeconds = parseDurationLabelToSeconds(
      contentItem?.contentDuration
    );
    return parsedSeconds > 0 ? parsedSeconds : 8 * 60 + 3;
  }, [contentItem?.contentDuration]);

  const [playbackStatus, setPlaybackStatus] = useState({});
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [videoSource, setVideoSource] = useState(null);
  const [progressTrackWidth, setProgressTrackWidth] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPositionSeconds, setScrubPositionSeconds] = useState(null);
  const [areControlsVisible, setAreControlsVisible] = useState(false);

  const formatVideoDurationLabel = useCallback((durationSeconds) => {
    const safeSeconds = Math.max(0, Math.round(Number(durationSeconds) || 0));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  }, []);

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
  const displayedTimeSeconds =
    isScrubbing && scrubPositionSeconds !== null
      ? scrubPositionSeconds
      : currentTimeSeconds;
  const progressPercent = Math.min(
    1,
    totalDurationSeconds > 0 ? displayedTimeSeconds / totalDurationSeconds : 0
  );

  const controlsOpacity = controlsAnimation;
  const controlsTranslateY = controlsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [HIDDEN_TRANSLATE_Y, 0],
  });

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

      if (selectedVideoModule?.uri) {
        if (isActive) {
          setVideoSource(selectedVideoModule);
        }
        return;
      }

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

  const goToNextContent = useCallback(async () => {
    await markCurrentContentViewed();

    const courseContent = course?.courseContent ?? [];
    if (!Array.isArray(courseContent) || courseContent.length === 0) {
      navigation.goBack();
      return;
    }

    const currentIndex = courseContent.findIndex(
      (item) => item?.contentId === contentItem?.contentId
    );

    if (currentIndex < 0 || currentIndex >= courseContent.length - 1) {
      navigation.goBack();
      return;
    }

    const nextItem = courseContent[currentIndex + 1];
    const nextType = normalizeCoursePreviewType(
      nextItem?.contentType ?? nextItem?.fileFormat
    );

    if (nextType === "video") {
      navigation.replace("CoursePlayer", {
        course,
        contentItem: nextItem,
      });
      return;
    }

    navigation.goBack();
  }, [contentItem?.contentId, course, navigation]);

  useEffect(() => {
    hasAutoAdvancedRef.current = false;
    hasSyncedDurationRef.current = false;
  }, [contentItem?.contentId]);

  const syncVideoDurationToCourse = useCallback(
    (durationMillis) => {
      if (hasSyncedDurationRef.current) {
        return;
      }

      const courseId = course?.id;
      const contentId = contentItem?.contentId;
      const existingSeconds =
        Number(contentItem?.contentDurationSeconds) ||
        parseDurationLabelToSeconds(contentItem?.contentDuration);
      const nextSeconds = Math.max(0, Math.round((durationMillis || 0) / 1000));

      if (!courseId || !contentId || existingSeconds > 0 || nextSeconds <= 0) {
        return;
      }

      hasSyncedDurationRef.current = true;

      const nextCourseContent = (course?.courseContent ?? []).map((item) => {
        if (item?.contentId !== contentId) {
          return item;
        }

        return {
          ...item,
          contentDuration: formatVideoDurationLabel(nextSeconds),
          contentDurationSeconds: nextSeconds,
        };
      });

      updateCourse(courseId, {
        courseContent: nextCourseContent,
      });
    },
    [
      contentItem?.contentDuration,
      contentItem?.contentDurationSeconds,
      contentItem?.contentId,
      course?.courseContent,
      course?.id,
      formatVideoDurationLabel,
      updateCourse,
    ]
  );

  const getSecondsFromTrackX = useCallback(
    (locationX) => {
      if (!progressTrackWidth || totalDurationSeconds <= 0) {
        return 0;
      }

      const clampedX = Math.max(0, Math.min(locationX, progressTrackWidth));
      const progressRatio = clampedX / progressTrackWidth;
      return progressRatio * totalDurationSeconds;
    },
    [progressTrackWidth, totalDurationSeconds]
  );

  const commitScrubToVideo = useCallback(
    async (nextSeconds) => {
      if (!playbackStatus?.isLoaded || !videoRef.current) {
        return;
      }

      const nextPositionMillis = Math.max(0, Math.round(nextSeconds * 1000));
      await videoRef.current.setPositionAsync(nextPositionMillis);
    },
    [playbackStatus?.isLoaded]
  );

  const handleProgressTrackLayout = useCallback((event) => {
    const nextWidth = event?.nativeEvent?.layout?.width ?? 0;
    setProgressTrackWidth(nextWidth);
  }, []);

  const handleScrubGrant = useCallback(
    (event) => {
      showControls();
      const nextSeconds = getSecondsFromTrackX(event.nativeEvent.locationX);
      setIsScrubbing(true);
      setScrubPositionSeconds(nextSeconds);
    },
    [getSecondsFromTrackX, showControls]
  );

  const handleScrubMove = useCallback(
    (event) => {
      if (!isScrubbing) {
        return;
      }

      const nextSeconds = getSecondsFromTrackX(event.nativeEvent.locationX);
      setScrubPositionSeconds(nextSeconds);
    },
    [getSecondsFromTrackX, isScrubbing]
  );

  const handleScrubRelease = useCallback(async () => {
    const finalSeconds =
      scrubPositionSeconds !== null ? scrubPositionSeconds : currentTimeSeconds;
    setIsScrubbing(false);
    setScrubPositionSeconds(null);
    await commitScrubToVideo(finalSeconds);

    if (isPlaying) {
      scheduleAutoHide();
    }
  }, [
    commitScrubToVideo,
    currentTimeSeconds,
    isPlaying,
    scheduleAutoHide,
    scrubPositionSeconds,
  ]);

  const handleControlActionPress = (actionId) => {
    showControls();

    if (actionId === "back") {
      navigation.goBack();
    }
    if (actionId === "rewind") {
      seekBySeconds(-10);
    }
    if (actionId === "playPause") {
      togglePlayPause();
    }
    if (actionId === "forward") {
      seekBySeconds(10);
    }
    if (actionId === "next") {
      goToNextContent().catch(() => {});
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
              if (status?.isLoaded && Number(status?.durationMillis) > 0) {
                syncVideoDurationToCourse(status.durationMillis);
              }
              if (status?.didJustFinish) {
                if (!hasAutoAdvancedRef.current) {
                  hasAutoAdvancedRef.current = true;
                  goToNextContent().catch(() => {});
                }
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

        <CourseVideoPlayerControls
          areControlsVisible={areControlsVisible}
          controlsOpacity={controlsOpacity}
          controlsTranslateY={controlsTranslateY}
          displayedTimeSeconds={displayedTimeSeconds}
          totalDurationSeconds={totalDurationSeconds}
          progressPercent={progressPercent}
          handleProgressTrackLayout={handleProgressTrackLayout}
          handleScrubGrant={handleScrubGrant}
          handleScrubMove={handleScrubMove}
          handleScrubRelease={handleScrubRelease}
          insetsBottom={insets.bottom}
          isPlaying={isPlaying}
          onActionPress={handleControlActionPress}
        />
      </Pressable>
    </SafeArea>
  );
};
