const blogPosts = [
  {
    slug: 'first-post',
    title: 'My First Blog Post',
    excerpt: 'This is the content of my first blog post...',
    date: '2024-01-15'
  },
  {
    slug: 'creative-coding',
    title: 'Creative Coding Adventures',
    excerpt: 'Exploring the world of creative coding and generative art...',
    date: '2024-01-20'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-lg mb-8">
          Thoughts, ideas, and creative explorations.
        </p>
        
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-2">
                <a 
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </a>
              </h2>
              <time className="text-gray-600 text-sm">{post.date}</time>
              <p className="mt-4 text-gray-700">{post.excerpt}</p>
              <a 
                href={`/blog/${post.slug}`}
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
