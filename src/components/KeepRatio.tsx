import React from "react";

interface KeepRatioProps {
  ratio: number;
  width?: string | number;
  maxWidth?: string | number;
  className?: string;
  children: React.ReactNode | React.ReactNodeArray;
}

export const KeepRatio: React.FC<KeepRatioProps> = ({ width = "100%", maxWidth = "100%", ratio, className = "", children }: KeepRatioProps) => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width, maxWidth }}>
        <div style={{ width: "100%", paddingBottom: `${ratio * 100}%`, position: "relative" }}>
          <div className={className} style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
