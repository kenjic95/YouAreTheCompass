import React, { useEffect, useMemo, useState } from "react";
import { Searchbar } from "react-native-paper";
import { FlatList, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { AlbumInfoCard } from "../components/album-info-card.components";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";

const YOUTUBE_API_KEY = Constants.expoConfig?.extra?.youtubeApiKey || "";
const YOUTUBE_CHANNEL_ID = Constants.expoConfig?.extra?.youtubeChannelId || "";

const SearchContainer = styled.View`
  padding-top: ${(props) => props.theme.space[2]};
  padding-bottom: ${(props) => props.theme.space[2]};
  padding-right: ${(props) => props.theme.space[3]};
  padding-left: ${(props) => props.theme.space[3]};
`;

const AlbumList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const mapVideoToAlbum = (video) => {
  const thumbnails = video.snippet?.thumbnails || {};
  const bestThumb =
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    "";

  return {
    albumName: video.snippet?.title || "Untitled",
    description: video.snippet?.description || "",
    photos: bestThumb ? [bestThumb] : undefined,
    premiumIcon: true,
    id: video.id?.videoId || video.id,
  };
};

export const AlbumScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      try {
        if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
          throw new Error("Missing YouTube API config.");
        }

        const url =
          "https://www.googleapis.com/youtube/v3/search" +
          `?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}` +
          "&maxResults=20&order=date&type=video" +
          `&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(url);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.error?.message || "Failed to fetch videos.");
        }

        setAlbums((json.items || []).map(mapVideoToAlbum));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const listData = useMemo(() => albums, [albums]);

  return (
    <SafeAreaProvider>
      <SafeArea>
        <SearchContainer>
          <Searchbar />
        </SearchContainer>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <AlbumList
            data={listData}
            renderItem={({ item }) => (
              <Spacer position="bottom" size="large">
                <AlbumInfoCard album={item} />
              </Spacer>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
        {error ? (
          <Spacer position="top" size="large">
            <AlbumInfoCard
              album={{
                albumName: "sample",
                description: error,
                premiumIcon: true,
              }}
            />
          </Spacer>
        ) : null}
      </SafeArea>
    </SafeAreaProvider>
  );
};
