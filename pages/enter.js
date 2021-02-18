import { auth, googleAuthProvider } from "../libs/firebase";

export default function EnterPage({}) {
    let user = null;
    let username = null;
    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

function SignInButton() {
    return (
        <button
            className="btn-google"
            onClick={async () => await auth.signInWithPopup(googleAuthProvider)}
        >
            <img src={"/google.png"} /> Sign in with Google
        </button>
    );
}
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
function UsernameForm() { return null;}
