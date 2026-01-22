import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';

export interface PostMetadata {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}

const postsDirectory = join(process.cwd(), 'src/posts');

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<PostMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof PostMetadata] = value;
  });

  return { metadata: metadata as PostMetadata, content: content };
}

async function readPost(slug: string) {
  const fullPath = join(postsDirectory, `${slug}.mdx`);
  const content = readFileSync(fullPath, 'utf8');
  return parseFrontmatter(content);
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { content, metadata } = await readPost(slug);
      return {
        metadata: {
          ...metadata,
          slug: slug,
        },
        content,
      };
    })
  );

  return posts.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { content, metadata } = await readPost(slug);

  return {
    metadata: {
      ...metadata,
      slug: slug,
    },
    content,
  };
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
