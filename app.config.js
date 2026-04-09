const { config } = require("dotenv");

config();

const appJson = require("./app.json");

module.exports = () => {
  const expoConfig = appJson.expo || {};

  return {
    ...expoConfig,
    extra: {
      ...(expoConfig.extra || {}),
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || expoConfig.extra?.YOUTUBE_API_KEY || expoConfig.extra?.youtubeApiKey || "",
      YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || expoConfig.extra?.YOUTUBE_CHANNEL_ID || expoConfig.extra?.youtubeChannelId || "",
      youtubeApiKey: process.env.YOUTUBE_API_KEY || expoConfig.extra?.YOUTUBE_API_KEY || expoConfig.extra?.youtubeApiKey || "",
      youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || expoConfig.extra?.YOUTUBE_CHANNEL_ID || expoConfig.extra?.youtubeChannelId || "",
    },
  };
};
