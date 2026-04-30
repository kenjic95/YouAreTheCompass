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
import Constants from "expo-constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useUserProfile } from "../../../services/auth/user-profile.context";

const SUPPORT_EMAIL = "support@youarethecompass.com";
const PROBLEM_AREAS = ["Account", "Courses", "Trips", "Settings", "Other"];
const SEVERITY_OPTIONS = ["Low", "Medium", "High"];

const buildProblemReportUrl = ({
  area,
  description,
  email,
  expected,
  severity,
  steps,
}) => {
  const appVersion =
    Constants.expoConfig?.version || Constants.manifest?.version || "Unknown";
  const subject = encodeURIComponent(`Problem report: ${area} (${severity})`);
  const body = encodeURIComponent(
    [
      `From: ${email}`,
      `Area: ${area}`,
      `Severity: ${severity}`,
      `Platform: ${Platform.OS}`,
      `App version: ${appVersion}`,
      "",
      "What happened:",
      description.trim(),
      "",
      "Steps to reproduce:",
      steps.trim() || "Not provided",
      "",
      "What did you expect to happen?",
      expected.trim() || "Not provided",
    ].join("\n")
  );

  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
};

export default function ReportProblemScreen({ navigation }) {
  const { profile } = useUserProfile();
  const profileEmail = useMemo(() => profile?.email?.trim() || "", [profile]);
  const [area, setArea] = useState(PROBLEM_AREAS[0]);
  const [severity, setSeverity] = useState(SEVERITY_OPTIONS[1]);
  const [email, setEmail] = useState(profileEmail);
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");

  useEffect(() => {
    if (profileEmail && !email.trim()) {
      setEmail(profileEmail);
    }
  }, [email, profileEmail]);

  const handleSend = async () => {
    const trimmedEmail = email.trim();
    const trimmedDescription = description.trim();

    if (!trimmedEmail) {
      Alert.alert("Email required", "Please enter your email address.");
      return;
    }

    if (!trimmedDescription) {
      Alert.alert(
        "Details required",
        "Please describe the problem before sending."
      );
      return;
    }

    const mailUrl = buildProblemReportUrl({
      area,
      description: trimmedDescription,
      email: trimmedEmail,
      expected,
      severity,
      steps,
    });

    try {
      const canOpenMail = await Linking.canOpenURL(mailUrl);

      if (!canOpenMail) {
        Alert.alert(
          "Mail app unavailable",
          `Please email your report directly to ${SUPPORT_EMAIL}.`
        );
        return;
      }

      await Linking.openURL(mailUrl);
    } catch (error) {
      Alert.alert(
        "Unable to open email",
        `Please email your report directly to ${SUPPORT_EMAIL}.`
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
          Report a Problem
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
          Problem Details
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
          <FieldLabel>Where did it happen?</FieldLabel>
          <OptionRow
            options={PROBLEM_AREAS}
            selectedOption={area}
            onSelect={setArea}
          />

          <FieldLabel>Severity</FieldLabel>
          <OptionRow
            options={SEVERITY_OPTIONS}
            selectedOption={severity}
            onSelect={setSeverity}
          />

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

          <FieldLabel>What happened?</FieldLabel>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Describe the problem you ran into."
            placeholderTextColor="#7A7A7A"
            textAlignVertical="top"
            style={{
              minHeight: 120,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 14,
              fontSize: 15,
              lineHeight: 20,
              color: "#222222",
              marginBottom: 18,
            }}
          />

          <FieldLabel>Steps to reproduce</FieldLabel>
          <TextInput
            value={steps}
            onChangeText={setSteps}
            multiline
            placeholder="Example: I opened Settings, tapped Help, then..."
            placeholderTextColor="#7A7A7A"
            textAlignVertical="top"
            style={{
              minHeight: 96,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 14,
              fontSize: 15,
              lineHeight: 20,
              color: "#222222",
              marginBottom: 18,
            }}
          />

          <FieldLabel>Expected result</FieldLabel>
          <TextInput
            value={expected}
            onChangeText={setExpected}
            multiline
            placeholder="What should have happened instead?"
            placeholderTextColor="#7A7A7A"
            textAlignVertical="top"
            style={{
              minHeight: 86,
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
            <MaterialIcons name="report-problem" size={20} color="#FFFFFF" />
            <Text
              style={{
                marginLeft: 10,
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Send Report
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

function OptionRow({ onSelect, options, selectedOption }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 18,
      }}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedOption === option }}
          style={{
            marginRight: 8,
            marginBottom: 8,
            paddingVertical: 9,
            paddingHorizontal: 13,
            borderRadius: 16,
            backgroundColor: selectedOption === option ? "#69AEE6" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              color: selectedOption === option ? "#FFFFFF" : "#333333",
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
