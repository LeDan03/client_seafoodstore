import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 w-full rounded-2xl relative">
            <Header />

            <main className="flex-1 m-6 rounded-2xl">
                <div className="rounded-2xl">
                    <Outlet />
                </div>
            </main>

            <Footer />

            {/* Zalo Floating Button */}
            <a
                href="https://zalo.me/0869518622"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-300 float-shadow-lg animate-bounce     "
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                    alt="Zalo"
                    className="w-14 h-14 drop-shadow-lg"
                />
            </a>
        </div>
    );
}

export default MainLayout;