import fs from "fs";
import path, { parse } from "path";
import matter from "gray-matter";
import { parseISO, formatISO } from "date-fns";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import Head from "next/head";
import Link from "next/link";
import rehypePrism from "@mapbox/rehype-prism";
import React from "react";
import styles from "../../../public/styles/content.module.css";
import Author from "../../components/Author";
import Copyright from "../../components/Copyright";
import Date from "../../components/Date";
import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import JsonLdMeta from "../../components/meta/JsonLdMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";
import { SocialList } from "../../components/SocialList";
import TagButton from "../../components/TagButton";
import { getAuthor } from "../../lib/authors";
import { getTag } from "../../lib/tags";
import { postFilePaths, POSTS_PATH } from "../../utils/mdxUtils";

const components = {
  a: Link,
  Head,
};

type Props = {
  title: string;
  date: string;
  slug: string;
  description: string;
  tags: string[];
  author: string;
  source: string;
  cover: string;
};

export default function Index({
  title,
  date,
  slug,
  author,
  tags,
  description,
  source,
  cover
}: Props) {
  const keywords = tags.map((it) => getTag(it).name);
  const authorName = getAuthor(author).name;
  const content = hydrate(source, { components });
  const dateParsed = parseISO(date);
  return (
    <Layout>
      <BasicMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/posts/${slug}`}
        title={title}
        image={cover}
        description={description}
      />
      <OpenGraphMeta
        url={`/posts/${slug}`}
        title={title}
        image={cover}
        description={description}
      />
      <JsonLdMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        date={dateParsed}
        author={authorName}
        description={description}
      />
      <div className={"container"}>
        <article>
          <header>
            <h1>{title}</h1>
            <div className={"metadata"}>
              <div><Date date={dateParsed} /></div>
              <div>
                <Author author={getAuthor(author)} />
              </div>
            </div>
          </header>
          <div className={styles.content}>{content}</div>
          <ul className={"tag-list"}>
            {tags.map((it, i) => (
              <li key={i}>
                <TagButton tag={getTag(it)} />
              </li>
            ))}
          </ul>
        </article>
        <footer>
          <div className={"social-list"}><SocialList /></div>
          <Copyright />
        </footer>
      </div>
      <style jsx>
        {`
          .container {
            display: block;
            max-width: 36rem;
            width: 100%;
            margin: 0 auto;
            padding: 0 1.5rem;
            box-sizing: border-box;
          }
          .metadata div {
            display: inline-block;
            margin-right: 0.5rem;
          }
          article {
            flex: 1 0 auto;
          }
          h1 {
            margin: 0 0 0.5rem;
            font-size: 2.25rem;
          }
          .tag-list {
            list-style: none;
            text-align: right;
            margin: 1.75rem 0 0 0;
            padding: 0;
          }
          .tag-list li {
            display: inline-block;
            margin-left: 0.5rem;
          }
          .social-list {
            margin-top: 3rem;
            text-align: center;
          }

          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
        `}
      </style>
      <style global jsx>
        {`
          /* Syntax highlighting */
          .token.comment,
          .token.prolog,
          .token.doctype,
          .token.cdata,
          .token.plain-text {
            color: #6a737d;
          }

          .token.atrule,
          .token.attr-value,
          .token.keyword,
          .token.operator {
            color: #d73a49;
          }

          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #22863a;
          }

          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.inserted {
            color: #032f62;
          }

          .token.function,
          .token.class-name {
            color: #6f42c1;
          }

          /* language-specific */

          /* JSX */
          .language-jsx .token.punctuation,
          .language-jsx .token.tag .token.punctuation,
          .language-jsx .token.tag .token.script,
          .language-jsx .token.plain-text {
            color: #24292e;
          }

          .language-jsx .token.tag .token.attr-name {
            color: #6f42c1;
          }

          .language-jsx .token.tag .token.class-name {
            color: #005cc5;
          }

          .language-jsx .token.tag .token.script-punctuation,
          .language-jsx .token.attr-value .token.punctuation:first-child {
            color: #d73a49;
          }

          .language-jsx .token.attr-value {
            color: #032f62;
          }

          .language-jsx span[class="comment"] {
            color: pink;
          }

          /* HTML */
          .language-html .token.tag .token.punctuation {
            color: #24292e;
          }

          .language-html .token.tag .token.attr-name {
            color: #6f42c1;
          }

          .language-html .token.tag .token.attr-value,
          .language-html
            .token.tag
            .token.attr-value
            .token.punctuation:not(:first-child) {
            color: #032f62;
          }

          /* CSS */
          .language-css .token.selector {
            color: #6f42c1;
          }

          .language-css .token.property {
            color: #005cc5;
          }
        `}
      </style>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  // export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);
  const mdxSource = await renderToString(content, {
    components,
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypePrism],
    },
    // scope: data,
  });
  const { title, date, slug, author, tags, description } = data;
  return {
    props: {
      source: mdxSource,
      title,
      date: formatISO(date),
      slug,
      author,
      tags,
      description: description || "",
      cover: data.cover || ""
    },
  };
}

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ""))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
