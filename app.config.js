const { config } = require("dotenv");

config();

const appJson = require("./app.json");

module.exports = () => {
  const expoConfig = appJson.expo || {};

  return {
    ...expoConfig,
    extra: {
      ...(expoConfig.extra || {}),
      youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
      youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || "",
    },
  };
};
