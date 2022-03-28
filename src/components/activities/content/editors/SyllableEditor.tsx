import React from 'react';
import VideoIcon from 'src/svg/editor/video_icon.svg';
import ImageIcon from 'src/svg/editor/image_icon.svg';
import ContentEditable from 'react-contenteditable'

export const SyllableEditor = ({ update, index, backline = false, editable = false, content = [] }) => {
    const contentEditable = React.useRef();

    return (
        <>
            <div className="editor" style={{ width: 'fit-content', padding: '1px', maxWidth: '50vh', display: 'inline-block' }}>
                <ContentEditable
                    onChange={(e) => update(content[index].value = e.target.value)}
                    innerRef={contentEditable}
                    disable={editable}
                    tagName='span'
                    html={content[index].value} />
                {/* <input disabled value={text} size='' style={{width:'auto'}}></input> */}
                <ImageIcon height="1.25rem" onClick={() =>
                    update(content.splice(index, 1))} /></div>

            {backline && <><VideoIcon height="1.25rem" /><div style={{
                width: '100%'
            }} ></div></>}
        </>
    )
}