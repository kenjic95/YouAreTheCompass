import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";
import { usePurchasedCourses } from "../../../services/learnings/purchased-courses.context";
import { CoursePreviewBottomSheet } from "../components/course-preview.components";
import { styles } from "../components/course-preview.styles";

export const MyCoursePreviewScreen = ({ route }) => {
  const theme = useTheme();
  const course = route?.params?.course;
  const { cartCourses } = usePurchasedCourses();
  const [screenHeight, setScreenHeight] = useState(0);
  const panelTop = useRef(new Animated.Value(0)).current;
  const collapsedTop = Math.max(0, screenHeight / 3);
  const isInCart = cartCourses.some((cartCourse) => cartCourse.id === course?.id);

  const handleLayout = ({ nativeEvent }) => {
    const nextHeight = nativeEvent.layout.height;
    setScreenHeight(nextHeight);
    panelTop.setValue(Math.max(0, nextHeight / 3));
  };

  return (
    <SafeAreaProvider>
      <SafeArea onLayout={handleLayout}>
        <View style={styles.container}>
          <CourseInfo course={course} isPurchased={true} isInCart={isInCart} />

          {screenHeight > 0 ? (
            <CoursePreviewBottomSheet
              course={course}
              panelTop={panelTop}
              backgroundColor={theme.colors.brand.secondary}
              screenHeight={screenHeight}
              collapsedTop={collapsedTop}
            />
          ) : null}
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};
