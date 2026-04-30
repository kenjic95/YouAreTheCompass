import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import {
  LANGUAGES,
  useLanguagePreference,
} from "../../../services/settings/language.context";

export default function LanguageScreen({ navigation }) {
  const { selectedLanguage, setLanguage } = useLanguagePreference();

  const handleSelectLanguage = async (languageCode) => {
    await setLanguage(languageCode);
    navigation.goBack();
  };

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
        Language
      </Text>

      <View style={{ marginTop: 40 }}>
        {LANGUAGES.map((language) => {
          const isSelected = language.code === selectedLanguage.code;

          return (
            <TouchableOpacity
              key={language.code}
              onPress={() => handleSelectLanguage(language.code)}
              style={{
                marginHorizontal: 20,
                marginBottom: 12,
                backgroundColor: "#DCEBF7",
                borderRadius: 24,
                minHeight: 58,
                paddingHorizontal: 22,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.14,
                shadowRadius: 5,
                elevation: 4,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111111",
                  }}
                >
                  {language.name}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 13,
                    color: "#4A4A4A",
                  }}
                >
                  {language.nativeName}
                </Text>
              </View>

              {isSelected ? (
                <Feather name="check-circle" size={24} color="#2F6F3E" />
              ) : (
                <Feather name="circle" size={24} color="#7A7A7A" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
