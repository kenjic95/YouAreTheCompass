import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

export default function HelpSupportScreen({ navigation }) {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#69AEE6",
      }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 55,
          left: 18,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#6B6B6B" />
      </TouchableOpacity>

      {/* Title */}
      <Text
        style={{
          marginTop: 48,
          textAlign: "center",
          fontSize: 24,
          fontWeight: "700",
          color: "#FFFFFF",
        }}
      >
        Help & Support
      </Text>

      {/* Section Title */}
      <Text
        style={{
          marginTop: 40,
          marginLeft: 22,
          fontSize: 16,
          fontWeight: "700",
          color: "#000000",
        }}
      >
        Support
      </Text>

      {/* FAQ */}
      <ActionCard
        icon={<Feather name="help-circle" size={24} color="#222" />}
        label="FAQs"
        onPress={() => navigation.navigate("FAQs")}
      />

      {/* Contact */}
      <ActionCard
        icon={<Feather name="mail" size={24} color="#222" />}
        label="Contact Support"
        onPress={() => navigation.navigate("ContactSupport")}
      />

      {/* Report Problem */}
      <ActionCard
        icon={<MaterialIcons name="report-problem" size={24} color="#222" />}
        label="Report a Problem"
        onPress={() => console.log("Report")}
      />

      {/* Section Title */}
      <Text
        style={{
          marginTop: 30,
          marginLeft: 22,
          fontSize: 16,
          fontWeight: "700",
          color: "#000000",
        }}
      >
        Legal
      </Text>

      {/* Privacy */}
      <ActionCard
        icon={<Feather name="lock" size={24} color="#222" />}
        label="Privacy Policy"
        onPress={() => console.log("Privacy")}
      />

      {/* Terms */}
      <ActionCard
        icon={<Feather name="file-text" size={24} color="#222" />}
        label="Terms & Conditions"
        onPress={() => console.log("Terms")}
      />

      {/* Footer */}
      <Text
        style={{
          marginTop: 30,
          textAlign: "center",
          fontSize: 12,
          color: "#5F5F5F",
        }}
      >
        We're here to help you anytime ✨
      </Text>
    </ScrollView>
  );
}

function ActionCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 18,
        marginHorizontal: 20,
        backgroundColor: "#DCEBF7",
        borderRadius: 28,
        minHeight: 58,
        paddingHorizontal: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <Text
          style={{
            marginLeft: 18,
            fontSize: 16,
            fontWeight: "700",
            color: "#111111",
          }}
        >
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#222222" />
    </TouchableOpacity>
  );
}
