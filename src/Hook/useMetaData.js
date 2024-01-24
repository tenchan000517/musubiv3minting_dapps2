// hooks/useMetaData.js
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const useMetaData = (title, description, image, url) => {
  const [metaConfig, setMetaConfig] = useState({
    title: "",
    description: "",
    image: "/left.png",
    url: ""
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const configResponse = await fetch("/config/config.json");
      const config = await configResponse.json();
      setMetaConfig(config.META);
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    document.title = title || metaConfig.title;
  }, [title, metaConfig.title]);

  return (
    <Helmet>
      <title>{title || metaConfig.title}</title>
      <meta name="description" content={description || metaConfig.description} />

      {/* Open Graph */}
      <meta property="og:title" content={title || metaConfig.title} />
      <meta property="og:description" content={description || metaConfig.description} />
      <meta property="og:image" content={image || metaConfig.image} />
      <meta property="og:url" content={url || metaConfig.url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || metaConfig.title} />
      <meta name="twitter:description" content={description || metaConfig.description} />
      <meta name="twitter:image" content={image || metaConfig.image} />
    </Helmet>
  );
};

export default useMetaData;
