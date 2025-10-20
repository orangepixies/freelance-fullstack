---
title: "Perf Notes: Faster First Paint"
date: "2025-10-05"
excerpt: "Tactics to make your landing feel instant: preconnects, fonts, and images."
image: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80"
---

Here are pragmatic tactics to reduce **Time to First Byte** and **First Contentful Paint** on small teams:

1. Ship static when possible, hydrate only islands that need it.
2. Preconnect to critical origins (fonts, analytics) and lazy-load the rest.
3. Use `next/image` for responsive images and set width/height to avoid layout shift.
