import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseCheckoutContent } from "../components/course-checkout.components";
import { styles } from "../components/course-checkout.styles";

export const CourseCheckoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const course = route?.params?.course ?? {};

  const courseTitle = course?.courseTitle ?? "Course";
  const author = course?.author ?? "Unknown Instructor";
  const price = course?.priceValue ?? course?.price ?? "$0";
  const classDuration = course?.courseDuration ?? "0hr 00min";
  const rating = course?.rating ?? "N/A";

  const handlePlaceOrder = () => {
    // DB/payment integration will be added later.
    navigation.navigate("Courses");
  };

  return (
    <SafeAreaProvider>
      <SafeArea style={styles.safeArea}>
        <CourseCheckoutContent
          courseTitle={courseTitle}
          author={author}
          classDuration={classDuration}
          rating={rating}
          price={price}
          buyButtonColor={theme.colors.brand.primary}
          onGoBack={() => navigation.goBack()}
          onPlaceOrder={handlePlaceOrder}
        />
      </SafeArea>
    </SafeAreaProvider>
  );
};
