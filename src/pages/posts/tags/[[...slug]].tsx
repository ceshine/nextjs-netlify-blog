import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import BasicMeta from "../../../components/meta/BasicMeta";
import OpenGraphMeta from "../../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../../components/meta/TwitterCardMeta";
import TagPostList from "../../../components/TagPostList";
import config from "../../../lib/config";
import { countPosts, listPostContent, PostContent } from "../../../lib/posts";
import { getTag, listTags, TagContent } from "../../../lib/tags";
import Head from "next/head";
import { getTaggedPosts, Post } from "../../../utils/mdxUtils";

type Props = {
  posts: Post[];
  tag: TagContent;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
};

export default function Index({ posts, tag, pagination, page }: Props) {
  const url = `/posts/tags/${tag.name}` + (page ? `/${page}` : "");
  const title = tag.name;
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <TagPostList posts={posts} tag={tag} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queries = params.slug as string[];
  const [slug, pageStr] = [queries[0], queries[1]];
  const page = parseInt(pageStr as string) || 1;
  const tag = getTag(slug);
  const taggedPosts = getTaggedPosts(slug);
  const pagination = {
    current: page,
    pages: Math.ceil(taggedPosts.length / config.posts_per_page),
  };
  const posts = getTaggedPosts(slug).slice(
    (page - 1) * config.posts_per_page,
    page * config.posts_per_page
  );

  return {
    props: {
      page,
      posts: posts,
      tag,
      pagination,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = listTags().flatMap((tag) => {
    const taggedPosts = getTaggedPosts(tag.slug);
    const pages = Math.ceil(taggedPosts.length / config.posts_per_page);
    return Array.from(Array(pages).keys()).map((page) =>
      page === 0
        ? {
            params: { slug: [tag.slug] },
          }
        : {
            params: { slug: [tag.slug, (page + 1).toString()] },
          }
    );
  });
  return {
    paths: paths,
    fallback: false,
  };
};
