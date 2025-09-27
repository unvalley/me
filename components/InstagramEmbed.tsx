"use client";

import { useEffect, useMemo } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

type InstagramEmbedProps = {
  url: string;
};

const SCRIPT_ID = "instagram-embed-script";

export function InstagramEmbed({ url }: InstagramEmbedProps) {
  const permalink = useMemo(() => {
    try {
      const target = new URL(url);
      return `${target.origin}${target.pathname}`;
    } catch {
      return url;
    }
  }, [url]);

  useEffect(() => {
    const processEmbeds = () => {
      if (typeof window === "undefined") return;

      const embed = window.instgrm?.Embeds;
      if (embed?.process) {
        embed.process();
      }
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = processEmbeds;
      document.body.appendChild(script);
    } else {
      processEmbeds();
    }
  }, [permalink]);

  return (
    <div className="mt-7 flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{ maxWidth: "540px", width: "100%", margin: 0 }}
      >
        <a href={url}>View this post on Instagram</a>
      </blockquote>
    </div>
  );
}
