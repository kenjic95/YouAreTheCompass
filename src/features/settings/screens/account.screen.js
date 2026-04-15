import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";

import { auth, isFirebaseConfigured } from "../../../services/auth/firebase";

const FALLBACK_NAME = "User Full Name";
const FALLBACK_EMAIL = "user@email.com";

const getDisplayProfile = (user) => {
  if (!user) {
    return {
      name: FALLBACK_NAME,
      email: FALLBACK_EMAIL,
    };
  }

  return {
    name: user.displayName?.trim() || FALLBACK_NAME,
    email: user.email?.trim() || FALLBACK_EMAIL,
  };
};

export default function AccountScreen({ navigation }) {
  const [profile, setProfile] = useState(() =>
    getDisplayProfile(auth?.currentUser || null)
  );

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setProfile(getDisplayProfile(null));
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setProfile(getDisplayProfile(user));
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      style={{
        flex: 1,
        backgroundColor: "#69AEE6",
      }}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 58,
          left: 22,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={30} color="#6B6B6B" />
      </TouchableOpacity>

      {/* Top Card */}
      <View
        style={{
          backgroundColor: "#DCEBF7",
          borderBottomLeftRadius: 48,
          borderBottomRightRadius: 48,
          paddingTop: 95,
          paddingHorizontal: 30,
          paddingBottom: 38,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.16,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#5A5A5A",
            marginBottom: 20,
          }}
        >
          Account Settings
        </Text>

        {/* Avatar outer circle */}
        <View
          style={{
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: "#F4F4F4",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 34,
          }}
        >
          {/* Avatar inner circle */}
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: "#8A8A8A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="user" size={90} color="#FFFFFF" />
          </View>
        </View>

        {/* Account info */}
        <View style={{ width: "100%" }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: "#1F1F1F",
              marginBottom: 10,
            }}
          >
            Account Details
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#5F5F5F",
              marginBottom: 8,
            }}
          >
            {profile.name}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#5F5F5F",
            }}
          >
            {profile.email}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View
        style={{
          paddingHorizontal: 28,
          paddingTop: 24,
        }}
      >
        <ActionCard
          icon={<Feather name="edit-2" size={24} color="#1A1A1A" />}
          label="Edit Account Details"
          onPress={() => {}}
        />

        <ActionCard
          icon={
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={26}
              color="#1A1A1A"
            />
          }
          label="Request Account Deletion"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}

function ActionCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#DCEBF7",
        borderRadius: 30,
        height: 58,
        marginBottom: 22,
        paddingHorizontal: 28,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <View style={{ width: 28, alignItems: "center" }}>{icon}</View>

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
    </TouchableOpacity>
  );
}
