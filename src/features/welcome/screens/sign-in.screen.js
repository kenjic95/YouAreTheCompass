import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const logoImage = require("../../../../assets/logo.jpeg");

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 28px 48px;
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
  margin-bottom: 54px;
`;

const FieldGroup = styled.View`
  margin-bottom: 22px;
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

const SubmitButton = styled.TouchableOpacity`
  background-color: #5ea8e7;
  border-radius: 999px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  margin: 24px 70px 14px;
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

export const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Screen edges={["top", "right", "bottom", "left"]}>
      <Content>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={34} color="#7a7a7a" />
        </BackButton>

        <Logo source={logoImage} />
        <Title>Sign In</Title>

        <FieldGroup>
          <Label>Email</Label>
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

        <SubmitButton activeOpacity={0.9}>
          <SubmitLabel>Sign In</SubmitLabel>
        </SubmitButton>

        <ForgotPassword>Forgot Password?</ForgotPassword>
      </Content>
    </Screen>
  );
};
