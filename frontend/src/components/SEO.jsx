import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({ 
  title, 
  description, 
  keywords,
  ogImage,
  ogType = "website",
  article = false,
  schemaData = null,
  canonical = null
}) {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL?.replace('/api', '') || 'https://m-stroy.ru';
    const currentUrl = canonical || `${baseUrl}${location.pathname}`;

    // Title
    if (title) {
      document.title = title;
    }

    // Meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: currentUrl },
      { property: 'og:image', content: ogImage || `${baseUrl}/og-image.jpg` },
      { property: 'og:locale', content: 'ru_RU' },
      { property: 'og:site_name', content: 'М-СТРОЙ' },
      
      // Twitter Cards
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage || `${baseUrl}/og-image.jpg` },
      
      // Geo tags
      { name: 'geo.region', content: 'RU-MOW' },
      { name: 'geo.placename', content: 'Москва' },
      
      // Robots
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;
      
      const attr = name ? 'name' : 'property';
      const value = name || property;
      
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // JSON-LD Schema
    if (schemaData) {
      let script = document.querySelector('script[type="application/ld+json"]#dynamic-schema');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'dynamic-schema');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaData);
    }

  }, [title, description, keywords, ogImage, ogType, location.pathname, canonical, schemaData]);

  return null;
}
