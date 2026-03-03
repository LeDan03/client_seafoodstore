import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.jsx";
import "./App.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;