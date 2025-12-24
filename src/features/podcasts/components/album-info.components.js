import React from "react";
import { Text, StyleSheet } from "react-native-paper";
import { Card } from "react-native-paper";

export const AlbumInfo = ({ album = {} }) => {
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
      <Text style={styles.title}>{description}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "white" },
  cover: { padding: 20, backgroundColor: "white" },
});
