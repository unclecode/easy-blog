const admin = require("firebase-admin");

var serviceAccount = require("../../easy-blog-9e420-firebase-adminsdk-4zr6d-cb5391c0d8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

async function addPosts() {
    for (let ix = 0; ix < 10; ix++) {
        await db
            .doc(`users/HARwB0arGDXS0BIpBxBimhl3amr1/posts/how-to-code-${ix}`)
            .set(
                {
                    title: `How to Code ${ix}`,
                    slug: `how-to-code-${ix}`,
                    uid: "HARwB0arGDXS0BIpBxBimhl3amr1",
                    username: "unclecode",
                    published: true,
                    content: `# hello world! ${ix}`,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    heartCount: Math.floor(Math.random() * 10) + 1,
                },
                { merge: true }
            );
        console.log(`${ix} post is added`);
    }
}

addPosts();
