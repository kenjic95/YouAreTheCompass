import React, { useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <ProfileSection>
          <ProfileLeft>
            <AvatarCircle>
              {displayProfile.photoURL && !hasAvatarError ? (
                <Image
                  source={{ uri: displayProfile.photoURL }}
                  onError={() => setHasAvatarError(true)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                  }}
                />
              ) : (
                <Feather name="user" size={30} color="#8d8d8d" />
              )}
            </AvatarCircle>

            <UserInfo>
              <UserName>{displayProfile.name}</UserName>
              <UserEmail>{displayProfile.email}</UserEmail>
            </UserInfo>
          </ProfileLeft>

          {isPremium ? (
            <PremiumBadge>
              <MaterialCommunityIcons name="crown" size={18} color="#FFD700" />
              <PremiumBadgeText>Premium User</PremiumBadgeText>
            </PremiumBadge>
          ) : (
            <PremiumButton onPress={() => navigation.navigate("Premium")}>
              <PremiumButtonText>Upgrade to{"\n"}Premium</PremiumButtonText>
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
  );
}
