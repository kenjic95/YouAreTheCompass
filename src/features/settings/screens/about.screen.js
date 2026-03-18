import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F4F4F4",
        paddingHorizontal: 24,
        paddingTop: 60,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 30 }}
      >
        <Ionicons name="arrow-back" size={28} color="#5FA8E8" />
      </TouchableOpacity>

      <Text style={{ fontSize: 28, color: "#69AEE6", marginBottom: 20 }}>
        About
      </Text>

      <Text style={{ fontSize: 16, color: "#356C99" }}>
        This is the About screen.
      </Text>
    </View>
  );
}