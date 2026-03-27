import React, { useRef } from "react";
import { Animated, FlatList, Platform, View } from "react-native";
import { styles } from "./course-preview.styles";

const SHEET_PLACEHOLDER_DATA = [];

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
        data={SHEET_PLACEHOLDER_DATA}
        keyExtractor={(_, index) => `${index}`}
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
        }}
        onTouchMove={(event) => {
          if (Platform.OS !== "android" || isExpanded) return;
          if (scrollOffsetRef.current > 0) return;

          const deltaY = event.nativeEvent.pageY - touchStartYRef.current;
          if (deltaY <= 0) return;

          androidPullingRef.current = true;
          const stretch = Math.min(48, deltaY * 0.3);
          panelTop.setValue(collapsedTop + stretch);
        }}
        onTouchEnd={() => {
          if (Platform.OS !== "android") return;
          if (androidPullingRef.current) {
            resetCollapsedPosition();
          }
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
        ListHeaderComponent={<View style={styles.handle} />}
        ListFooterComponent={
          <View style={[styles.footerSpacer, { height: collapsedTop }]} />
        }
        renderItem={() => null}
      />
    </Animated.View>
  );
};
