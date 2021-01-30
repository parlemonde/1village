import React from "react";

export const ImagePreview: React.FC<{ value: string }> = ({ value }: { value: string }) => {
  return (
    <div className="text-preview text-center">
      <div
        style={{
          display: "inline-block",
          width: "15rem",
          height: "10rem",
          backgroundImage: `url(${value})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};
