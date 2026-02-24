import React from "react";
import { formatDate, Post } from "../../utils/posts";

export default function PostPreview({ post }: { post: Post }) {
  const { metadata } = post;
  console.log(post);
  const { title, date, excerpt, slug } = metadata;
  return (
    <article key={slug} className="border-b pb-8">
      <h2 className="mb-2 text-2xl font-semibold">
        <a
          href={`/blog/${slug}`}
          className="transition-colors hover:text-blue-600"
        >
          {title}
        </a>
      </h2>
      <time dateTime={date} className="text-sm text-gray-600">
        {formatDate(date)}
      </time>
      <p className="mt-4 text-gray-700">{excerpt}</p>
      <a
        href={`/blog/${slug}`}
        className="mt-4 inline-block font-medium text-blue-600 hover:text-blue-800"
      >
        Read more →
      </a>
    </article>
  );
}
