import dynamic from "next/dynamic";

export const VideoPreview = dynamic(() => import("./VideoPreview"), { ssr: false });
