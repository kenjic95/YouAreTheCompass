import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, isFirebaseConfigured } from "../../../services/auth/firebase";

const logoImage = require("../../../../assets/logo.jpeg");
const SKIP_EMAIL_VERIFICATION_FOR_TESTING =
  String(process.env.EXPO_PUBLIC_SKIP_EMAIL_VERIFICATION ?? "")
    .trim()
    .toLowerCase() === "true";

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
  const [hasSentResetEmail, setHasSentResetEmail] = useState(false);
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
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      await credential.user.reload();

      if (
        !SKIP_EMAIL_VERIFICATION_FOR_TESTING &&
        !credential.user.emailVerified
      ) {
        await signOut(auth);
        Alert.alert(
          "Email not verified",
          "Please open the verification link we sent to your email before signing in.",
          [
            {
              text: "Resend email",
              onPress: async () => {
                try {
                  const resendCredential = await signInWithEmailAndPassword(
                    auth,
                    normalizedEmail,
                    password
                  );
                  await sendEmailVerification(resendCredential.user);
                  await signOut(auth);
                  Alert.alert(
                    "Verification email sent",
                    "Check your inbox and open the link before signing in."
                  );
                } catch {
                  await signOut(auth).catch(() => undefined);
                  Alert.alert(
                    "Resend failed",
                    "Unable to resend the verification email right now. Please try again."
                  );
                }
              },
            },
            { text: "OK", style: "cancel" },
          ]
        );
      }
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
      setHasSentResetEmail(true);
      Alert.alert(
        "Reset email sent",
        "Check your email and open the password reset link to choose a new password."
      );
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

  const handleToggleForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setHasSentResetEmail(false);
    setPassword("");
  };

  const handleBackToSignIn = () => {
    setIsForgotPasswordMode(false);
    setHasSentResetEmail(false);
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
            {hasSentResetEmail ? (
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
            hasSentResetEmail ? (
              <>
                <HelperText>
                  Check your email and open the password reset link we sent to
                  choose a new password.
                </HelperText>

                <InlineRow>
                  <InlineText>Didn&apos;t get the email? </InlineText>
                  <TextButton
                    activeOpacity={0.8}
                    onPress={handlePasswordReset}
                    disabled={isSubmitting}
                  >
                    <InlineLink>Re-send now</InlineLink>
                  </TextButton>
                </InlineRow>
              </>
            ) : (
              <HelperText>
                Enter a valid email address associated with your account to
                receive a password reset link.
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
                isForgotPasswordMode ? handlePasswordReset : handleSignIn
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <SubmitLabel>
                  {isForgotPasswordMode
                    ? hasSentResetEmail
                      ? "Send Again"
                      : "Send Reset Link"
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
