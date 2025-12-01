import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Signin from "./pages/Signin";
import Signup from "./pages/SignupPage";
import Sidebar from "./pages/sidebar";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<Signin/>}
          />
          <Route
            path="/signup"
            element={<Signup/>}
          />
          <Route
            path="/"
            element={<Sidebar />}
          />

         
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;