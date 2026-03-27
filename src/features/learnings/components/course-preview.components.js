import React, { useRef } from "react";
import { Animated, FlatList, Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./course-preview.styles";

const MOCK_COURSE_CONTENT = [
  { id: "1", contentNumber: 1, contentDuration: "5:35 min", contentTitle: "Welcome to the Course" },
  { id: "2", contentNumber: 2, contentDuration: "10:20 min", contentTitle: "Meditation Techniques" },
  { id: "3", contentNumber: 3, contentDuration: "3:40 min", contentTitle: "Music for Meditation" },
  { id: "4", contentNumber: 4, contentDuration: "8:03 min", contentTitle: "Where to Meditate?" },
  { id: "5", contentNumber: 5, contentDuration: "12:36 min", contentTitle: "How to set up meditation" },
];

export const CoursePreviewBottomSheet = ({
  panelTop,
  backgroundColor,
  isExpanded,
  onExpand,
  onCollapse,
  screenHeight,
  collapsedTop,
}) => {
  const scrollOffsetRef = useRef(0);
  const touchStartYRef = useRef(0);
  const androidPullingRef = useRef(false);
  const androidCollapseTriggeredRef = useRef(false);

  const resetCollapsedPosition = () => {
    if (isExpanded) return;
    androidPullingRef.current = false;
    Animated.spring(panelTop, {
      toValue: collapsedTop,
      useNativeDriver: false,
      speed: 10,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          top: panelTop,
          backgroundColor,
        },
      ]}
    >
      <FlatList
        data={MOCK_COURSE_CONTENT}
        keyExtractor={(item) => item.id}
        bounces
        alwaysBounceVertical
        overScrollMode={Platform.OS === "android" ? "always" : "auto"}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          scrollOffsetRef.current = offsetY;

          if (!isExpanded && offsetY < 0) {
            const stretch = Math.min(48, Math.abs(offsetY) * 0.45);
            panelTop.setValue(collapsedTop + stretch);
            return;
          }

          if (offsetY > 6 && !isExpanded) {
            onExpand();
          }
          if (offsetY < -20 && isExpanded) {
            onCollapse();
          }
        }}
        onScrollEndDrag={(event) => {
          if (!isExpanded) {
            resetCollapsedPosition();
            return;
          }

          if (Platform.OS !== "android" || !isExpanded) return;
          const offsetY = event.nativeEvent.contentOffset.y;
          const velocityY = event.nativeEvent.velocity?.y ?? 0;
          if (offsetY <= 0 && velocityY < -0.2) {
            onCollapse();
          }
        }}
        onMomentumScrollEnd={() => {
          resetCollapsedPosition();
        }}
        onTouchStart={(event) => {
          if (Platform.OS !== "android") return;
          touchStartYRef.current = event.nativeEvent.pageY;
          androidPullingRef.current = false;
          androidCollapseTriggeredRef.current = false;
        }}
        onTouchMove={(event) => {
          const deltaY = event.nativeEvent.pageY - touchStartYRef.current;
          if (Platform.OS !== "android" || deltaY <= 0) return;

          if (isExpanded) {
            if (
              !androidCollapseTriggeredRef.current &&
              scrollOffsetRef.current <= 0 &&
              deltaY > 28
            ) {
              androidCollapseTriggeredRef.current = true;
              onCollapse();
            }
            return;
          }

          if (scrollOffsetRef.current > 0) return;

          androidPullingRef.current = true;
          const stretch = Math.min(48, deltaY * 0.3);
          panelTop.setValue(collapsedTop + stretch);
        }}
        onTouchEnd={() => {
          if (Platform.OS !== "android") return;
          if (androidPullingRef.current) {
            resetCollapsedPosition();
          }
          androidCollapseTriggeredRef.current = false;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.sheetContent,
          {
            minHeight:
              Platform.OS === "android"
                ? screenHeight + collapsedTop
                : collapsedTop + 120,
          },
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
            <Text style={styles.contentNumber}>{item.contentNumber}</Text>
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
