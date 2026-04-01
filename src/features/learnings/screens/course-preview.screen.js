import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";
import {
  CoursePreviewActionBar,
  CoursePreviewBottomSheet,
} from "../components/course-preview.components";
import { styles } from "../components/course-preview.styles";

export const CoursePreviewScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const course = route?.params?.course;
  const selectedCategory = route?.params?.category;
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
              course={course}
              panelTop={panelTop}
              backgroundColor={theme.colors.brand.secondary}
              screenHeight={screenHeight}
              collapsedTop={collapsedTop}
            />
          ) : null}

          <CoursePreviewActionBar
            containerColor={theme.colors.brand.tertiary}
            buyButtonColor={theme.colors.brand.primary}
            buyTextColor={theme.colors.text.inverse}
            onBuyNow={() =>
              navigation.navigate("Checkout", {
                course,
                category: selectedCategory,
              })
            }
          />
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};
