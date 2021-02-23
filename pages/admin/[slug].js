import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../libs/context";
import { auth, firestore, serverTimestamp } from "../../libs/firebase";
import styles from "../../styles/Admin.module.css";
export default function AdminPostEditPage({}) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);
    const router = useRouter();
    const slug = router.query;
    const postRef = firestore.doc(
        `users/${auth.currentUser.uid}/posts/${slug.slug}`
    );

    const [post] = useDocumentDataOnce(postRef);
    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>{post.slug}</p>

                        <PostForm
                            defaultValues={post}
                            preview={preview}
                            postRef={postRef}
                        />
                    </section>
                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? "Edit" : "Preview"}
                        </button>
                        <Link href={`/${post.username}/{post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues,
        mode: "onChange",
    });

    const updatePost = async ({ content, published }) => {
        await postRef.set({
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success("Post updated successfully!");
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch("content")}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <textarea name="content" ref={register}></textarea>

                <fieldset>
                    <input
                        type="checkbox"
                        name="published"
                        ref={register}
                        className={styles.checkbox}
                    />
                    <label htmlFor="published">Published</label>
                </fieldset>

                <button className="btn-green">Save changes</button>
            </div>
        </form>
    );
}
