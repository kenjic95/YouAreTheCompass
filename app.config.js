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
      firebaseApiKey: process.env.FIREBASE_API_KEY || "",
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      firebaseAppId: process.env.FIREBASE_APP_ID || "",
    },
  };
};
