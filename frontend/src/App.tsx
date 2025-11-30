import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Signin from "./pages/Signin";
import Signup from "./pages/SignupPage";

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

         
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;