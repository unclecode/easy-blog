import Head from "next/head";
import toast from "react-hot-toast";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h2>Hello</h2>
                <button onClick={() => toast.success("hello!")}>Toast me</button>
            </div>
        </div>
    );
}
