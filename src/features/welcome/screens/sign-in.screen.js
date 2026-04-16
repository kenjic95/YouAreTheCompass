import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  confirmPasswordReset,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "../../../services/auth/firebase";

const logoImage = require("../../../../assets/logo.jpeg");

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

const Content = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  keyboardShouldPersistTaps: "handled",
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  padding: 16px 28px 48px;
`;

const MainSection = styled.View`
  flex: 1;
`;

const BackButton = styled.TouchableOpacity`
  width: 42px;
  margin-bottom: 28px;
`;

const Logo = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 170px;
  height: 170px;
  align-self: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 38px;
  color: #73afe6;
  text-align: center;
  margin-bottom: 38px;
`;

const HelperText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  line-height: 22px;
  color: #9c9c9c;
  margin: 4px 8px 24px;
`;

const InlineRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px 8px 18px;
`;

const InlineText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  line-height: 22px;
  color: #7f7f7f;
`;

const InlineLink = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 14px;
  line-height: 22px;
  color: #73afe6;
`;

const FieldGroup = styled.View`
  margin-bottom: 18px;
`;

const Label = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #5aa6e8;
  margin-left: 24px;
  margin-bottom: 8px;
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: "#abc2d7",
})`
  background-color: #e8f4ff;
  border-radius: 999px;
  min-height: 56px;
  padding: 16px 22px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #24557d;
  shadow-color: #000000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.16;
  shadow-radius: 8px;
  elevation: 5;
`;

const ReadOnlyInput = styled(Input).attrs({
  editable: false,
})`
  color: #7b8a99;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #5ea8e7;
  border-radius: 999px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  margin: 18px 40px 0px;
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

const ForgotPassword = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #2f5e86;
  text-align: center;
`;

const TextButton = styled.TouchableOpacity`
  margin-top: 14px;
`;

const ButtonsSection = styled.View`
  margin-top: 8px;
`;

export const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [hasSentResetCode, setHasSentResetCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSignInErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      default:
        return "Unable to sign in right now. Please try again.";
    }
  };

  const handleSignIn = async () => {
    if (!isFirebaseConfigured || !auth) {
      Alert.alert(
        "Auth disabled",
        "Firebase is not configured yet. Add Firebase keys in .env to enable sign in."
      );
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      Alert.alert("Sign in failed", getSignInErrorMessage(error?.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!isFirebaseConfigured || !auth) {
      Alert.alert(
        "Auth disabled",
        "Firebase is not configured yet. Add Firebase keys in .env to enable password reset."
      );
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        "Missing email",
        "Please enter the email address for your account."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setHasSentResetCode(true);
      Alert.alert("Code sent", "Check your email for the password reset code.");
    } catch (error) {
      if (error?.code === "auth/invalid-email") {
        Alert.alert("Reset failed", "Please enter a valid email address.");
      } else {
        Alert.alert(
          "Reset failed",
          "Unable to send reset instructions right now. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPasswordReset = async () => {
    if (!isFirebaseConfigured || !auth) {
      Alert.alert(
        "Auth disabled",
        "Firebase is not configured yet. Add Firebase keys in .env to enable password reset."
      );
      return;
    }

    const trimmedCode = verificationCode.trim();

    if (!trimmedCode || !newPassword) {
      Alert.alert(
        "Missing fields",
        "Please enter the verification code and your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Weak password",
        "Your new password must be at least 6 characters."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmPasswordReset(auth, trimmedCode, newPassword);
      Alert.alert(
        "Password reset",
        "Your password has been updated. You can now sign in."
      );
      setIsForgotPasswordMode(false);
      setHasSentResetCode(false);
      setVerificationCode("");
      setNewPassword("");
      setPassword("");
    } catch (error) {
      switch (error?.code) {
        case "auth/expired-action-code":
          Alert.alert(
            "Code expired",
            "That reset code has expired. Please request a new one."
          );
          break;
        case "auth/invalid-action-code":
          Alert.alert(
            "Invalid code",
            "That verification code is invalid. Please check the email and try again."
          );
          break;
        case "auth/weak-password":
          Alert.alert(
            "Weak password",
            "Your new password must be at least 6 characters."
          );
          break;
        default:
          Alert.alert(
            "Reset failed",
            "Unable to reset your password right now. Please try again."
          );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setHasSentResetCode(false);
    setVerificationCode("");
    setNewPassword("");
    setPassword("");
  };

  const handleBackToSignIn = () => {
    setIsForgotPasswordMode(false);
    setHasSentResetCode(false);
    setVerificationCode("");
    setNewPassword("");
    setPassword("");
  };

  return (
    <Screen edges={["top", "right", "bottom", "left"]}>
      <Content>
        <MainSection>
          <BackButton onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={34} color="#7a7a7a" />
          </BackButton>

          <Logo source={logoImage} />
          <Title>{isForgotPasswordMode ? "Forgot Password" : "Sign In"}</Title>

          <FieldGroup>
            <Label>Email</Label>
            {hasSentResetCode ? (
              <ReadOnlyInput value={email} />
            ) : (
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          </FieldGroup>

          {isForgotPasswordMode ? (
            hasSentResetCode ? (
              <>
                <HelperText>
                  Check your email and enter the code we sent in the box below.
                </HelperText>

                <InlineRow>
                  <InlineText>Didn&apos;t see the code? </InlineText>
                  <TextButton
                    activeOpacity={0.8}
                    onPress={handlePasswordReset}
                    disabled={isSubmitting}
                  >
                    <InlineLink>Re-send now</InlineLink>
                  </TextButton>
                </InlineRow>

                <FieldGroup>
                  <Label>Verification code</Label>
                  <Input
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    autoCapitalize="none"
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label>New Password</Label>
                  <Input
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </FieldGroup>
              </>
            ) : (
              <HelperText>
                Enter a valid email address associated with your account to
                reset your password.
              </HelperText>
            )
          ) : (
            <FieldGroup>
              <Label>Password</Label>
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </FieldGroup>
          )}

          <ButtonsSection>
            <SubmitButton
              activeOpacity={0.9}
              onPress={
                isForgotPasswordMode
                  ? hasSentResetCode
                    ? handleConfirmPasswordReset
                    : handlePasswordReset
                  : handleSignIn
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <SubmitLabel>
                  {isForgotPasswordMode
                    ? hasSentResetCode
                      ? "Reset Password"
                      : "Send Code"
                    : "Sign In"}
                </SubmitLabel>
              )}
            </SubmitButton>

            {isForgotPasswordMode ? (
              <SubmitButton
                activeOpacity={0.9}
                onPress={handleBackToSignIn}
                disabled={isSubmitting}
              >
                <SubmitLabel>Back to Log In</SubmitLabel>
              </SubmitButton>
            ) : (
              <TextButton
                activeOpacity={0.8}
                onPress={handleToggleForgotPassword}
              >
                <ForgotPassword>Forgot Password?</ForgotPassword>
              </TextButton>
            )}
          </ButtonsSection>
        </MainSection>
      </Content>
    </Screen>
  );
};
