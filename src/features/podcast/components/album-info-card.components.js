import React from "react";
import { Text } from "../../../components/typography/text.component";
import { SvgXml } from "react-native-svg";
import { Spacer } from "../../../components/spacer/spacer.component";
import lock from "../../../../assets/lock";
import {
  AlbumCard,
  AlbumCardCover,
  CoverContainer,
  LockIcon,
  Info,
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
    <AlbumCard elevation={5}>
      <CoverContainer>
        <AlbumCardCover key={albumName} source={{ uri: photos[0] }} />
        {premiumIcon ? (
          <LockIcon>
            <Spacer position="top" size="medium">
              <SvgXml xml={lock} width={35} height={35} />
            </Spacer>
          </LockIcon>
        ) : null}
      </CoverContainer>

      <Info>
        <Text variant="label">{albumName}</Text>
        <Description>{description}</Description>
      </Info>
    </AlbumCard>
  );
};
