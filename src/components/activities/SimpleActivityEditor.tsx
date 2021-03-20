import { ReactSortable } from 'react-sortablejs';
import React from 'react';

import type { EditorContent } from 'src/activities/extendedActivity.types';
import { ActivityContext } from 'src/contexts/activityContext';

import { AddContentCard } from './AddContentCard';
import { H5pEditor } from './editors/H5pEditor';
import { ImageEditor } from './editors/ImageEditor/ImageEditor';
import { TextEditor } from './editors/TextEditor/TextEditor';
import { VideoEditor } from './editors/VideoEditor';

const SimpleActivityEditor: React.FC = () => {
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  const shouldSave = React.useRef(false);

  const onChangeContent = (index: number, willSave: boolean = false) => (newValue: string) => {
    const newContent = [...activity.processedContent];
    newContent[index].value = newValue;
    updateActivity({ processedContent: newContent });
    shouldSave.current = willSave;
  };

  React.useEffect(() => {
    if (shouldSave.current) {
      shouldSave.current = false; // prevent loops.
      save().catch();
    }
  }, [activity.processedContent, save]);

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
                  shouldSave.current = true;
                }}
                onBlur={() => {
                  save().catch(console.error);
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

export default SimpleActivityEditor;
