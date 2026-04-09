import React, { useMemo, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Search } from "../components/search.component";
import { AlbumInfoCard } from "../components/album-info-card.components";

const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match?.[1] || null;
};

const getYoutubeThumbnail = (url) => {
  const videoId = getYoutubeId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "https://marketplace.canva.com/EAFDFX9GQ4k/2/0/1600w/canva-black-blue-pink-retro-neon-podcast-cover-Z8Lbz7K3t9s.jpg";
};

const mockPodcasts = [
  {
    id: "podcast-1",
    albumName: "Free Podcast: Compass Reflection",
    description: "A free episode for guided reflection.",
    photos: [getYoutubeThumbnail("https://www.youtube.com/watch?v=Dnx7rujVsIA")],
    premiumIcon: false,
    sourceType: "youtube",
    sourceUrl: "https://www.youtube.com/watch?v=Dnx7rujVsIA",
    premium: false,
  },
  {
    id: "podcast-2",
    albumName: "Free Podcast: Journey Voice",
    description: "A free episode for grounding and calm.",
    photos: [getYoutubeThumbnail("https://www.youtube.com/watch?v=YZx0-Urhr-Q")],
    premiumIcon: false,
    sourceType: "youtube",
    sourceUrl: "https://www.youtube.com/watch?v=YZx0-Urhr-Q",
    premium: false,
  },
  {
    id: "podcast-3",
    albumName: "Premium Podcast: Guided Compass",
    description: "Premium episode with deeper guidance.",
    photos: [getYoutubeThumbnail("https://www.youtube.com/watch?v=rHuQJCUDdRo")],
    premiumIcon: true,
    sourceType: "youtube",
    sourceUrl: "https://www.youtube.com/watch?v=rHuQJCUDdRo",
    premium: true,
  },
  {
    id: "podcast-4",
    albumName: "Premium Podcast: Inner Compass",
    description: "Premium episode for deeper insight.",
    photos: [getYoutubeThumbnail("https://www.youtube.com/watch?v=BQhYbjPWvgE")],
    premiumIcon: true,
    sourceType: "youtube",
    sourceUrl: "https://www.youtube.com/watch?v=BQhYbjPWvgE",
    premium: true,
  },
];

const AlbumList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const HeaderBar = styled.View`
  padding: 0 16px 16px;
`;

const HeaderText = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.title};
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.fonts.heading};
`;

const StatusPill = styled.View`
  margin: 0 16px 16px;
  padding: 12px 14px;
  background-color: ${(props) => props.theme.colors.bg.secondary};
  border-radius: 16px;
`;

const StatusText = styled.Text`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;

export const AlbumScreen = ({ navigation }) => {
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");

  const listData = useMemo(() => {
    const term = submittedKeyword.trim().toLowerCase();
    if (!term) {
      return mockPodcasts;
    }

    return mockPodcasts.filter((item) =>
      ((item.albumName || "") + " " + (item.description || ""))
        .toLowerCase()
        .includes(term)
    );
  }, [submittedKeyword]);

  return (
    <SafeAreaProvider>
      <SafeArea>
        <HeaderBar>
          <HeaderText>Podcast Videos</HeaderText>
        </HeaderBar>

        <Search
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSubmit={(value) => setSubmittedKeyword(value)}
        />

        <StatusPill>
          <StatusText>
            Tap a podcast card to play the video directly in the app.
          </StatusText>
        </StatusPill>

        <AlbumList
          data={listData}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("PodcastPlayer", { podcast: item })}
            >
              <Spacer position="bottom" size="large">
                <AlbumInfoCard album={item} />
              </Spacer>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeArea>
    </SafeAreaProvider>
  );
};
