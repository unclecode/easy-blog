import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { UserContext } from "../libs/context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <UserContext.Provider value={{ user: {}, username: "Tom" }}>
                <Navbar />
                <Component {...pageProps} />
                <Toaster />
            </UserContext.Provider>
        </>
    );
}

export default MyApp;
