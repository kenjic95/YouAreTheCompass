import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || {};

const YOUTUBE_API_KEY = extra.youtubeApiKey || "";
const YOUTUBE_CHANNEL_ID = extra.youtubeChannelId || "";

const getVideoId = (video) => {
  if (video.id?.videoId) {
    return video.id.videoId;
  }
  if (typeof video.id === "string") {
    return video.id;
  }
  if (video.id?.kind === "youtube#video" && video.id?.videoId) {
    return video.id.videoId;
  }
  return "";
};

const mapVideoToAlbum = (video) => {
  const thumbnails = video.snippet?.thumbnails || {};
  const bestThumb =
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    "";

  return {
    albumName: video.snippet?.title || "Untitled",
    description: video.snippet?.description || "",
    photos: bestThumb ? [bestThumb] : undefined,
    premiumIcon: false,
    id: getVideoId(video),
  };
};

const createYouTubeSearchUrl = (apiKey, channelId) =>
  "https://www.googleapis.com/youtube/v3/search" +
  `?part=snippet&channelId=${channelId}` +
  "&maxResults=20&order=date&type=video" +
  `&key=${apiKey}`;

export const fetchPodcastAlbums = async () => {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    throw new Error("Missing YouTube API config.");
  }

  const response = await fetch(
    createYouTubeSearchUrl(YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID)
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.error?.message || "Failed to fetch videos.");
  }

  return (json.items || []).map(mapVideoToAlbum).filter((album) => album.id);
};

export const filterAlbumsByKeyword = (albums, keyword) => {
  const term = keyword.trim().toLowerCase();
  if (!term) {
    return albums;
  }

  return albums.filter((album) =>
    (album.albumName || "").toLowerCase().includes(term)
  );
};
