import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const YOUTUBE_API_KEY =
  process.env.YOUTUBE_API_KEY ||
  extra.YOUTUBE_API_KEY ||
  extra.youtubeApiKey;
const YOUTUBE_CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID ||
  extra.YOUTUBE_CHANNEL_ID ||
  extra.youtubeChannelId;

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const getConfigError = () => {
  if (!YOUTUBE_API_KEY) {
    return 'YouTube API key is missing. Check app.json extra or expo config.';
  }
  if (!YOUTUBE_CHANNEL_ID) {
    return 'YouTube channel ID is missing. Check app.json extra or expo config.';
  }
  return null;
};

export const getChannelVideos = async () => {
  const configError = getConfigError();
  if (configError) {
    console.error(configError, { extra });
    throw new Error(configError);
  }

  try {
    const channelUrl = `${YOUTUBE_API_BASE_URL}/channels?part=contentDetails&id=${encodeURIComponent(
      YOUTUBE_CHANNEL_ID
    )}&key=${encodeURIComponent(YOUTUBE_API_KEY)}`;

    const channelResponse = await fetch(channelUrl);

    if (!channelResponse.ok) {
      const errorBody = await channelResponse.text();
      throw new Error(`Failed to fetch channel information: ${channelResponse.status} ${channelResponse.statusText} ${errorBody}`);
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const videosUrl = `${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet&playlistId=${encodeURIComponent(
      uploadsPlaylistId
    )}&maxResults=50&key=${encodeURIComponent(YOUTUBE_API_KEY)}`;

    const videosResponse = await fetch(videosUrl);

    if (!videosResponse.ok) {
      const errorBody = await videosResponse.text();
      throw new Error(`Failed to fetch videos: ${videosResponse.status} ${videosResponse.statusText} ${errorBody}`);
    }

    const videosData = await videosResponse.json();

    // Transform the data to match our app's format
    const videos = videosData.items.map((item) => ({
      id: item.snippet.resourceId.videoId,
      albumName: item.snippet.title,
      description: item.snippet.description,
      photos: [item.snippet.thumbnails.high.url],
      premiumIcon: false, // You can modify this logic based on your premium content rules
      sourceType: 'youtube',
      sourceUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      premium: false,
      publishedAt: item.snippet.publishedAt,
    }));

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
};

export const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match?.[1] || null;
};

export const getYoutubeThumbnail = (url) => {
  const videoId = getYoutubeId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "https://marketplace.canva.com/EAFDFX9GQ4k/2/0/1600w/canva-black-blue-pink-retro-neon-podcast-cover-Z8Lbz7K3t9s.jpg";
};