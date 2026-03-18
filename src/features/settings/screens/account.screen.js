import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AccountScreen({ navigation }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: "#69AEE6",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <View
        style={{
          paddingTop: 90,
          paddingHorizontal: 20,
          paddingBottom: 48,
        }}
      >
        <View
          style={{
            backgroundColor: "#DCEBF7",
            borderRadius: 42,
            paddingTop: 28,
            paddingHorizontal: 24,
            paddingBottom: 34,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#565656",
              marginBottom: 22,
            }}
          >
            Account Settings
          </Text>

          <View
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 34,
            }}
          >
            <View
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: "#8C8C8C",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="user" size={110} color="#FFFFFF" />
            </View>
          </View>

          <View style={{ width: "100%", paddingHorizontal: 12 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#222222",
                marginBottom: 10,
              }}
            >
              Account Details
            </Text>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color: "#5A5A5A",
                marginBottom: 10,
              }}
            >
              User Full Name
            </Text>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color: "#5A5A5A",
              }}
            >
              user@email.com
            </Text>
          </View>
        </View>

        <ActionCard
          icon={<Feather name="edit-2" size={28} color="#222222" />}
          label="Edit Account Details"
          onPress={() => {}}
        />

        <ActionCard
          icon={
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#222222"
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
        backgroundColor: "#EAF3FB",
        borderRadius: 30,
        minHeight: 72,
        marginTop: 28,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <View style={{ width: 40, alignItems: "center" }}>{icon}</View>
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
