import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./course-checkout.styles";

export const CourseCheckoutContent = ({
  courseTitle,
  author,
  classDuration,
  rating,
  price,
  buyButtonColor,
  onGoBack,
  onPlaceOrder,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={onGoBack}
        >
          <Ionicons name="arrow-back" size={22} color="#1F3342" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.sectionLabel}>Course Summary</Text>
        <Text style={styles.courseTitle}>{courseTitle}</Text>
        <Text style={styles.courseMeta}>By {author}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>{classDuration}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Rating</Text>
          <Text style={styles.metaValue}>{rating}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Price</Text>
          <Text style={styles.priceValue}>{price}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={18} color="#4A6780" />
        <Text style={styles.infoText}>
          This is a UI checkout flow. Payment and database will be connected
          later.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.placeOrderButton, { backgroundColor: buyButtonColor }]}
        activeOpacity={0.85}
        onPress={onPlaceOrder}
      >
        <Text style={styles.placeOrderText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </View>
  );
};
