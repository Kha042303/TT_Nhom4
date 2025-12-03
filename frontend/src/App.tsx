import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Signin from "./pages/Signin";
import Signup from "./pages/SignupPage";
import Sidebar from "./pages/sidebar";
import ChatPage from "./pages/Chat";  

function App() {
const user = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token") || "";

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Sidebar />} />
          <Route
            path="/chat"
            element={<ChatPage user={user} token={token} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
