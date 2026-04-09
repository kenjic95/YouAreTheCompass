import React from "react";
import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

const SearchContainer = styled.View`
  padding-top: ${(props) => props.theme.space[2]};
  padding-bottom: ${(props) => props.theme.space[2]};
  padding-right: ${(props) => props.theme.space[3]};
  padding-left: ${(props) => props.theme.space[3]};
`;

export const Search = ({ keyword, onChangeKeyword, onSubmit }) => {
  return (
    <SearchContainer>
      <Searchbar
        placeholder="Search for a podcast"
        style={styles.searchBar}
        inputStyle={styles.inputText}
        value={keyword}
        onSubmitEditing={() => {
          if (onSubmit) {
            onSubmit(keyword);
          }
        }}
        onChangeText={(text) => {
          onChangeKeyword(text);
        }}
      />
    </SearchContainer>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    height: 48,
    elevation: 0,
  },
  inputText: {
    fontSize: 15,
  },
});
