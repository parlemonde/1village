import React from 'react';

import { Box, InputBase } from '@mui/material';

import type { Syllable } from 'src/activity-types/anthem.types';
import { primaryColor } from 'src/styles/variables.const';
import BacklineIcon from 'src/svg/anthem/backline.svg';
import TrashIcon from 'src/svg/anthem/trash.svg';

type SyllableEditorProps = {
  value: Syllable;
  onChange?(newValue: Syllable): void;
  onDelete?(): void;
};

export const SyllableEditor = ({ value, onChange, onDelete }: SyllableEditorProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newValue, setNewValue] = React.useState(value.value);

  const canEdit = onChange !== undefined;
  const canDelete = onDelete !== undefined;

  return (
    <>
      {value.back && (
        <>
          <BacklineIcon height="1.45rem" style={{ marginTop: '25px' }} />
          <div style={{ flexBasis: '100%', height: 0 }} />
        </>
      )}
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          color: canDelete ? primaryColor : '#666666',
          margin: '1.5rem 10px 1rem 0',
          padding: '1px',
          border: canDelete ? `1px dashed ${primaryColor}` : undefined,
        }}
      >
        {isEditing ? (
          <Box
            style={{
              display: 'inline-block',
              maxWidth: '50vh',
              position: 'relative',
              overflow: 'hidden',
              textOverflow: 'clip',
            }}
          >
            {/* Hidden text to auto-grow the absolute positioned input. */}
            <span style={{ padding: '0 10px 0 5px', width: '100%', visibility: 'hidden', whiteSpace: 'nowrap' }}>
              {newValue.replace(/\s$/gi, '-')}
            </span>
            <InputBase
              size="small"
              autoFocus
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                minWidth: '1em',
                borderBottom: canDelete ? 'none' : '1px solid #000',
                '.MuiInputBase-input': {
                  backgroundColor: 'grey',
                  padding: 0,
                  margin: '0 10px 0 5px',
                  color: canDelete ? primaryColor : undefined,
                },
              }}
              onBlur={() => {
                setIsEditing(false);
                if (onChange !== undefined) {
                  onChange({
                    value: newValue || 'LA',
                    back: value.back,
                  });
                }
              }}
              value={newValue}
              onKeyPress={(event) => {
                // blur input on enter.
                if (event.key === 'Enter') {
                  (event.target as HTMLInputElement).blur();
                }
              }}
              onChange={(event) => {
                setNewValue(event.target.value);
              }}
            />
          </Box>
        ) : (
          <span
            style={{
              padding: '0 10px 0 5px',
              maxWidth: '50vh',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              borderBottom: canDelete ? 'none' : '1px solid #000',
            }}
            onClick={() => {
              setNewValue(value.value);
              setIsEditing(canEdit);
            }}
          >
            {value.value}
          </span>
        )}
        {canDelete && (
          <TrashIcon
            height="1.25rem"
            style={{
              verticalAlign: 'text-bottom',
              cursor: 'pointer',
            }}
            onClick={onDelete}
          />
        )}
      </Box>
    </>
  );
};
