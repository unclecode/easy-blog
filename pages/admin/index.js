import kebabCase from "lodash.kebabcase";
import { useContext, useState, user } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../libs/context";
import { useRouter } from 'next/router';

import {
    auth,
    firestore,
    postToJSON,
    serverTimestamp,
} from "../../libs/firebase";
import styles from "../../styles/Admin.module.css";

export default function AdminPostsPages({}) {
    return (
        <main>
            <AuthCheck>
                <CreateNewPost />
                <PostList />
            </AuthCheck>
        </main>
    );
}

function PostList() {
    const query = firestore
        .doc(`users/${auth.currentUser.uid}`)
        .collection("posts")
        .orderBy("createdAt", "desc");
    
    const [querySnapshot] = useCollection(query);

    // const posts = querySnapshot?.docs.map((d) => postToJSON(d));
    const posts = querySnapshot?.docs.map((d) => d.data());

    return (
        <>
            <h2>Manage your Posts</h2>
            <PostFeed posts={posts} />
        </>
    );
}

function CreateNewPost() {
    const {username} = useContext(UserContext);
    const [title, setTitle] = useState("");
    const router = useRouter();

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = (e) => {
        e.preventDefault();
        
        const ref = firestore.doc(
            `users/${auth.currentUser.uid}/posts/${slug}`
        );
        const newPost = {
            title,
            slug,
            uid: auth.currentUser.uid,
            username: username,
            published: false,
            content: "# Hello World",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };
        console.log(newPost);
        ref.set(newPost)

        toast.success("Post Created");

        router.push(`/admin/${slug}`);
    };
    return (
        <form onSubmit={createPost}>
            <h1>Create New Post</h1>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Awesome title"
                className={styles.input}
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" className="btn-green" disabled={!isValid}>
                Create New Post
            </button>
        </form>
    );
}
