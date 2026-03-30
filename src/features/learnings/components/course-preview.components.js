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
    contentDuration: "5:35 min",
    contentTitle: "Welcome to the Course",
  },
  {
    contentId: 2,
    contentDuration: "10:20 min",
    contentTitle: "Meditation Techniques",
  },
  {
    contentId: 3,
    contentDuration: "3:40 min",
    contentTitle: "Music for Meditation",
  },
  {
    contentId: 4,
    contentDuration: "8:03 min",
    contentTitle: "Where to Meditate?",
  },
  {
    contentId: 5,
    contentDuration: "12:36 min",
    contentTitle: "How to set up meditation",
  },
  {
    contentId: 6,
    contentDuration: "6:12 min",
    contentTitle: "Breathing Patterns 101",
  },
];

export const CoursePreviewBottomSheet = ({
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

    (contentHeight || screenHeight * 1.6) - screenHeight,
  );
  const minTop = -contentOverflow;
  const maxStretch = collapsedTop + 56;

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
    }),
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
        data={MOCK_COURSE_CONTENT}
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
        renderItem={({ item }) => (
          <View style={styles.contentRow}>
            <Text style={styles.contentId}>{item.contentId}</Text>
            <View style={styles.contentBody}>
              <Text style={styles.contentDuration}>{item.contentDuration}</Text>
              <Text style={styles.contentTitle}>{item.contentTitle}</Text>
            </View>
            <View style={styles.playButton}>
              <Ionicons name="play" size={26} color="#A9D4F4" />
            </View>
          </View>
        )}
      />
    </Animated.View>
  );
};

export const CoursePreviewActionBar = ({
  containerColor,
  buyButtonColor,
  buyTextColor,
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
      >
        <Text style={[styles.buyNowText, { color: buyTextColor }]}>
          BUY NOW
        </Text>
      </TouchableOpacity>
    </View>
  );
};
