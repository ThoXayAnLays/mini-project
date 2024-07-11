import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "./providers/AuthProvider";
import Routes from "./routes/routes";

function App() {
  return (
    <AuthProvider>
      <Routes />
      <ToastContainer/>
    </AuthProvider>
  );
}

export default App;
