import React from "react";
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
          if (offsetY > 6 && !isExpanded) {
            onExpand();
          }
          if (offsetY < -20 && isExpanded) {
            onCollapse();
          }
        }}
        onScrollEndDrag={(event) => {
          if (Platform.OS !== "android" || !isExpanded) return;
          const offsetY = event.nativeEvent.contentOffset.y;
          const velocityY = event.nativeEvent.velocity?.y ?? 0;
          if (offsetY <= 0 && velocityY < -0.2) {
            onCollapse();
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
