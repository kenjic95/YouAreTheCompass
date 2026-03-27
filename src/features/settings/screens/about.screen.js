import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function AboutScreen({ navigation }) {
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
        About Settings
      </Text>

      <Text
        style={{
          marginTop: 32,
          marginLeft: 22,
          fontSize: 16,
          fontWeight: "700",
          color: "#000000",
        }}
      >
        About
      </Text>

      <View
        style={{
          marginTop: 26,
          marginHorizontal: 18,
          backgroundColor: "#DCEBF7",
          borderRadius: 32,
          paddingVertical: 22,
          paddingHorizontal: 22,
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
            justifyContent: "space-between",
            marginBottom: 38,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#111111",
              width: 90,
            }}
          >
            Name
          </Text>

          <Text
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: "500",
              color: "#7A7A7A",
            }}
          >
            You Are The Compass App
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#111111",
              width: 90,
            }}
          >
            Version
          </Text>

          <Text
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: "700",
              color: "#8A90D6",
            }}
          >
            1.0.0
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 38,
          marginLeft: 22,
          fontSize: 16,
          fontWeight: "700",
          color: "#000000",
        }}
      >
        Legal
      </Text>

      <TouchableOpacity
        onPress={() => console.log("Privacy pressed")}
        style={{
          marginTop: 22,
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
          }}
        >
          <Feather name="lock" size={24} color="#222222" />
          <Text
            style={{
              marginLeft: 18,
              fontSize: 16,
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Privacy
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#222222" />
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 18,
          marginLeft: 74,
          fontSize: 12,
          color: "#5F5F5F",
          lineHeight: 18,
        }}
      >
        Copyright © 2024 You Are the Compass App{"\n"}All rights reserved.
      </Text>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          alignSelf: "center",
          width: 320,
          height: 380,
          backgroundColor: "#F4F4F4",
          borderTopLeftRadius: 160,
          borderTopRightRadius: 160,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 30,
        }}
      >
        <Feather name="compass" size={95} color="#222222" />

        <Text
          style={{
            marginTop: 14,
            fontSize: 18,
            fontWeight: "700",
            color: "#222222",
            textAlign: "center",
          }}
        >
          You Are The Compass
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#6A6A6A",
            textAlign: "center",
          }}
        >
          Find your path. Keep moving forward.
        </Text>
      </View>
    </View>
  );
}