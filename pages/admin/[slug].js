import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce, useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
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

    const [post] = useDocumentData(postRef);
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
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, errors, formState } = useForm(
        {
            defaultValues,
            mode: "onChange",
        }
    );

    const { isDirty, isValid } = formState;

    const updatePost = async ({ content, published }) => {
        await postRef.update({
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
                <ImageUploader />
                <textarea
                    name="content"
                    ref={register({
                        maxLength: {
                            value: 20000,
                            message: "content is too long",
                        },
                        minLength: {
                            value: 10,
                            message: "content is too short",
                        },
                        required: {
                            value: true,
                            message: "content is required",
                        },
                    })}
                ></textarea>
                {errors.content && (
                    <p className="text-danger">{errors.content.message}</p>
                )}
                <fieldset>
                    <input
                        type="checkbox"
                        name="published"
                        ref={register}
                        className={styles.checkbox}
                    />
                    <label htmlFor="published">Published</label>
                </fieldset>
                
                <button disabled={!isValid || !isDirty} className="btn-green">
                    Save changes
                </button>
            </div>
        </form>
    );
}
