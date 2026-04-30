import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

import { useLanguagePreference } from "../../../services/settings/language.context";

export default function SettingsDetailScreen({ navigation }) {
  const { selectedLanguage } = useLanguagePreference();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#69AEE6",
      }}
    >
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

      <Text
        style={{
          marginTop: 48,
          textAlign: "center",
          fontSize: 24,
          fontWeight: "700",
          color: "#FFFFFF",
        }}
      >
        Settings
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
        Preferences
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Language")}
        style={{
          marginTop: 24,
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Feather name="globe" size={24} color="#222222" />
          <View style={{ marginLeft: 18, flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#111111",
              }}
            >
              Language
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontSize: 13,
                color: "#4A4A4A",
              }}
            >
              {selectedLanguage.name}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#222222" />
      </TouchableOpacity>
    </View>
  );
}
