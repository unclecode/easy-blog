import {
    firestore,
    getUserWithUsername,
    postToJSON,
} from "../../libs/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import Metatags from "../../components/Metatags";
import { useContext } from "react";
import { UserContext } from "../../libs/context";
import Link from "next/link";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    let post, path;
    if (userDoc) {
        const postRef = firestore.doc(`users/${userDoc.id}/posts/${slug}`);
        // const postRef = userDoc.ref.collection('posts').doc(slug);
        post = await postRef.get();
        post = postToJSON(post);
        path = postRef.path;
    }

    return {
        props: {
            post,
            path,
        },
        revalidate: 5000,
    };
}

export async function getStaticPaths() {
    const snapshot = await firestore.collectionGroup("posts").get();
    const paths = snapshot.docs
        .filter((d) => Boolean(d.data().username))
        .map((doc) => {
            const { slug, username } = doc.data();
            return {
                params: { username: username.toString(), slug },
            };
        });
    return {
        paths,
        fallback: "blocking",
    };
}

export default function UserPostPage(props) {
    const { post, path } = props;
    const postRef = firestore.doc(path);
    const [realtimePost] = useDocumentData(postRef);

    // debugger;
    // first time post is genereated in server and may not have anything for realtimePost
    const readyPost = realtimePost || post;

    const { user: currentUser } = useContext(UserContext);

    return (
        <main className="container">
            <Metatags title={readyPost.title} description={readyPost.title} />
            <section>
                <PostContent post={readyPost} />
            </section>

            <aside className="card">
                <p>
                    <strong>{readyPost.heartCount || 0} ❤️</strong>
                </p>

                <AuthCheck
                    fallback={
                        <Link href="/enter">
                            <button>💗 Sign Up</button>
                        </Link>
                    }
                >
                    <HeartButton postRef={postRef} />
                </AuthCheck>
                {currentUser?.uid === post.uid && (
                    <Link href={`/admin/${post.slug}`}>
                        <button className="btn-blue">Edit Post</button>
                    </Link>
                )}
            </aside>
        </main>
    );
}
