import ReactPlayer from "react-player";
import React from "react";

const VideoPreview: React.FC<{ value: string }> = ({ value }: { value: string }) => {
  return (
    <div className="text-preview text-center">
      <div
        style={{
          display: "inline-block",
          width: "24rem",
          height: "13.5rem",
        }}
      >
        <ReactPlayer width="100%" height="100%" light url={value} controls />
      </div>
    </div>
  );
};

export default VideoPreview;
