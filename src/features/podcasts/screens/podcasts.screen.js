import React from "react";
import { Searchbar } from "react-native-paper";
import { StatusBar, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { AlbumInfoCard } from "../components/album-info-card.components";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  ${StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`};
`;

const SearchContainer = styled.View`
  padding: 16px;
`;

const AlbumListContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: blue;
`;

export const PodcastScreen = () => (
  <SafeArea>
    <SearchContainer>
      <Searchbar />
    </SearchContainer>
    <AlbumListContainer>
      <AlbumInfoCard />
    </AlbumListContainer>
  </SafeArea>
);

/*
export const AlbumScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.search}>
      <Searchbar />
    </View>
    <View style={styles.list}>
      <AlbumInfoCard />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },
  search: {
    padding: 10,
  },
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "blue",
  },
}); 
*/
