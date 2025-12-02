import { Routes, Route } from "react-router";

// 1. Import your pages here
import { DestinationEntryPage } from "../pages/destination-entry/ui/DestinationEntryPage";
import { NavigationPage } from "../pages/navigation/ui/NavigationPage";

function App() {
  // The App component's main job is to define the global structure and routes.
  return (
    // 2. Use the <Routes> component to manage your pages
    <Routes>
      {/* 3. Define a route for the DestinationEntryPage */}
      <Route path="/" element={<DestinationEntryPage />} />

      <Route path="/navigate" element={<NavigationPage />} />

      {/* Example: A fallback route for 404 */}
      <Route path="*" element={<h1>404: Page Not Found</h1>} />

      {/* Add other pages/layouts here */}
    </Routes>
  );
}

export default App;
