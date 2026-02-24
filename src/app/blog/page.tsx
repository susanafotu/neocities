import Image from "next/image";
import PostPreview from "../../components/blog/PostPreview";
import { getAllPosts } from "../../utils/posts";

export default async function BlogPage() {
  const blogPosts = await getAllPosts();
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-row gap-4 pb-12"> 
          <div className="flex-1 flex flex-col gap-2 self-center border-b pb-5">
          <h1 className="mb-2 text-4xl font-bold">Island Updates</h1>
          <p className="mb-8 pb-2 text-lg">
            Moments, stories, bugs, and other updates from my adventures in
            Hello Kitty Island Adventure.
          </p>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Image src="/hkia/hkia-avi-cloud-gude.jpeg" alt="Island Updates" width={500} height={500} className="rounded-md" />
          </div>
          
        </div>

        <main className="space-y-8">
          {blogPosts.map((post) => {
            const { metadata } = post;
            const { slug } = metadata;
            return <PostPreview key={slug} post={post} />;
          })}
        </main>
      </div>
    </div>
  );
}
