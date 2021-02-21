import AuthCheck from "../../components/AuthCheck";

export default function AdminPostsPages({ }) {
  return (
    <main>
        <AuthCheck>
            <div>Admin page</div>
        </AuthCheck>
    </main>
  )
}