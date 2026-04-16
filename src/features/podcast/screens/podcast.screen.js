import React, { useEffect, useMemo, useState } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Search } from "../components/search.component";
import { AlbumInfoCard } from "../components/album-info-card.components";
import {
  fetchPodcastAlbums,
  filterAlbumsByKeyword,
} from "../services/podcast.service";

const AlbumList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

export const AlbumScreen = () => {
  const navigation = useNavigation();
  const [albums, setAlbums] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setAlbums(await fetchPodcastAlbums());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const listData = useMemo(() => {
    return filterAlbumsByKeyword(albums, keyword);
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
