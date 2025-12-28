import React from "react";
import styled from "styled-components/native";
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const AlbumCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

const AlbumCardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[3]};
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

const Title = styled(Text)`
  font-family: ${(props) => props.theme.fonts.body};
  padding: ${(props) => props.theme.space[3]};
  color: ${(props) => props.theme.colors.ui.primary};
  fontweights: ${(props) => props.theme.colors.ui.bold};
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
