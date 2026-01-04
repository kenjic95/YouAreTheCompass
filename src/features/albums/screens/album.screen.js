import React from "react";
import { Searchbar } from "react-native-paper";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { AlbumInfoCard } from "../components/album-info-card.components";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

export const AlbumScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <SearchContainer>
        <Searchbar />
      </SearchContainer>
      <AlbumList
        data={[
          { name: 1 },
          { name: 2 },
          { name: 3 },
          { name: 4 },
          { name: 5 },
          { name: 6 },
          { name: 7 },
          { name: 8 },
          { name: 9 },
          { name: 10 },
          { name: 11 },
          { name: 12 },
          { name: 13 },
          { name: 14 },
        ]}
        renderItem={() => (
          <Spacer position="bottom" size="large">
            <AlbumInfoCard />
          </Spacer>
        )}
        keyExtractor={(item) => item.name}
      />
    </SafeArea>
  </SafeAreaProvider>
);
