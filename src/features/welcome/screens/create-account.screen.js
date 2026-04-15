import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import {
  auth,
  db,
  isFirebaseConfigured,
} from "../../../services/auth/firebase";

const logoImage = require("../../../../assets/logo-transparentBG.png");

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: #c0e3ff;
`;

const Content = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingBottom: 48,
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  padding: 16px 26px 0px;
`;

const BackButton = styled.TouchableOpacity`
  width: 42px;
  margin-bottom: 8px;
`;

const Logo = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 156px;
  height: 156px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.playball};
  font-size: 30px;
  color: #111111;
  text-align: center;
  margin-bottom: 34px;
`;

const FieldGroup = styled.View`
  margin-bottom: 18px;
`;

const Label = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 15px;
  color: #5aa6e8;
  margin-left: 14px;
  margin-bottom: 8px;
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: "#9cb4c7",
})`
  background-color: #eef7ff;
  border-radius: 999px;
  padding: 16px 20px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #24557d;
  shadow-color: #000000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.16;
  shadow-radius: 8px;
  elevation: 5;
`;

const BirthRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  margin-top: 2px;
`;

const BirthInputWrap = styled.View`
  flex: ${(props) => props.flexValue || 1};
  z-index: 10;
`;

const BirthInput = styled.View`
  background-color: #eef7ff;
  border-radius: 999px;
  min-height: 50px;
  padding: 0px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: #000000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.16;
  shadow-radius: 8px;
  elevation: 5;
`;

const BirthText = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #5aa6e8;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #5ea8e7;
  border-radius: 999px;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  margin: 44px 68px 24px;
  shadow-color: #000000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.18;
  shadow-radius: 8px;
  elevation: 5;
`;

const SubmitLabel = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #ffffff;
`;

const FooterRow = styled.View`
  flex-direction: row;
  align-self: center;
  align-items: center;
`;

const FooterText = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 15px;
  color: #2f5e86;
`;

const FooterLink = styled.TouchableOpacity`
  margin-left: 8px;
`;

const FooterLinkText = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 15px;
  color: #5aa6e8;
`;

export const CreateAccountScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedDay, setSelectedDay] = useState("Day");
  const [showDay, setShowDay] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("Month");
  const [showMonth, setShowMonth] = useState(false);

  const [selectedYear, setSelectedYear] = useState("Year");
  const [showYear, setShowYear] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCreateAccountErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "That email is already in use.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      default:
        return "Unable to create account right now. Please try again.";
    }
  };

  const handleCreateAccount = async () => {
    if (!isFirebaseConfigured || !auth || !db) {
      Alert.alert(
        "Auth disabled",
        "Firebase is not configured yet. Add Firebase keys in .env to enable account creation."
      );
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !normalizedEmail ||
      !password
    ) {
      Alert.alert("Missing fields", "Please complete all required fields.");
      return;
    }

    if (
      selectedDay === "Day" ||
      selectedMonth === "Month" ||
      selectedYear === "Year"
    ) {
      Alert.alert(
        "Missing date of birth",
        "Please select your full date of birth."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
      const displayName = `${trimmedFirstName} ${trimmedLastName}`.trim();

      await updateProfile(credential.user, { displayName });

      setDoc(
        doc(db, "users", credential.user.uid),
        {
          uid: credential.user.uid,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          email: normalizedEmail,
          dateOfBirth: {
            day: selectedDay,
            month: selectedMonth,
            year: selectedYear,
          },
          role: "student",
          plan: "free",
          discountPercent: 0,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ).catch((persistError) => {
        console.warn(
          "Unable to persist user profile in Firestore.",
          persistError
        );
      });
    } catch (error) {
      Alert.alert(
        "Create account failed",
        getCreateAccountErrorMessage(error?.code)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen edges={["top", "right", "bottom", "left"]}>
      <Content>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={34} color="#6e6e6e" />
        </BackButton>

        <Logo source={logoImage} />
        <Title>Create account</Title>

        <FieldGroup>
          <Label>First Name</Label>
          <Input value={firstName} onChangeText={setFirstName} />
        </FieldGroup>

        <FieldGroup>
          <Label>Last Name</Label>
          <Input value={lastName} onChangeText={setLastName} />
        </FieldGroup>

        <FieldGroup>
          <Label>Enter Valid Email Address</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Password</Label>
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Date of Birth</Label>
          <BirthRow>
            <BirthInputWrap>
              <TouchableOpacity onPress={() => setShowDay(!showDay)}>
                <BirthInput>
                  <BirthText>{selectedDay}</BirthText>
                  <Ionicons name="chevron-down" size={18} color="#b4bdc8" />
                </BirthInput>
              </TouchableOpacity>
              {showDay && (
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 10,
                    marginTop: 5,
                    zIndex: 999,
                    elevation: 10,
                  }}
                >
                  {[...Array(31)].map((_, i) => (
                    <Text
                      key={i}
                      style={{ padding: 10 }}
                      onPress={() => {
                        setSelectedDay(`${i + 1}`);
                        setShowDay(false);
                      }}
                    >
                      {i + 1}
                    </Text>
                  ))}
                </View>
              )}
            </BirthInputWrap>

            <BirthInputWrap>
              <TouchableOpacity onPress={() => setShowMonth(!showMonth)}>
                <BirthInput>
                  <BirthText>{selectedMonth}</BirthText>
                  <Ionicons name="chevron-down" size={18} color="#b4bdc8" />
                </BirthInput>
              </TouchableOpacity>
              {showMonth && (
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 10,
                    marginTop: 5,
                    zIndex: 999,
                    elevation: 10,
                  }}
                >
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m, i) => (
                    <Text
                      key={i}
                      style={{ padding: 10 }}
                      onPress={() => {
                        setSelectedMonth(m);
                        setShowMonth(false);
                      }}
                    >
                      {m}
                    </Text>
                  ))}
                </View>
              )}
            </BirthInputWrap>

            <BirthInputWrap flexValue={1.3}>
              <TouchableOpacity onPress={() => setShowYear(!showYear)}>
                <BirthInput>
                  <BirthText>{selectedYear}</BirthText>
                  <Ionicons name="chevron-down" size={18} color="#b4bdc8" />
                </BirthInput>
              </TouchableOpacity>
              {showYear && (
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 10,
                    marginTop: 5,
                    zIndex: 999,
                    elevation: 10,
                  }}
                >
                  {[...Array(50)].map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return (
                      <Text
                        key={i}
                        style={{ padding: 10 }}
                        onPress={() => {
                          setSelectedYear(`${y}`);
                          setShowYear(false);
                        }}
                      >
                        {y}
                      </Text>
                    );
                  })}
                </View>
              )}
            </BirthInputWrap>
          </BirthRow>
        </FieldGroup>

        <SubmitButton
          activeOpacity={0.9}
          onPress={handleCreateAccount}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <SubmitLabel>Create an Account</SubmitLabel>
          )}
        </SubmitButton>

        <FooterRow>
          <FooterText>Already have an Account?</FooterText>
          <FooterLink onPress={() => navigation.navigate("SignIn")}>
            <FooterLinkText>Sign in</FooterLinkText>
          </FooterLink>
        </FooterRow>
      </Content>
    </Screen>
  );
};
