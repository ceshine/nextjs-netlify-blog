import config from "../../lib/config";
import Head from "next/head";

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};
export default function TwitterCardMeta({ url, title, description, image }: Props) {
  return (
    <Head>
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={config.twitter_account} />
      <meta property="twitter:url" content={config.base_url + url} />
      <meta property="twitter:image" content={image ? config.base_url + image : config.base_url + "/og_image.png"} />
      <meta
        property="twitter:title"
        content={title ? [title, config.site_title].join(" | ") : config.base_url + "/og_image.png"}
      />
      <meta
        property="twitter:description"
        content={description ? description : config.site_description}
      />
    </Head>
  );
}
