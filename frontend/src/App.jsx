import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CalendarPage from "./pages/CalendarPage";
import DetailsPage from "./pages/DetailsPage";
import ExplorePage from "./pages/ExplorePage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  useEffect(() => {
    console.log(
      "%cHackHunt says hi.",
      "background:#111111;color:#fbf4e8;padding:8px 12px;font-weight:700;font-family:'Space Grotesk',sans-serif;"
    );
    console.log(
      "%cIf you're in devtools, you're our kind of person. Now please don't submit your project at 11:59 PM.",
      "color:#111111;font-family:'IBM Plex Mono',monospace;font-size:12px;"
    );
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/details/:slug" element={<DetailsPage />} />
      <Route path="/details" element={<DetailsPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
