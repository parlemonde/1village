import dynamic from "next/dynamic";

export const VideoEditor = dynamic(() => import("./VideoEditor"), { ssr: false });
