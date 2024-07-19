import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./providers/AuthProvider";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
