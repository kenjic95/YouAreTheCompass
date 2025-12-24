import React from "react";
import styled from "styled-components/native";
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const AlbumCard = styled(Card)`
  background-color: white;
`;

const AlbumCardCover = styled(Card.Cover)`
  padding: 16px;
  background-color: white;
`;

const Title = styled(Text)`
  padding: 16px;
  color: black;
  font-weight: bold;
`;

export const AlbumInfoCard = ({ album = {} }) => {
  const {
    albumName = "Album 1",
    premiumIcon = true,
    description = "Short Description about this album",
    photos = [
      "https://marketplace.canva.com/EAFDFX9GQ4k/2/0/1600w/canva-black-blue-pink-retro-neon-podcast-cover-Z8Lbz7K3t9s.jpg",
    ],
  } = album;

  return (
    <AlbumCard elevation={5}>
      <AlbumCardCover key={albumName} source={{ uri: photos[0] }} />
      <Title>{albumName}</Title>
      <Title>{description}</Title>
    </AlbumCard>
  );
};

/*
const Title = styled.Text`
  padding: 16px;
  color: red;
  fontweight: bold;
`;

export const AlbumInfoCard = ({ album = {} }) => {
  const {
    albumName = "Album 1",
    premiumIcon = true,
    description = "Short Description about this album",
    photos = [
      "https://marketplace.canva.com/EAFDFX9GQ4k/2/0/1600w/canva-black-blue-pink-retro-neon-podcast-cover-Z8Lbz7K3t9s.jpg",
    ],
  } = album;

  return (
    <Card elevation={5} style={styles.card}>
      <Card.Cover
        key={albumName}
        style={styles.cover}
        source={{ uri: photos[0] }}
      />
      <Text style={styles.title}>{albumName}</Text>
      <Text style={styles.description}>{description}</Text>
      <Title>{albumName}</Title>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "white" },
  cover: { padding: 20, backgroundColor: "white" },
  title: { paddingLeft: 16, fontWeight: "bold" },
  description: { paddingLeft: 16, paddingBottom: 16 },
});

*/
