import React, { useEffect } from "react";
import { Linking, Alert } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";

const PlayerContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.bg.primary};
  justify-content: center;
  align-items: center;
`;

const VideoTitle = styled(Text).attrs({
  variant: "label",
})`
  font-size: ${(props) => props.theme.fontSizes.title};
  text-align: center;
  padding: ${(props) => props.theme.space[3]};
`;

const VideoDescription = styled(Text).attrs({
  variant: "body",
})`
  font-size: ${(props) => props.theme.fontSizes.body};
  text-align: center;
  padding-horizontal: ${(props) => props.theme.space[3]};
  padding-bottom: ${(props) => props.theme.space[3]};
`;

const OpenButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.ui.primary};
  padding: ${(props) => props.theme.space[3]};
  border-radius: 8px;
  margin: ${(props) => props.theme.space[3]};
`;

const OpenButtonText = styled(Text).attrs({
  variant: "label",
})`
  color: ${(props) => props.theme.colors.text.inverse};
  font-size: ${(props) => props.theme.fontSizes.body};
`;

export const PodcastPlayerScreen = ({ route, navigation }) => {
  const { videoId, title, description } = route.params || {};

  useEffect(() => {
    if (videoId) {
      openYouTubeVideo();
    }
  }, [videoId]);

  const openYouTubeVideo = async () => {
    if (!videoId) {
      Alert.alert("Error", "No video ID available");
      return;
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const supported = await Linking.canOpenURL(youtubeUrl);
      if (supported) {
        await Linking.openURL(youtubeUrl);
        // Navigate back after opening YouTube
        navigation.goBack();
      } else {
        Alert.alert("Error", "Cannot open YouTube URL");
      }
    } catch (error) {
      console.error("Error opening YouTube:", error);
      Alert.alert("Error", "Failed to open YouTube video");
    }
  };

  if (!videoId) {
    return (
      <SafeArea>
        <PlayerContainer>
          <Text variant="label">No video selected</Text>
        </PlayerContainer>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <PlayerContainer>
        <VideoTitle>{title || "YouTube Video"}</VideoTitle>
        {description && (
          <VideoDescription>{description}</VideoDescription>
        )}
        <OpenButton onPress={openYouTubeVideo}>
          <OpenButtonText>Open in YouTube</OpenButtonText>
        </OpenButton>
      </PlayerContainer>
    </SafeArea>
  );
};;
