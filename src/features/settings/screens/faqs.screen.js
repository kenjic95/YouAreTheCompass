import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

const FAQ_ITEMS = [
  {
    question: "How do I update my account details?",
    answer:
      "Open Settings, choose Account, then update the profile details you want to change.",
  },
  {
    question: "How do I change my language?",
    answer:
      "Go to Settings, open Preferences, then choose Language to select your preferred app language.",
  },
  {
    question: "Where can I find my purchased courses?",
    answer:
      "Open Learnings and choose My Courses to view courses you have purchased or started.",
  },
  {
    question: "How do I report an issue?",
    answer:
      "Return to Help & Support and choose Report a Problem. Include what happened and where you saw it so support can help faster.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Use Contact Support from the Help & Support screen and share the email address connected to your account.",
  },
];

export default function FAQsScreen({ navigation }) {
  const [openQuestion, setOpenQuestion] = useState(FAQ_ITEMS[0].question);

  const toggleQuestion = (question) => {
    setOpenQuestion((currentQuestion) =>
      currentQuestion === question ? "" : question
    );
  };

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
        FAQs
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
        Common Questions
      </Text>

      {FAQ_ITEMS.map((item) => {
        const isOpen = openQuestion === item.question;

        return (
          <View
            key={item.question}
            style={{
              marginTop: 18,
              marginHorizontal: 20,
              backgroundColor: "#DCEBF7",
              borderRadius: 28,
              paddingHorizontal: 22,
              paddingVertical: 17,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleQuestion(item.question)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              style={{
                minHeight: 28,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 12,
                }}
              >
                <Feather name="help-circle" size={22} color="#222222" />
                <Text
                  style={{
                    flex: 1,
                    marginLeft: 14,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111111",
                    lineHeight: 21,
                  }}
                >
                  {item.question}
                </Text>
              </View>

              <Ionicons
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={22}
                color="#222222"
              />
            </TouchableOpacity>

            {isOpen ? (
              <Text
                style={{
                  marginTop: 14,
                  marginLeft: 36,
                  fontSize: 14,
                  lineHeight: 20,
                  color: "#4A4A4A",
                }}
              >
                {item.answer}
              </Text>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}
