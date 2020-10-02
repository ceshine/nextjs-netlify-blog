import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'posts')

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))

export const posts = fs
.readdirSync(POSTS_PATH)
// Only include md(x) files
.filter((path) => /\.mdx?$/.test(path)).map((filePath) => {
  const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
  const decoder = new TextDecoder("utf-8");
  const { data } = matter(source);
  return {
    source: decoder.decode(source),
    date: data.date,
    filePath,
  }
}).sort(
  (a, b) => (b.date -  a.date)
).map(
  (val)=> ({source: val.source, filePath: val.filePath})
);

export const getTaggedPosts = (tag) => fs
.readdirSync(POSTS_PATH)
// Only include md(x) files
.filter((path) => /\.mdx?$/.test(path)).map((filePath) => {
  const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
  const { data } = matter(source);
  const decoder = new TextDecoder("utf-8");
  return {
    source: decoder.decode(source),
    tags: data.tags,
    filePath,
  }
}).filter(post => post.tags && post.tags.includes(tag)).map(
  (val)=> ({source: val.source, filePath: val.filePath})
);

export type Post = {
  filePath: string,
  source: string
};
