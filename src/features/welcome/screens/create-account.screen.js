import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const logoImage = require("../../../../assets/logo.jpeg");

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
  font-family: ${(props) => props.theme.fonts.body};
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
              <BirthInput>
                <BirthText>Day</BirthText>
                <Ionicons name="chevron-down" size={18} color="#b4bdc8" />
              </BirthInput>
            </BirthInputWrap>

            <BirthInputWrap>
              <BirthInput>
                <BirthText>Month</BirthText>
                <Ionicons name="chevron-down" size={18} color="#b4bdc8" />
              </BirthInput>
            </BirthInputWrap>

            <BirthInputWrap flexValue={1.3}>
              <BirthInput>
                <BirthText>Year</BirthText>
              </BirthInput>
            </BirthInputWrap>
          </BirthRow>
        </FieldGroup>

        <SubmitButton activeOpacity={0.9}>
          <SubmitLabel>Create an Account</SubmitLabel>
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
