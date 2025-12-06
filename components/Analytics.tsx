"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't track in development
    if (process.env.NODE_ENV === "development") {
      return;
    }

    function getVisitorId() {
      let id = localStorage.getItem("visitor_id");
      if (!id) {
        id = "v_" + Date.now() + "_" + Math.random().toString(36);
        localStorage.setItem("visitor_id", id);
      }
      return id;
    }

    // Bot detection
    function isBot() {
      const ua = navigator.userAgent.toLowerCase();
      const botPatterns = [
        /bot/i,
        /crawl/i,
        /spider/i,
        /slurp/i,
        /googlebot/i,
        /bingbot/i,
        /yandex/i,
        /baidu/i,
        /duckduckbot/i,
        /facebookexternalhit/i,
        /twitterbot/i,
        /linkedinbot/i,
        /whatsapp/i,
        /telegrambot/i,
        /headless/i,
        /phantom/i,
        /selenium/i,
        /webdriver/i,
      ];

      if (botPatterns.some((pattern) => pattern.test(ua))) return true;
      if (!navigator.language || navigator.languages.length === 0) return true;
      if (navigator.webdriver) return true;

      return false;
    }

    // Track pageview
    async function trackPageview() {
      if (isBot()) return;

      try {
        const data = {
          page_url: pathname,
          referrer: document.referrer || null,
          visitor_id: getVisitorId(),
          user_agent: navigator.userAgent,
        };

        await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    }

    trackPageview();
  }, [pathname, searchParams]);

  return null;
}
