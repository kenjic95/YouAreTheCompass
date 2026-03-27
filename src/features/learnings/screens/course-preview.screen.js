import React, { useRef, useState } from "react";
import { Animated, FlatList, Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";

export const CoursePreviewScreen = ({ route }) => {
  const theme = useTheme();
  const course = route?.params?.course;
  const [screenHeight, setScreenHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelTop = useRef(new Animated.Value(0)).current;
  const sheetData = [];

  const collapsedTop = Math.max(0, screenHeight / 3);

  const animatePanelTo = (toValue, expandedState) => {
    Animated.timing(panelTop, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(expandedState);
    });
  };

  const expandPanel = () => {
    if (isExpanded || screenHeight === 0) return;
    animatePanelTo(0, true);
  };

  const collapsePanel = () => {
    if (!isExpanded || screenHeight === 0) return;
    animatePanelTo(collapsedTop, false);
  };

  const handleLayout = ({ nativeEvent }) => {
    const nextHeight = nativeEvent.layout.height;
    setScreenHeight(nextHeight);
    panelTop.setValue(isExpanded ? 0 : Math.max(0, nextHeight / 3));
  };

  return (
    <SafeAreaProvider>
      <SafeArea onLayout={handleLayout}>
        <View style={styles.container}>
          <CourseInfo course={course} />

          {screenHeight > 0 ? (
            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  top: panelTop,
                  backgroundColor: theme.colors.brand.secondary,
                },
              ]}
            >
              <FlatList
                data={sheetData}
                keyExtractor={(item) => item.id}
                bounces
                alwaysBounceVertical
                overScrollMode={Platform.OS === "android" ? "always" : "auto"}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  if (offsetY > 6 && !isExpanded) {
                    expandPanel();
                  }
                  if (offsetY < -20 && isExpanded) {
                    collapsePanel();
                  }
                }}
                onScrollEndDrag={(event) => {
                  if (Platform.OS !== "android" || !isExpanded) return;
                  const offsetY = event.nativeEvent.contentOffset.y;
                  const velocityY = event.nativeEvent.velocity?.y ?? 0;
                  if (offsetY <= 0 && velocityY < -0.2) {
                    collapsePanel();
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
                ListFooterComponent={<View style={{ height: collapsedTop }} />}
                renderItem={() => null}
              />
            </Animated.View>
          ) : null}
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: "hidden",
  },
  sheetContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: "center",
    width: 56,
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },
});
