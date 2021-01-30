import dynamic from "next/dynamic";

export const TextEditor = dynamic(() => import("./ImageEditor"), { ssr: false });
