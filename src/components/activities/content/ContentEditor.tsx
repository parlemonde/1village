import { useRouter } from 'next/router';
import React from 'react';

import { Sortable } from 'src/components/Sortable';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

import { AddContentCard } from './AddContentCard';
import { H5pEditor } from './editors/H5pEditor';
import { ImageEditor } from './editors/ImageEditor/ImageEditor';
import { SoundEditor } from './editors/SoundEditor';
import { TextEditor } from './editors/TextEditor/TextEditor';
import { VideoEditor } from './editors/VideoEditor/VideoEditor';

interface ContentEditorProps {
  content: ActivityContent[];
  updateContent(newContent: ActivityContent[]): void;
  addContent(type: ActivityContentType, value?: string): void;
  deleteContent(index: number): void;
  save(): Promise<boolean>;
}

const ContentEditor = ({ content, updateContent, addContent, deleteContent }: ContentEditorProps) => {
  const router = useRouter();
  const blurTimeoutSave = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    const cancelSave = () => {
      clearTimeout(blurTimeoutSave.current);
    };
    router.events.on('routeChangeStart', cancelSave);
    return () => {
      router.events.off('routeChangeStart', cancelSave);
    };
  }, [router.events]);

  const onChangeContent = (index: number) => (newValue: string) => {
    const newContent = [...content];
    newContent[index].value = newValue;
    updateContent(newContent);
  };

  return (
    <div>
      <Sortable component="div" list={content} setList={updateContent} handle=".drag-handle">
        {content.map((p, index) => {
          if (p.type === 'text') {
            return (
              <TextEditor
                key={p.id}
                id={p.id}
                value={p.value}
                onChange={onChangeContent(index)}
                onDelete={() => {
                  deleteContent(index);
                }}
              />
            );
          }
          if (p.type === 'image') {
            return (
              <ImageEditor
                key={p.id}
                id={p.id}
                value={p.value}
                onChange={onChangeContent(index)}
                onDelete={() => {
                  deleteContent(index);
                }}
              />
            );
          }
          if (p.type === 'video') {
            return (
              <VideoEditor
                key={p.id}
                id={p.id}
                value={p.value}
                onChange={onChangeContent(index)}
                onDelete={() => {
                  deleteContent(index);
                }}
              />
            );
          }
          if (p.type === 'h5p') {
            return (
              <H5pEditor
                key={p.id}
                id={p.id}
                value={p.value}
                onChange={onChangeContent(index)}
                onDelete={() => {
                  deleteContent(index);
                }}
              />
            );
          }
          if (p.type === 'sound') {
            return (
              <SoundEditor
                key={p.id}
                id={p.id}
                value={p.value}
                onChange={onChangeContent(index)}
                onDelete={() => {
                  deleteContent(index);
                }}
              />
            );
          }
          return <div key={p.id}></div>;
        })}
      </Sortable>
      <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
        <AddContentCard addContent={addContent} />
      </div>
    </div>
  );
};

export default ContentEditor;
