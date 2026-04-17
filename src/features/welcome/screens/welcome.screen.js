import React from "react";
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
  padding: 32px 28px 40px;
  align-items: center;
  justify-content: space-between;
`;

const TopSection = styled.View`
  width: 100%;
  align-items: center;
  padding-top: 40px;
`;

const WelcomeText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 28px;
  color: #111111;
  letter-spacing: 1px;
  margin-bottom: 36px;
`;

const Logo = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 100%;
  max-width: 320px;
  height: 320px;
`;

const BottomSection = styled.View`
  width: 100%;
  gap: 22px;
  padding-bottom: 36px;
`;

const ActionButton = styled.TouchableOpacity`
  width: 100%;
  background-color: #98cff8;
  border-radius: 999px;
  flex-direction: row;
  align-items: center;
  padding: 10px 18px;
  shadow-color: #000000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.18;
  shadow-radius: 8px;
  elevation: 6;
`;

const IconCircle = styled.View`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: rgba(255, 255, 255, 0.25);
  border-width: 2px;
  border-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

const ButtonLabel = styled.Text`
  flex: 1;
  text-align: center;
  margin-right: 42px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 18px;
  color: #ffffff;
`;

const GuestLink = styled.TouchableOpacity`
  align-self: center;
  padding: 6px 12px;
`;

const GuestLinkText = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #4c86b8;
`;

export const WelcomeScreen = ({ navigation }) => {
  const goToCreateAccount = () => navigation.navigate("CreateAccount");
  const goToSignIn = () => navigation.navigate("SignIn");
  const goToHomeAsGuest = () => navigation.replace("GuestTabs");

  return (
    <Screen edges={["top", "right", "bottom", "left"]}>
      <Content>
        <TopSection>
          <WelcomeText>WELCOME TO</WelcomeText>
          <Logo source={logoImage} />
        </TopSection>

        <BottomSection>
          <ActionButton onPress={goToCreateAccount} activeOpacity={0.9}>
            <IconCircle>
              <Ionicons name="add" size={24} color="#ffffff" />
            </IconCircle>
            <ButtonLabel>Create account</ButtonLabel>
          </ActionButton>

          <ActionButton onPress={goToSignIn} activeOpacity={0.9}>
            <IconCircle>
              <Ionicons name="person-outline" size={22} color="#ffffff" />
            </IconCircle>
            <ButtonLabel>Sign in</ButtonLabel>
          </ActionButton>

          <GuestLink onPress={goToHomeAsGuest} activeOpacity={0.8}>
            <GuestLinkText>Continue as Guest</GuestLinkText>
          </GuestLink>
        </BottomSection>
      </Content>
    </Screen>
  );
};
