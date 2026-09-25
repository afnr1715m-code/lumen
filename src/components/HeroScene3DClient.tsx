"use client";

import dynamic from "next/dynamic";

// `dynamic(..., { ssr: false })` isn't allowed inside a Server Component
// (Hero.tsx renders server-side to await the dictionary), so this thin
// "use client" boundary is what actually gets to skip SSR for the WebGL
// canvas — Hero.tsx just imports this normally.
const HeroScene3D = dynamic(() => import("./HeroScene3D"), { ssr: false });

export default HeroScene3D;
