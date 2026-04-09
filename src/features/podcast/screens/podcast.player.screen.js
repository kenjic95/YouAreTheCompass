import React, { useMemo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { WebView } from "react-native-webview";

import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "../../../components/typography/text.component";

const PlayerContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.space[3]};
`;

const Title = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-family: ${(props) => props.theme.fonts.heading};
`;

const Subtitle = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.body};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const BackButton = styled(TouchableOpacity)`
  padding: ${(props) => props.theme.space[2]};
`;

const ControlText = styled(Text)`
  color: ${(props) => props.theme.colors.brand.primary};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;

const VideoWrapper = styled.View`
  flex: 1;
  width: 100%;
  min-height: 260px;
  background-color: black;
`;

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match?.[1] || null;
};

export const PodcastPlayerScreen = ({ route, navigation }) => {
  const podcast = route.params?.podcast;
  const videoId = useMemo(
    () => getYouTubeId(podcast?.sourceUrl),
    [podcast?.sourceUrl]
  );

  const renderVideo = () => {
    if (videoId) {
      const html = `<!DOCTYPE html><html><head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"><style>body{margin:0;background:#000;}iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;}</style></head><body><iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen></iframe></body></html>`;
      return (
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          style={{ flex: 1, backgroundColor: "black" }}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState
        />
      );
    }

    if (podcast?.sourceUrl) {
      const html = `<!DOCTYPE html><html><head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"><style>body{margin:0;background:#000;}iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;}</style></head><body><iframe src="${podcast.sourceUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe></body></html>`;
      return (
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          style={{ flex: 1, backgroundColor: "black" }}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState
        />
      );
    }

    return (
      <View style={styles.fallbackContainer}>
        <Text>Unable to play this podcast.</Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <PlayerContainer>
        <Header>
          <View>
            <Title>{podcast?.albumName || "Podcast"}</Title>
            <Subtitle>{podcast?.description || ""}</Subtitle>
          </View>
          <BackButton onPress={() => navigation.goBack()}>
            <ControlText>Back</ControlText>
          </BackButton>
        </Header>

        <VideoWrapper>{renderVideo()}</VideoWrapper>

        <Spacer position="top" size="large">
          <Text variant="caption">
            {podcast?.premium
              ? "Premium content – playable in-app."
              : "Free content – playable in-app."}
          </Text>
        </Spacer>
      </PlayerContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
