import matter from "gray-matter";
import Date from "./Date";
import Link from "next/link";
// import { parseISO } from "date-fns";
import { Post } from "../utils/mdxUtils";

type Props = {
  post: Post;
};

export default function PostItem({ post }: Props) {
  const { content, data } = matter(post.source);
  return (
    <Link
      as={`/posts/${post.filePath.replace(/\.mdx?$/, "")}`}
      href={`/posts/[slug]`}
    >
      <a>
        <Date date={data.date} />
        <h2>{data.title}</h2>
        <style jsx>
          {`
            a {
              color: #222;
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-weight: 500;
            }
          `}
        </style>
      </a>
    </Link>
  );
}
