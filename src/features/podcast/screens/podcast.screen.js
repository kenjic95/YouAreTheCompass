import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AlbumInfoCard } from "../components/album-info-card.components";
import { getChannelVideos } from "../../../services/youtube";

const mockPodcasts = [
  {
    id: "podcast-1",
    albumName: "Podcast 1",
    description: "Sound healing",
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    ],
    premiumIcon: false,
    sourceUrl: "https://www.youtube.com/watch?v=Dnx7rujVsIA",
    premium: false,
  },
  {
    id: "podcast-2",
    albumName: "Podcast 2",
    description: "Sound healing",
    photos: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    ],
    premiumIcon: true,
    sourceUrl: "https://www.youtube.com/watch?v=YZx0-Urhr-Q",
    premium: true,
  },
];

const Screen = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.brand.primary};
`;

const PageContent = styled.View`
  flex: 1;
  padding: 32px 24px 0;
`;

const HeaderBar = styled.View`
  margin-bottom: 24px;
`;

const HeaderText = styled.Text`
  color: ${(props) => props.theme.colors.text.inverse};
  font-size: 36px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const SubtitleText = styled.Text`
  color: ${(props) => props.theme.colors.text.inverse};
  opacity: 0.8;
  font-size: ${(props) => props.theme.fontSizes.body};
  line-height: 24px;
`;

const AlbumList = styled(FlatList).attrs({
  contentContainerStyle: {
    paddingBottom: 40,
  },
  showsVerticalScrollIndicator: false,
})``;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.brand.primary};
`;

const ErrorText = styled.Text`
  color: ${(props) => props.theme.colors.text.inverse};
  font-size: ${(props) => props.theme.fontSizes.body};
  text-align: center;
  margin-top: 16px;
`;

const RetryButton = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.ui.secondary};
  border-radius: 8px;
`;

const RetryText = styled.Text`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.fontSizes.button};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export const AlbumScreen = ({ navigation }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const videos = await getChannelVideos();
      setPodcasts(videos);
    } catch (err) {
      setError(err.message || 'Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeArea>
          <LoadingContainer>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </LoadingContainer>
        </SafeArea>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <SafeArea>
          <LoadingContainer>
            <ErrorText>{error}</ErrorText>
            <RetryButton onPress={fetchPodcasts}>
              <RetryText>Retry</RetryText>
            </RetryButton>
          </LoadingContainer>
        </SafeArea>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeArea>
        <Screen>
          <PageContent>
            <HeaderBar>
              <HeaderText>Podcast</HeaderText>
            </HeaderBar>

            <AlbumList
              data={podcasts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("PodcastPlayer", { podcast: item })}
                >
                  <Spacer position="bottom" size="medium">
                    <AlbumInfoCard album={item} />
                  </Spacer>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </PageContent>
        </Screen>
      </SafeArea>
    </SafeAreaProvider>
  );
};
