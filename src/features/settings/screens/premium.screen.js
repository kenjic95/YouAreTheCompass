import React from "react";
import { Alert, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";

import { db, isFirebaseConfigured } from "../../../services/auth/firebase";
import { useUserProfile } from "../../../services/auth/user-profile.context";

export default function PremiumScreen({ navigation }) {
  const { authUser, isPremium } = useUserProfile();

  const handleActivatePremium = async () => {
    if (!isFirebaseConfigured || !db || !authUser?.uid) {
      Alert.alert("Not available", "Please sign in with Firebase to continue.");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", authUser.uid),
        { plan: "premium", discountPercent: 20 },
        { merge: true }
      );
      Alert.alert(
        "Premium active",
        "20% discount has been applied to courses."
      );
    } catch (error) {
      Alert.alert("Update failed", "Unable to activate premium right now.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F4F4F4",
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: "center",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#5FA8E8" />
      </TouchableOpacity>

      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          color: "#69AEE6",
          marginBottom: 30,
          fontWeight: "400",
        }}
      >
        Upgrade to Premium
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 18,
          color: "#69AEE6",
          marginBottom: 20,
        }}
      >
        Why Premium?
      </Text>

      {/* Benefits Box */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#DCEBF7",
          borderRadius: 30,
          paddingVertical: 24,
          paddingHorizontal: 24,
          marginBottom: 50,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 5,
          elevation: 4,
        }}
      >
        <Benefit text="Verified Premium Account" />
        <Benefit text="20% Discount For Courses" />
        <Benefit text="Access To Premium Contents" />
        <Benefit text="Cancel Anytime" noMargin />
      </View>

      {/* Description */}
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          color: "#356C99",
          fontWeight: "700",
          lineHeight: 24,
          marginBottom: 24,
        }}
      >
        Unlock exclusive features and premium content{"\n"}
        to enhance your experience.
      </Text>

      {/* Price */}
      <Text
        style={{
          fontSize: 18,
          color: "#356C99",
          fontWeight: "800",
          marginBottom: 35,
        }}
      >
        For only $9.99 /month
      </Text>

      {/* Button */}
      <TouchableOpacity
        onPress={handleActivatePremium}
        style={{
          backgroundColor: isPremium ? "#6f9fc6" : "#69B0E5",
          paddingVertical: 18,
          paddingHorizontal: 38,
          borderRadius: 35,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 5,
          elevation: 4,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          {isPremium ? "Premium Active" : "Unlock Premium"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Benefit({ text, noMargin }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: noMargin ? 0 : 18,
      }}
    >
      <Ionicons name="checkmark" size={26} color="#356C99" />
      <Text
        style={{
          fontSize: 16,
          color: "#356C99",
          fontWeight: "600",
          marginLeft: 12,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
