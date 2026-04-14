import React, { useEffect, useMemo, useState } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { Search } from "../components/search.component";
import { AlbumInfoCard } from "../components/album-info-card.components";

const YOUTUBE_API_KEY = Constants.expoConfig?.extra?.youtubeApiKey || "";
const YOUTUBE_CHANNEL_ID = Constants.expoConfig?.extra?.youtubeChannelId || "";

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

  // Extract video ID - handle different response structures
  let videoId = "";
  if (video.id?.videoId) {
    videoId = video.id.videoId;
  } else if (typeof video.id === "string") {
    videoId = video.id;
  } else if (video.id?.kind === "youtube#video" && video.id?.videoId) {
    videoId = video.id.videoId;
  }

  return {
    albumName: video.snippet?.title || "Untitled",
    description: video.snippet?.description || "",
    photos: bestThumb ? [bestThumb] : undefined,
    premiumIcon: false,
    id: videoId,
  };
};

export const AlbumScreen = () => {
  const navigation = useNavigation();
  const [albums, setAlbums] = useState([]);
  const [keyword, setKeyword] = useState("");
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

  const listData = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) {
      return albums;
    }

    return albums.filter((album) =>
      (album.albumName || "").toLowerCase().includes(term)
    );
  }, [albums, keyword]);

  return (
    <SafeAreaProvider>
      <SafeArea>
        <Search keyword={keyword} onChangeKeyword={setKeyword} />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <AlbumList
            data={listData}
            renderItem={({ item }) => (
              <Spacer position="bottom" size="large">
                <AlbumInfoCard
                  album={item}
                  onPress={() =>
                    navigation.navigate("PodcastPlayer", {
                      videoId: item.id,
                      title: item.albumName,
                      description: item.description,
                    })
                  }
                />
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
