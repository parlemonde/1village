import React from "react";

export const TextPreview: React.FC<{ value: string }> = ({ value }: { value: string }) => {
  return (
    <div className="text-preview">
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};
