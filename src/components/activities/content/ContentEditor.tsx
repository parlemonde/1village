import { useRouter } from 'next/router';
import { ReactSortable } from 'react-sortablejs';
import React from 'react';

import type { EditorContent, EditorTypes } from 'src/activity-types/extendedActivity.types';

import { AddContentCard } from './AddContentCard';
import { H5pEditor } from './editors/H5pEditor';
import { ImageEditor } from './editors/ImageEditor/ImageEditor';
import { TextEditor } from './editors/TextEditor/TextEditor';
import { VideoEditor } from './editors/VideoEditor';

interface ContentEditorProps {
  content: EditorContent[];
  updateContent(newContent: EditorContent[]): void;
  addContent(type: EditorTypes, value?: string): void;
  deleteContent(index: number): void;
  save(): Promise<boolean>;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, updateContent, addContent, deleteContent, save }: ContentEditorProps) => {
  const router = useRouter();
  const shouldSave = React.useRef(false);
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

  const onChangeContent = (index: number, willSave: boolean = false) => (newValue: string) => {
    const newContent = [...content];
    newContent[index].value = newValue;
    updateContent(newContent);
    shouldSave.current = willSave;
  };

  React.useEffect(() => {
    if (shouldSave.current) {
      shouldSave.current = false; // prevent loops.
      save().catch();
    }
  }, [content, save]);

  return (
    <div>
      <ReactSortable list={content} setList={updateContent} handle=".drag-handle">
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
                  shouldSave.current = true;
                }}
                onFocus={() => {
                  clearTimeout(blurTimeoutSave.current);
                }}
                onBlur={() => {
                  clearTimeout(blurTimeoutSave.current);
                  blurTimeoutSave.current = window.setTimeout(() => {
                    save().catch(console.error);
                  }, 6000);
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
                onChange={onChangeContent(index, true)}
                onDelete={() => {
                  deleteContent(index);
                  shouldSave.current = true;
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
                onChange={onChangeContent(index, true)}
                onDelete={() => {
                  deleteContent(index);
                  shouldSave.current = true;
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
                onChange={onChangeContent(index, true)}
                onDelete={() => {
                  deleteContent(index);
                  shouldSave.current = true;
                }}
              />
            );
          }
          return null;
        })}
      </ReactSortable>
      <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
        <AddContentCard addContent={addContent} />
      </div>
    </div>
  );
};

export default ContentEditor;
