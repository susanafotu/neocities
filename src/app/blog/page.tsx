import { getAllPosts, formatDate } from '../../utils/posts';

export default async function BlogPage() {
  const blogPosts = await getAllPosts();
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-lg mb-8">
          Thoughts, ideas, and creative explorations.
        </p>
        
        <div className="space-y-8">
          {blogPosts.map((post) => {
            const { metadata } = post;
            const { title, date, excerpt, slug } = metadata;
            return (
            <article key={slug} className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-2">
                <a 
                  href={`/blog/${slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {title}
                </a>
              </h2>
              <time dateTime={date} className="text-gray-600 text-sm">{formatDate(date)}</time>
              <p className="mt-4 text-gray-700">{excerpt}</p>
              <a 
                href={`/blog/${slug}`}
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </a>
            </article>
          )})}
        </div>
      </main>
    </div>
  );
}
