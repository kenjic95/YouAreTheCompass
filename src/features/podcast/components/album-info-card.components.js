import React from "react";
import { Text } from "../../../components/typography/text.component";
import { SvgXml } from "react-native-svg";
import lock from "../../../../assets/lock";
import {
  AlbumCard,
  AlbumCardCover,
  CoverContainer,
  PremiumBadge,
  PremiumText,
  Info,
  Title,
  Description,
} from "./album-info-card.styles";

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
    <AlbumCard elevation={4}>
      <CoverContainer>
        <AlbumCardCover key={albumName} source={{ uri: photos[0] }} />
        {premiumIcon ? (
          <PremiumBadge>
            <SvgXml xml={lock} width={14} height={14} />
            <PremiumText>Premium</PremiumText>
          </PremiumBadge>
        ) : null}
      </CoverContainer>

      <Info>
        <Title numberOfLines={2}>{albumName}</Title>
        <Description numberOfLines={2}>{description}</Description>
      </Info>
    </AlbumCard>
  );
};
