import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Signin from "./pages/Signin";
import Signup from "./pages/SignupPage";
import ChatPage from "./pages/Chat";  
import HomePage from "./pages/HomePage";



function App() {
const user = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token") || "";

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
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
