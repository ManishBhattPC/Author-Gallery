import React from "react";
import AppRoutes from "./AppRoutes.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { AudioProvider } from "./context/AudioContext.jsx";
import AudioPlayerBar from "./components/AudiobookComponents/AudioPlayerBar.jsx";
import NowPlayingDrawer from "./components/AudiobookComponents/NowPlayingDrawer.jsx";

const App = () => {
  return (
    <AudioProvider>
      <ScrollToTop />
      <AppRoutes />
      <AudioPlayerBar />
      <NowPlayingDrawer />
    </AudioProvider>
  );
};

export default App;