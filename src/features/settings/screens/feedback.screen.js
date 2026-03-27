import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FeedbackScreen({ navigation }) {
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("General");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback.");
      return;
    }

    if (rating === 0) {
      Alert.alert("Error", "Please select a rating.");
      return;
    }

    console.log("Category:", category);
    console.log("Rating:", rating);
    console.log("Feedback:", feedback);

    Alert.alert("Thank you!", "Your feedback has been submitted.");

    setFeedback("");
    setCategory("General");
    setRating(0);
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
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 30 }}
      >
        <Ionicons name="arrow-back" size={28} color="#5FA8E8" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={{ fontSize: 28, color: "#69AEE6", marginBottom: 8 }}>
        Feedback
      </Text>

      <Text style={{ fontSize: 15, color: "#356C99", marginBottom: 25 }}>
        Help us improve your journey by sharing your thoughts.
      </Text>

      {/* Category */}
      <Text
        style={{
          marginBottom: 10,
          color: "#356C99",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        Select Category
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginBottom: 25,
          flexWrap: "wrap",
        }}
      >
        {["General", "Bug", "Suggestion"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setCategory(item)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              backgroundColor: category === item ? "#69AEE6" : "#E0E0E0",
              borderRadius: 12,
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: category === item ? "#FFFFFF" : "#333333",
                fontWeight: "500",
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rating */}
      <Text
        style={{
          marginBottom: 10,
          color: "#356C99",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        Rate Your Experience
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginBottom: 25,
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={{ marginRight: 8 }}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color="#F5B301"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Input */}
      <Text
        style={{
          marginBottom: 10,
          color: "#356C99",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        Your Feedback
      </Text>

      <TextInput
        placeholder="Write your feedback here..."
        placeholderTextColor="#999"
        multiline
        value={feedback}
        onChangeText={setFeedback}
        style={{
          height: 140,
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          padding: 15,
          textAlignVertical: "top",
          marginBottom: 25,
          fontSize: 15,
          color: "#333",
        }}
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: "#69AEE6",
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Submit Feedback
        </Text>
      </TouchableOpacity>
    </View>
  );
}