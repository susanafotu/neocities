import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getAllPosts, getPostBySlug, type Post, type PostMetadata } from './posts';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

const mockedReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockedReaddirSync = readdirSync as jest.MockedFunction<typeof readdirSync>;
const mockedJoin = join as jest.MockedFunction<typeof join>;

describe('posts utility functions', () => {
  const mockPostsDirectory = '/mock/posts';
  const mockCwd = '/mock';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock process.cwd() by mocking join to return the posts directory
    mockedJoin.mockImplementation((...paths: string[]) => paths.join('/'));
  });

  describe('parseFrontmatter (via readPost)', () => {
    it('should parse frontmatter with standard format', async () => {
      const mockContent = `---
title: Test Post
date: 2024-01-20
excerpt: This is a test excerpt
---

This is the post content.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/test-post.mdx`);

      const post = await getPostBySlug('test-post');

      expect(post.metadata.title).toBe('Test Post');
      expect(post.metadata.date).toBe('2024-01-20');
      expect(post.metadata.excerpt).toBe('This is a test excerpt');
      expect(post.metadata.slug).toBe('test-post');
      expect(post.content).toBe('This is the post content.');
    });

    it('should handle frontmatter with quoted values', async () => {
      const mockContent = `---
title: "Quoted Title"
date: "2024-01-20"
excerpt: 'Single quoted excerpt'
---

Content here.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/quoted.mdx`);

      const post = await getPostBySlug('quoted');

      expect(post.metadata.title).toBe('Quoted Title');
      expect(post.metadata.date).toBe('2024-01-20');
      expect(post.metadata.excerpt).toBe('Single quoted excerpt');
      expect(post.content).toBe('Content here.');
    });

    it('should handle frontmatter with colons in values', async () => {
      const mockContent = `---
title: Post with: colons
date: 2024-01-20
excerpt: Excerpt: with colons
---

Content.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/colons.mdx`);

      const post = await getPostBySlug('colons');

      expect(post.metadata.title).toBe('Post with: colons');
      expect(post.metadata.date).toBe('2024-01-20');
      expect(post.metadata.excerpt).toBe('Excerpt: with colons');
    });

    it('should trim whitespace from content', async () => {
      const mockContent = `---
title: Test
date: 2024-01-20
excerpt: Test
---

   Content with leading spaces   
   
   And multiple lines   `;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/whitespace.mdx`);

      const post = await getPostBySlug('whitespace');

      // parseFrontmatter trims the content, so leading/trailing whitespace is removed
      expect(post.content).toBe(`Content with leading spaces   
   
   And multiple lines`);
    });

    it('should handle frontmatter with extra whitespace', async () => {
      const mockContent = `---
title:   Spaced Title   
date: 2024-01-20
excerpt:  Spaced Excerpt  
---

Content.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/spaced.mdx`);

      const post = await getPostBySlug('spaced');

      expect(post.metadata.title).toBe('Spaced Title');
      expect(post.metadata.excerpt).toBe('Spaced Excerpt');
    });
  });

  describe('getPostBySlug', () => {
    it('should read and parse a single post by slug', async () => {
      const mockContent = `---
title: Single Post
date: 2024-01-15
excerpt: A single post excerpt
---

Post content here.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/single-post.mdx`);

      const post = await getPostBySlug('single-post');

      expect(mockedReadFileSync).toHaveBeenCalledWith(
        expect.stringContaining('single-post.mdx'),
        'utf8'
      );
      expect(post.metadata.slug).toBe('single-post');
      expect(post.metadata.title).toBe('Single Post');
      expect(post.metadata.date).toBe('2024-01-15');
      expect(post.metadata.excerpt).toBe('A single post excerpt');
      expect(post.content).toBe('Post content here.');
    });

    it('should include slug in metadata', async () => {
      const mockContent = `---
title: Test
date: 2024-01-20
excerpt: Test
---

Content.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/test-slug.mdx`);

      const post = await getPostBySlug('test-slug');

      expect(post.metadata.slug).toBe('test-slug');
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts sorted by date (newest first)', async () => {
      const mockFiles = ['post-1.mdx', 'post-2.mdx', 'post-3.mdx'];
      mockedReaddirSync.mockReturnValue(mockFiles as any);

      const mockContents = {
        'post-1': `---
title: First Post
date: 2024-01-10
excerpt: First excerpt
---`,
        'post-2': `---
title: Second Post
date: 2024-01-20
excerpt: Second excerpt
---`,
        'post-3': `---
title: Third Post
date: 2024-01-15
excerpt: Third excerpt
---`,
      };

      mockedReadFileSync.mockImplementation((path: any) => {
        const pathStr = String(path);
        const slug = pathStr.replace(/.*\/([^/]+)\.mdx$/, '$1');
        return mockContents[slug as keyof typeof mockContents] || '';
      });

      const posts = await getAllPosts();

      expect(posts).toHaveLength(3);
      expect(posts[0].metadata.title).toBe('Second Post'); // Newest
      expect(posts[0].metadata.date).toBe('2024-01-20');
      expect(posts[1].metadata.title).toBe('Third Post');
      expect(posts[1].metadata.date).toBe('2024-01-15');
      expect(posts[2].metadata.title).toBe('First Post'); // Oldest
      expect(posts[2].metadata.date).toBe('2024-01-10');
    });

    it('should filter out non-MDX files', async () => {
      const mockFiles = ['post-1.mdx', 'post-2.txt', 'post-3.mdx', 'readme.md'];
      mockedReaddirSync.mockReturnValue(mockFiles as any);

      mockedReadFileSync.mockImplementation((path: any) => {
        const pathStr = String(path);
        const slug = pathStr.replace(/.*\/([^/]+)\.mdx$/, '$1');
        return `---
title: ${slug}
date: 2024-01-20
excerpt: ${slug} excerpt
---`;
      });

      const posts = await getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts.some(p => p.metadata.slug === 'post-1')).toBe(true);
      expect(posts.some(p => p.metadata.slug === 'post-3')).toBe(true);
      expect(posts.some(p => p.metadata.slug === 'post-2')).toBe(false);
    });

    it('should include slug in each post metadata', async () => {
      const mockFiles = ['test-post.mdx'];
      mockedReaddirSync.mockReturnValue(mockFiles as any);

      mockedReadFileSync.mockReturnValue(`---
title: Test Post
date: 2024-01-20
excerpt: Test excerpt
---`);

      const posts = await getAllPosts();

      expect(posts[0].metadata.slug).toBe('test-post');
    });

    it('should return empty array when no posts exist', async () => {
      mockedReaddirSync.mockReturnValue([]);

      const posts = await getAllPosts();

      expect(posts).toHaveLength(0);
      expect(posts).toEqual([]);
    });

    it('should handle posts with same date', async () => {
      const mockFiles = ['post-1.mdx', 'post-2.mdx'];
      mockedReaddirSync.mockReturnValue(mockFiles as any);

      mockedReadFileSync.mockImplementation((path: any) => {
        const pathStr = String(path);
        const slug = pathStr.replace(/.*\/([^/]+)\.mdx$/, '$1');
        return `---
title: ${slug}
date: 2024-01-20
excerpt: ${slug} excerpt
---`;
      });

      const posts = await getAllPosts();

      expect(posts).toHaveLength(2);
      // When dates are equal, order is determined by localeCompare
      // Both should have the same date
      expect(posts[0].metadata.date).toBe('2024-01-20');
      expect(posts[1].metadata.date).toBe('2024-01-20');
    });

    it('should correctly map file names to slugs', async () => {
      const mockFiles = ['my-awesome-post.mdx', 'another_post.mdx'];
      mockedReaddirSync.mockReturnValue(mockFiles as any);

      mockedReadFileSync.mockImplementation((path: any) => {
        const pathStr = String(path);
        const slug = pathStr.replace(/.*\/([^/]+)\.mdx$/, '$1');
        return `---
title: ${slug}
date: 2024-01-20
excerpt: ${slug} excerpt
---`;
      });

      const posts = await getAllPosts();

      expect(posts[0].metadata.slug).toBe('my-awesome-post');
      expect(posts[1].metadata.slug).toBe('another_post');
    });
  });

  describe('edge cases', () => {
    it('should handle empty frontmatter', async () => {
      const mockContent = `---
---

Content without frontmatter.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/empty.mdx`);

      const post = await getPostBySlug('empty');

      expect(post.content).toBe('Content without frontmatter.');
      // Metadata fields might be undefined, but should still have slug
      expect(post.metadata.slug).toBe('empty');
    });

    it('should handle frontmatter with missing fields', async () => {
      const mockContent = `---
title: Only Title
---

Content.`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/partial.mdx`);

      const post = await getPostBySlug('partial');

      expect(post.metadata.title).toBe('Only Title');
      expect(post.metadata.slug).toBe('partial');
      expect(post.content).toBe('Content.');
    });

    it('should handle multiline content', async () => {
      const mockContent = `---
title: Multiline Post
date: 2024-01-20
excerpt: Excerpt
---

Line 1

Line 2

Line 3`;

      mockedReadFileSync.mockReturnValue(mockContent);
      mockedJoin.mockReturnValue(`${mockPostsDirectory}/multiline.mdx`);

      const post = await getPostBySlug('multiline');

      expect(post.content).toContain('Line 1');
      expect(post.content).toContain('Line 2');
      expect(post.content).toContain('Line 3');
    });
  });
});
