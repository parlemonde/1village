import { ReactSortable } from 'react-sortablejs';
import React from 'react';

import { ActivityContext } from 'src/contexts/activityContext';

import { AddContentCard } from './AddContentCard';
import type { EditorContent } from './editing.types';
import { ImageEditor } from './editors/ImageEditor';
import { TextEditor } from './editors/TextEditor';
import { VideoEditor } from './editors/VideoEditor';

const SimpleActivityEditor: React.FC = () => {
  const { activity, updateActivity, addContent, deleteContent } = React.useContext(ActivityContext);

  const onChangeContent = (index: number) => (newValue: string) => {
    const newContent = [...activity.processedContent];
    newContent[index].value = newValue;
    updateActivity({ processedContent: newContent });
  };

  const setContentOrder = (newContent: EditorContent[]) => {
    updateActivity({ processedContent: newContent });
  };

  return (
    <div>
      <ReactSortable list={activity.processedContent} setList={setContentOrder} handle=".drag-handle">
        {activity.processedContent.map((p, index) => {
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
          return null;
        })}
      </ReactSortable>
      <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
        <AddContentCard addContent={addContent} />
      </div>
    </div>
  );
};

export default SimpleActivityEditor;
