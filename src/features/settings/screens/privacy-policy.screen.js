import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    body: "We may collect account details such as your name, email address, profile information, course activity, trip or journal content you choose to add, and support messages you send to us.",
  },
  {
    title: "How We Use Information",
    body: "We use your information to provide app features, manage your account, personalize your experience, improve the app, respond to support requests, and keep the service secure.",
  },
  {
    title: "Data Storage",
    body: "Your account and app data may be stored with trusted service providers that help us operate You Are The Compass. We only use these providers for app-related services.",
  },
  {
    title: "Sharing Information",
    body: "We do not sell your personal information. We may share information only when needed to provide the service, comply with legal obligations, prevent misuse, or protect users and the app.",
  },
  {
    title: "Your Choices",
    body: "You can update your account details in Settings. You can contact support to ask about accessing, correcting, or deleting information connected to your account.",
  },
  {
    title: "Contact",
    body: "For privacy questions, contact us at support@youarethecompass.com.",
  },
];

export default function PrivacyPolicyScreen({ navigation }) {
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
        Privacy Policy
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
          This policy explains how You Are The Compass handles information when
          you use the app.
        </Text>

        {PRIVACY_SECTIONS.map((section) => (
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
