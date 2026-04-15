import React, { useEffect, useState } from "react";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";

import {
  Container,
  ScrollContainer,
  ProfileSection,
  ProfileLeft,
  AvatarCircle,
  UserInfo,
  UserName,
  UserEmail,
  PremiumButton,
  PremiumButtonText,
  SectionTitle,
  MenuCard,
  MenuLeft,
  MenuText,
  LogoutText,
  BottomSpace,
} from "../components/settings.styles";
import { auth, isFirebaseConfigured } from "../../../services/auth/firebase";

const FALLBACK_NAME = "User Full Name";
const FALLBACK_EMAIL = "user@email.com";

const getDisplayProfile = (user) => {
  if (!user) {
    return {
      name: FALLBACK_NAME,
      email: FALLBACK_EMAIL,
    };
  }

  return {
    name: user.displayName?.trim() || FALLBACK_NAME,
    email: user.email?.trim() || FALLBACK_EMAIL,
  };
};

export default function SettingsScreen({ navigation }) {
  const [profile, setProfile] = useState(() =>
    getDisplayProfile(auth?.currentUser || null)
  );

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setProfile(getDisplayProfile(null));
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setProfile(getDisplayProfile(user));
    });

    return unsubscribe;
  }, []);

  return (
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <ProfileSection>
          <ProfileLeft>
            <AvatarCircle>
              <Feather name="user" size={30} color="#8d8d8d" />
            </AvatarCircle>

            <UserInfo>
              <UserName>{profile.name}</UserName>
              <UserEmail>{profile.email}</UserEmail>
            </UserInfo>
          </ProfileLeft>

          <PremiumButton onPress={() => navigation.navigate("Premium")}>
            <PremiumButtonText>Upgrade to{"\n"}Premium</PremiumButtonText>
          </PremiumButton>
        </ProfileSection>

        <SectionTitle>General</SectionTitle>

        <MenuCard onPress={() => navigation.navigate("Account")}>
          <MenuLeft>
            <Feather name="user" size={24} color="#222" />
            <MenuText>Account</MenuText>
          </MenuLeft>
          <Feather name="chevron-right" size={24} color="#222" />
        </MenuCard>

        <MenuCard onPress={() => navigation.navigate("SettingsDetail")}>
          <MenuLeft>
            <Ionicons name="settings-outline" size={24} color="#222" />
            <MenuText>Settings</MenuText>
          </MenuLeft>
          <Feather name="chevron-right" size={24} color="#222" />
        </MenuCard>

        <MenuCard onPress={() => navigation.navigate("About")}>
          <MenuLeft>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#222"
            />
            <MenuText>About</MenuText>
          </MenuLeft>
          <Feather name="chevron-right" size={24} color="#222" />
        </MenuCard>

        <MenuCard onPress={() => navigation.navigate("HelpSupport")}>
          <MenuLeft>
            <Ionicons name="help-circle-outline" size={24} color="#222" />
            <MenuText>Help & Support</MenuText>
          </MenuLeft>
          <Feather name="chevron-right" size={24} color="#222" />
        </MenuCard>

        <MenuCard onPress={() => navigation.navigate("Feedback")}>
          <MenuLeft>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={24}
              color="#222"
            />
            <MenuText>Feedback</MenuText>
          </MenuLeft>
          <Feather name="chevron-right" size={24} color="#222" />
        </MenuCard>

        <MenuCard onPress={() => navigation.navigate("Logout")}>
          <MenuLeft>
            <MaterialCommunityIcons name="logout" size={24} color="#222" />
            <LogoutText>Logout</LogoutText>
          </MenuLeft>
        </MenuCard>

        <BottomSpace />
      </ScrollContainer>
    </Container>
  );
}
