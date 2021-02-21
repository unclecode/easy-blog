import { Toaster } from "react-hot-toast";
import Metatags from "../components/Metatags";
import Navbar from "../components/Navbar";
import { UserContext } from "../libs/context";
import { useUserData } from "../libs/hooks";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const userData = useUserData();

    return (
        <>
            <UserContext.Provider value={userData}>
                <Metatags/>
                <Navbar />
                <Component {...pageProps} />
                <Toaster />
            </UserContext.Provider>
        </>
    );
}

export default MyApp;
