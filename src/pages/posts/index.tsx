import { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";
import PostList from "../../components/PostList";
import config from "../../lib/config";
import { listTags, TagContent } from "../../lib/tags";
import Head from "next/head";
import { posts as allPosts, Post } from '../../utils/mdxUtils'

type Props = {
  posts: Post[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tags, pagination }: Props) {
  const url = "/posts";
  const title = "All posts";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const tags = listTags()
  const pagination = {
    current: 1,
    pages: Math.ceil(allPosts.length / config.posts_per_page),
  };  
  const posts = allPosts.slice(
    0, config.posts_per_page
  )
  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
}

