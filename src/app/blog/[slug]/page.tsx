import { notFound } from 'next/navigation';
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts, formatDate } from '../../../utils/posts';
import { CustomMDX } from '../../../components/mdx/MdxPage';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.metadata.slug,
  }));
}

export default async function BlogPost({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const { metadata, content } = post;
  const { title, date, excerpt } = metadata;
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
      <div className="pb-8">
          <a href="/blog" className="text-blue-800 hover:text-blue-800 font-bold rounded-md px-2 py-1 border border-blue-900 hover:border-blue-600 bg-blue-100 hover:bg-blue-200">
            ← Back to blog list
          </a>
        </div>
        <article>
          <header className="mb-8 border-b pb-2">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <time dateTime={date} className="text-gray-600">{formatDate(date)}</time>
          </header>
          
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={content}/>
          </div>
        </article>

      </main>
    </div>
  );
}
