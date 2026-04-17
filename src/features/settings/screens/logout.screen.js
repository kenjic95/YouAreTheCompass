import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

import { auth, isFirebaseConfigured } from "../../../services/auth/firebase";

export default function LogoutScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          if (!isFirebaseConfigured || !auth) {
            Alert.alert(
              "Auth disabled",
              "Firebase is not configured yet. Nothing to logout from."
            );
            return;
          }

          try {
            await signOut(auth);
          } catch {
            Alert.alert("Logout failed", "Unable to logout right now.");
            return;
          }
        },
      },
    ]);
  };

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
        Logout
      </Text>

      <Text style={{ fontSize: 16, color: "#356C99", marginBottom: 30 }}>
        Are you sure you want to logout?
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#69B0E5",
          paddingVertical: 16,
          borderRadius: 30,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
          Confirm Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
