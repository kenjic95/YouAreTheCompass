import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";
import { CoursePreviewBottomSheet } from "../components/course-preview.components";
import { styles } from "../components/course-preview.styles";

export const CoursePreviewScreen = ({ route }) => {
  const theme = useTheme();
  const course = route?.params?.course;
  const [screenHeight, setScreenHeight] = useState(0);
  const panelTop = useRef(new Animated.Value(0)).current;
  const collapsedTop = Math.max(0, screenHeight / 3);

  const handleLayout = ({ nativeEvent }) => {
    const nextHeight = nativeEvent.layout.height;
    setScreenHeight(nextHeight);
    panelTop.setValue(Math.max(0, nextHeight / 3));
  };

  return (
    <SafeAreaProvider>
      <SafeArea onLayout={handleLayout}>
        <View style={styles.container}>
          <CourseInfo course={course} />

          {screenHeight > 0 ? (
            <CoursePreviewBottomSheet
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
