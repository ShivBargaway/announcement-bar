import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "./../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorComponent = ({ config, value, form: { setFieldValue }, field: { name } }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [lastHtml, setLastHtml] = useState("");

  useEffect(() => {
    if (value !== lastHtml) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
        setLastHtml(value); // Update the last HTML to the current value
      }
    }
  }, [value, lastHtml]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentHtml = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setFieldValue(name, currentHtml);
    setLastHtml(currentHtml); // Update lastHtml with the new HTML
  };

  return (
    <Editor
      editorClassName="editor-style"
      {...config}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
    />
  );
};

export default EditorComponent;
