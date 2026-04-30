import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TERMS_SECTIONS = [
  {
    title: "Using the App",
    body: "You agree to use You Are The Compass for lawful, respectful, and personal purposes. Do not misuse the app, attempt to disrupt it, or access another user's account.",
  },
  {
    title: "Your Account",
    body: "You are responsible for keeping your account details accurate and protecting your sign-in information. Please contact support if you believe your account has been accessed without permission.",
  },
  {
    title: "Your Content",
    body: "You keep ownership of content you add to the app, such as trip logs, journals, feedback, and profile details. You give us permission to store and process that content so the app can provide its features.",
  },
  {
    title: "Courses and Premium Features",
    body: "Course access, premium features, and pricing may vary over time. Some content or features may require purchase, subscription, or an eligible account.",
  },
  {
    title: "Service Changes",
    body: "We may update, improve, pause, or remove features as the app evolves. We will try to keep changes reasonable and focused on improving the experience.",
  },
  {
    title: "Disclaimer",
    body: "The app is provided as available. We work to keep it reliable, but we cannot guarantee it will always be uninterrupted, error-free, or suitable for every situation.",
  },
  {
    title: "Contact",
    body: "For questions about these terms, contact us at support@youarethecompass.com.",
  },
];

export default function TermsConditionsScreen({ navigation }) {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#69AEE6",
      }}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={{
          position: "absolute",
          top: 55,
          left: 18,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#6B6B6B" />
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 48,
          textAlign: "center",
          fontSize: 24,
          fontWeight: "700",
          color: "#FFFFFF",
        }}
      >
        Terms & Conditions
      </Text>

      <Text
        style={{
          marginTop: 40,
          marginLeft: 22,
          fontSize: 16,
          fontWeight: "700",
          color: "#000000",
        }}
      >
        Last updated: April 30, 2026
      </Text>

      <View
        style={{
          marginTop: 18,
          marginHorizontal: 20,
          backgroundColor: "#DCEBF7",
          borderRadius: 28,
          paddingHorizontal: 22,
          paddingVertical: 22,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            lineHeight: 21,
            color: "#333333",
            marginBottom: 18,
          }}
        >
          These terms describe the basic rules for using You Are The Compass.
        </Text>

        {TERMS_SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 18 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#111111",
                marginBottom: 6,
              }}
            >
              {section.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                color: "#4A4A4A",
              }}
            >
              {section.body}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
