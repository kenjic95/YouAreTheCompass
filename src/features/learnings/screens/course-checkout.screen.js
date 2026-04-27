import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { CourseCheckoutContent } from "../components/course-checkout.components";
import { CheckoutSafeArea } from "../components/course-checkout.styles";
import { usePurchasedCourses } from "../../../services/learnings/purchased-courses.context";
import { useUserProfile } from "../../../services/auth/user-profile.context";
import {
  applyDiscount,
  formatAudPrice,
  parseCoursePrice,
} from "../../../services/learnings/course-pricing.utils";

export const CourseCheckoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const course = route?.params?.course ?? {};
  const selectedCategory = route?.params?.category;
  const { addPurchasedCourse } = usePurchasedCourses();
  const { discountPercent, isPremium } = useUserProfile();

  const courseTitle = course?.courseTitle ?? "Course";
  const author = course?.author ?? "Unknown Instructor";
  const classDuration = course?.courseDuration ?? "0hr 00min";
  const rating = course?.rating ?? "N/A";
  const basePrice = parseCoursePrice(course?.priceValue ?? course?.price);
  const finalPrice = applyDiscount(basePrice, discountPercent);
  const hasDiscount =
    isPremium && discountPercent > 0 && finalPrice < basePrice;
  const price = formatAudPrice(finalPrice);
  const originalPrice = hasDiscount ? formatAudPrice(basePrice) : null;
  const discountLabel = hasDiscount
    ? `Premium discount (${discountPercent}%)`
    : null;

  const handlePlaceOrder = async () => {
    const didPurchase = await addPurchasedCourse(course);
    if (!didPurchase) {
      Alert.alert(
        "Purchase failed",
        "Unable to create enrollment right now. Please try again."
      );
      return;
    }

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
          originalPrice={originalPrice}
          discountLabel={discountLabel}
          buyButtonColor={theme.colors.brand.primary}
          onPlaceOrder={handlePlaceOrder}
        />
      </CheckoutSafeArea>
    </SafeAreaProvider>
  );
};
