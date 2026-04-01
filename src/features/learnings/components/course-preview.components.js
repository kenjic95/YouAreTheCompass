import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./course-preview.styles";

const MOCK_COURSE_CONTENT = [
  {
    contentId: 1,
    contentType: "video",
    contentDuration: "5:35 min",
    contentTitle: "Welcome to the Course",
  },
  {
    contentId: 2,
    contentType: "image",
    fileFormat: "png",
    fileSize: "2.1 MB",
    contentTitle: "Meditation Posture Guide",
  },
  {
    contentId: 3,
    contentType: "pdf",
    fileFormat: "pdf",
    fileSize: "4.9 MB",
    contentTitle: "Breathing Patterns Workbook",
  },
  {
    contentId: 4,
    contentType: "video",
    contentDuration: "10:20 min",
    contentTitle: "Meditation Techniques",
  },
  {
    contentId: 5,
    contentType: "image",
    fileFormat: "jpg",
    fileSize: "1.4 MB",
    contentTitle: "Daily Meditation Checklist",
  },
  {
    contentId: 6,
    contentType: "video",
    contentDuration: "3:40 min",
    contentTitle: "Music for Meditation",
  },
];

const CONTENT_TYPE_CONFIG = {
  video: {
    label: "Video",
    icon: "play",
    actionIcon: "play",
  },
  image: {
    label: "Image",
    icon: "image-outline",
    actionIcon: "image-outline",
  },
  pdf: {
    label: "PDF",
    icon: "document-text-outline",
    actionIcon: "document-text-outline",
  },
};

const normalizeContentType = (type) => {
  if (!type) {
    return "video";
  }
  const lowered = String(type).toLowerCase();
  if (lowered === "jpg" || lowered === "jpeg" || lowered === "png") {
    return "image";
  }
  if (lowered === "pdf") {
    return "pdf";
  }
  return lowered;
};

export const CoursePreviewBottomSheet = ({
  course,
  panelTop,
  backgroundColor,
  screenHeight,
  collapsedTop,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const gestureStartTop = useRef(collapsedTop);

  // Allow the sheet to move beyond the top when content is taller than screen.
  const contentOverflow = Math.max(
    0,
    (contentHeight || screenHeight * 1.6) - screenHeight
  );
  const minTop = -contentOverflow;
  const maxStretch = collapsedTop + 56;
  const courseContent = course?.courseContent ?? MOCK_COURSE_CONTENT;

  const animateTo = (value) => {
    Animated.spring(panelTop, {
      toValue: value,
      useNativeDriver: false,
      speed: 12,
      bounciness: 7,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 2 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        panelTop.stopAnimation((value) => {
          gestureStartTop.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const rawTop = gestureStartTop.current + gestureState.dy;
        if (rawTop > collapsedTop) {
          const overPull = rawTop - collapsedTop;
          const jellyTop = collapsedTop + Math.min(56, overPull * 0.35);
          panelTop.setValue(Math.min(maxStretch, jellyTop));
          return;
        }
        panelTop.setValue(Math.max(minTop, rawTop));
      },
      onPanResponderRelease: () => {
        panelTop.stopAnimation((value) => {
          if (value > collapsedTop) {
            animateTo(collapsedTop);
            return;
          }
          if (value < minTop) {
            animateTo(minTop);
            return;
          }
          if (value > collapsedTop - 24) {
            animateTo(collapsedTop);
          }
        });
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          top: panelTop,
          backgroundColor,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <FlatList
        data={courseContent}
        keyExtractor={(item) => `${item.contentId}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(_, height) => {
          setContentHeight(height + 20);
        }}
        contentContainerStyle={[
          styles.sheetContent,
          { paddingBottom: collapsedTop + 24 },
        ]}
        ListHeaderComponent={
          <View>
            <View style={styles.handle} />
            <Text style={styles.sectionTitle}>Course Content</Text>
          </View>
        }
        ListFooterComponent={
          <View style={[styles.footerSpacer, { height: collapsedTop }]} />
        }
        renderItem={({ item, index }) => {
          const contentType = normalizeContentType(
            item?.contentType ?? item?.fileFormat
          );
          const typeConfig =
            CONTENT_TYPE_CONFIG[contentType] ?? CONTENT_TYPE_CONFIG.video;
          const rowId = item?.contentId ?? index + 1;
          const formatLabel = item?.fileFormat
            ? String(item.fileFormat).toUpperCase()
            : typeConfig.label.toUpperCase();
          const helperText =
            contentType === "video"
              ? item?.contentDuration ?? "Video"
              : item?.fileSize ?? formatLabel;

          return (
            <View style={styles.contentRow}>
              <Text style={styles.contentId}>{rowId}</Text>
              <View style={styles.contentBody}>
                <Text style={styles.contentDuration}>{helperText}</Text>
                <Text style={styles.contentTitle}>{item.contentTitle}</Text>
                <View style={styles.typePill}>
                  <Ionicons
                    name={typeConfig.icon}
                    size={14}
                    color="#496074"
                    style={styles.typeIcon}
                  />
                  <Text style={styles.typePillText}>{typeConfig.label}</Text>
                </View>
              </View>
              <View style={styles.playButton}>
                <Ionicons
                  name={typeConfig.actionIcon}
                  size={24}
                  color="#A9D4F4"
                />
              </View>
            </View>
          );
        }}
      />
    </Animated.View>
  );
};

export const CoursePreviewActionBar = ({
  containerColor,
  buyButtonColor,
  buyTextColor,
  onBuyNow,
}) => {
  return (
    <View
      style={[styles.actionBarContainer, { backgroundColor: containerColor }]}
    >
      <TouchableOpacity style={styles.cartButton} activeOpacity={0.8}>
        <Ionicons name="cart" size={34} color="#D78686" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buyNowButton, { backgroundColor: buyButtonColor }]}
        activeOpacity={0.85}
        onPress={onBuyNow}
      >
        <Text style={[styles.buyNowText, { color: buyTextColor }]}>
          BUY NOW
        </Text>
      </TouchableOpacity>
    </View>
  );
};
