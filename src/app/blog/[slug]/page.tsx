import { notFound } from 'next/navigation';

// This would typically come from a database or CMS
const blogPosts = {
  'first-post': {
    title: 'My First Blog Post',
    content: 'This is the content of my first blog post...',
    date: '2024-01-15'
  },
  'creative-coding': {
    title: 'Creative Coding Adventures',
    content: 'Exploring the world of creative coding and generative art...',
    date: '2024-01-20'
  }
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
            <time className="text-gray-600">{post.date}</time>
          </header>
          
          <div className="prose prose-lg max-w-none">
            <p>{post.content}</p>
            <p>This is a dynamic route example. The slug &quot;{params.slug}&quot; was passed as a parameter.</p>
          </div>
        </article>
        
        <div className="mt-8 pt-8 border-t">
          <a href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </a>
        </div>
      </main>
    </div>
  );
}
