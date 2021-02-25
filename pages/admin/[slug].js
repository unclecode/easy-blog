import { useRouter } from "next/router";
export default function AdminPostEditPage({ }) {
    const router = useRouter();
    const slug = router.query;
    console.log(slug);
  return (
    <main>
        Admin {slug.slug}
    </main>
  )
}