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
import { coursePreviewMockContext } from "../../../services/learnings/course-preview.mock";
import { CoursePreviewContentRow } from "./course-preview-content-row.component";

export const CoursePreviewBottomSheet = ({
  course,
  panelTop,
  backgroundColor,
  screenHeight,
  collapsedTop,
  viewedContentIds = [],
  onContentPress,
  isContentLocked = false,
  lockMessage = "",
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
  const { courseContent: fallbackCourseContent } = coursePreviewMockContext;
  const courseContent = course?.courseContent ?? fallbackCourseContent;

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
      onStartShouldSetPanResponder: () => false,
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
            {isContentLocked && lockMessage ? (
              <View style={styles.lockNotice}>
                <Text style={styles.lockNoticeText}>{lockMessage}</Text>
              </View>
            ) : null}
          </View>
        }
        ListFooterComponent={
          <View style={[styles.footerSpacer, { height: collapsedTop }]} />
        }
        renderItem={({ item, index }) => (
          <CoursePreviewContentRow
            item={item}
            index={index}
            isViewed={viewedContentIds.includes(item?.contentId)}
            isLocked={isContentLocked}
            onPress={() => !isContentLocked && onContentPress?.(item)}
          />
        )}
      />
    </Animated.View>
  );
};

export const CoursePreviewActionBar = ({
  containerColor,
  buyButtonColor,
  buyTextColor,
  onBuyNow,
  onAddToCart,
  isPurchased = false,
  isInCart = false,
  isLocked = false,
}) => {
  const buyNowBackgroundColor = isLocked
    ? "#A8B3BE"
    : isPurchased
      ? "#68B684"
      : buyButtonColor;
  const buyNowLabel = isLocked ? "LOCKED" : isPurchased ? "BOUGHT" : "BUY NOW";
  const cartIconName = isLocked ? "lock-closed" : isInCart ? "cart" : "cart-outline";
  const cartIconColor = isLocked ? "#8A97A5" : isInCart ? "#68B684" : "#D78686";

  return (
    <View
      style={[styles.actionBarContainer, { backgroundColor: containerColor }]}
    >
      <TouchableOpacity
        style={styles.cartButton}
        activeOpacity={0.8}
        onPress={onAddToCart}
        disabled={isPurchased || isInCart || isLocked}
      >
        <Ionicons name={cartIconName} size={34} color={cartIconColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.buyNowButton,
          { backgroundColor: buyNowBackgroundColor },
        ]}
        activeOpacity={0.85}
        onPress={onBuyNow}
        disabled={isPurchased || isLocked}
      >
        <View style={styles.buyNowContent}>
          {isPurchased || isLocked ? (
            <Ionicons
              name={isLocked ? "lock-closed" : "checkmark-circle"}
              size={20}
              color={buyTextColor}
              style={styles.buyNowIcon}
            />
          ) : null}
          <Text style={[styles.buyNowText, { color: buyTextColor }]}>
            {buyNowLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
