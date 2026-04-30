import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { useUserProfile } from "../../../services/auth/user-profile.context";

const SUPPORT_EMAIL = "support@youarethecompass.com";
const CONTACT_TOPICS = ["Account", "Courses", "Trips", "Billing", "Other"];

const buildMailUrl = ({ email, message, topic }) => {
  const subject = encodeURIComponent(`Support request: ${topic}`);
  const body = encodeURIComponent(
    [`From: ${email}`, "", message.trim()].join("\n")
  );

  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
};

export default function ContactSupportScreen({ navigation }) {
  const { profile } = useUserProfile();
  const profileEmail = useMemo(() => profile?.email?.trim() || "", [profile]);
  const [topic, setTopic] = useState(CONTACT_TOPICS[0]);
  const [email, setEmail] = useState(profileEmail);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profileEmail && !email.trim()) {
      setEmail(profileEmail);
    }
  }, [email, profileEmail]);

  const handleSend = async () => {
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      Alert.alert("Email required", "Please enter your email address.");
      return;
    }

    if (!trimmedMessage) {
      Alert.alert("Message required", "Please tell us how we can help.");
      return;
    }

    const mailUrl = buildMailUrl({
      email: trimmedEmail,
      message: trimmedMessage,
      topic,
    });

    try {
      const canOpenMail = await Linking.canOpenURL(mailUrl);

      if (!canOpenMail) {
        Alert.alert(
          "Mail app unavailable",
          `Please email us directly at ${SUPPORT_EMAIL}.`
        );
        return;
      }

      await Linking.openURL(mailUrl);
    } catch (error) {
      Alert.alert(
        "Unable to open email",
        `Please email us directly at ${SUPPORT_EMAIL}.`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: "#69AEE6",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#69AEE6",
        }}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
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
          Contact Support
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
          How can we help?
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
              fontSize: 14,
              fontWeight: "700",
              color: "#111111",
              marginBottom: 10,
            }}
          >
            Topic
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {CONTACT_TOPICS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setTopic(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: topic === item }}
                style={{
                  marginRight: 8,
                  marginBottom: 8,
                  paddingVertical: 9,
                  paddingHorizontal: 13,
                  borderRadius: 16,
                  backgroundColor: topic === item ? "#69AEE6" : "#FFFFFF",
                }}
              >
                <Text
                  style={{
                    color: topic === item ? "#FFFFFF" : "#333333",
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FieldLabel>Email</FieldLabel>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#7A7A7A"
            style={{
              minHeight: 48,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingHorizontal: 14,
              fontSize: 15,
              color: "#222222",
              marginBottom: 18,
            }}
          />

          <FieldLabel>Message</FieldLabel>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder="Tell us what happened or what you need help with."
            placeholderTextColor="#7A7A7A"
            textAlignVertical="top"
            style={{
              minHeight: 150,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 14,
              fontSize: 15,
              lineHeight: 20,
              color: "#222222",
              marginBottom: 20,
            }}
          />

          <TouchableOpacity
            onPress={handleSend}
            accessibilityRole="button"
            style={{
              minHeight: 54,
              borderRadius: 22,
              backgroundColor: "#3F79A8",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 18,
            }}
          >
            <Feather name="send" size={19} color="#FFFFFF" />
            <Text
              style={{
                marginLeft: 10,
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Send Email
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: "700",
        color: "#111111",
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}
