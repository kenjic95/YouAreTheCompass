import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { CourseCheckoutContent } from "../components/course-checkout.components";
import { CheckoutSafeArea } from "../components/course-checkout.styles";
import { usePurchasedCourses } from "../../../services/learnings/purchased-courses.context";

export const CourseCheckoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const course = route?.params?.course ?? {};
  const selectedCategory = route?.params?.category;
  const { addPurchasedCourse } = usePurchasedCourses();

  const courseTitle = course?.courseTitle ?? "Course";
  const author = course?.author ?? "Unknown Instructor";
  const price = course?.priceValue ?? course?.price ?? "$0";
  const classDuration = course?.courseDuration ?? "0hr 00min";
  const rating = course?.rating ?? "N/A";

  const handlePlaceOrder = () => {
    addPurchasedCourse(course);
    navigation.navigate("Courses", {
      category: selectedCategory,
    });
  };

  return (
    <SafeAreaProvider>
      <CheckoutSafeArea>
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
      </CheckoutSafeArea>
    </SafeAreaProvider>
  );
};
