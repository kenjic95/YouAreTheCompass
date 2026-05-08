import React, { useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { TabHeader } from "../../../components/utility/tab-header.component";
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
  PremiumBadge,
  PremiumBadgeText,
  SectionTitle,
  MenuCard,
  MenuLeft,
  MenuText,
  LogoutText,
  BottomSpace,
} from "../components/settings.styles";
import { useUserProfile } from "../../../services/auth/user-profile.context";

const FALLBACK_NAME = "User Full Name";
const FALLBACK_EMAIL = "user@email.com";

const Screen = styled.View`
  flex: 1;
  background-color: #6da8d6;
`;

const AvatarImage = styled(Image)`
  width: 64px;
  height: 64px;
  border-radius: 32px;
`;

export default function SettingsScreen({ navigation }) {
  const { profile, isPremium } = useUserProfile();
  const [hasAvatarError, setHasAvatarError] = useState(false);

  const displayProfile = useMemo(() => {
    const fullName = [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      name: profile?.displayName?.trim() || fullName || FALLBACK_NAME,
      email: profile?.email?.trim() || FALLBACK_EMAIL,
      photoURL: profile?.photoURL?.trim() || "",
    };
  }, [profile]);

  useEffect(() => {
    setHasAvatarError(false);
  }, [displayProfile.photoURL]);

  return (
    <Screen>
      <TabHeader title="Settings" />
      <Container>
        <ScrollContainer showsVerticalScrollIndicator={false}>
          <ProfileSection>
            <ProfileLeft>
              <AvatarCircle>
                {displayProfile.photoURL && !hasAvatarError ? (
                  <AvatarImage
                    source={{ uri: displayProfile.photoURL }}
                    onError={() => setHasAvatarError(true)}
                  />
                ) : (
                  <Feather name="user" size={30} color="#8d8d8d" />
                )}
              </AvatarCircle>

              <UserInfo>
                <UserName numberOfLines={1} ellipsizeMode="tail">
                  {displayProfile.name}
                </UserName>
                <UserEmail numberOfLines={1} ellipsizeMode="tail">
                  {displayProfile.email}
                </UserEmail>
              </UserInfo>
            </ProfileLeft>

            {isPremium ? (
              <PremiumBadge>
                <MaterialCommunityIcons
                  name="crown"
                  size={18}
                  color="#FFD700"
                />
                <PremiumBadgeText>Premium User</PremiumBadgeText>
              </PremiumBadge>
            ) : (
              <PremiumButton onPress={() => navigation.navigate("Premium")}>
                <PremiumButtonText>Upgrade to Premium</PremiumButtonText>
              </PremiumButton>
            )}
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
    </Screen>
  );
}
