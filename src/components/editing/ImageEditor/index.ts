import dynamic from "next/dynamic";

export const ImageEditor = dynamic(() => import("./ImageEditor"), { ssr: false });
