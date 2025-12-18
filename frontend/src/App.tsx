// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Signin from "./pages/Signin";
import HomePage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import SellBook from "./pages/SellBook";
import About from "./pages/About";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/logout"
              element={
                <RequireAuth>
                  <Logout />
                </RequireAuth>
              }
            />

            <Route path="*" element={<HomePage />} />
            <Route path="/sell" element={<SellBook />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
