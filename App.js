import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { AlbumScreen } from "./src/features/podcasts/screens/podcasts.screen";

export default function App() {
  return (
    <>
      <AlbumScreen />
      <ExpoStatusBar style="auto" />
    </>
  );
}
