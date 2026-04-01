import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";

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
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
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
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#4A6780"
            />
            <Text style={styles.infoText}>
              This is a UI checkout flow. Payment and database will be connected
              later.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              { backgroundColor: theme.colors.brand.primary },
            ]}
            activeOpacity={0.85}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F3FAFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F3342",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#4A6780",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#142636",
    marginBottom: 6,
  },
  courseMeta: {
    fontSize: 15,
    color: "#587086",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 15,
    color: "#4C6378",
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F3342",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0E79C8",
  },
  infoBox: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#E6F4FF",
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#4A6780",
    lineHeight: 18,
  },
  placeOrderButton: {
    marginTop: "auto",
    marginBottom: 18,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
