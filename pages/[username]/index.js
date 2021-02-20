
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../libs/firebase";

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    let user,
        posts = [null, null];

    if (userDoc) {
        user = userDoc.data();
        const query = userDoc.ref
            .collection("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .limit(5);

        posts = (await query.get()).docs.map(postToJSON);
    }
    return {
        props: {
            user,
            posts,
        },
    };
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
