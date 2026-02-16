import React, { useCallback, useEffect, useRef, useState } from "react";
import { BlockStack, InlineError, InlineStack, SkeletonBodyText, Tag, Text } from "@shopify/polaris";
import { ContentState, Editor, EditorState, Modifier, SelectionState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default function HelpTextSelector(props) {
  const {
    form: { setFieldValue },
    field: { name, option, label, multiline, tooltip },
    value,
    error,
    isSkeletonLine = false,
  } = props;
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });
  const editorRef = useRef(null);

  useEffect(() => {
    const currentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (currentHtml !== value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [value]);

  const insertTag = useCallback(
    (tag) => {
      const currentContent = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const newText = Modifier.insertText(currentContent, selectionState, ` \${${tag.value}} `);
      const newEditorState = EditorState.push(editorState, newText, "insert-characters");

      const len = ` \${${tag.value}} `.length;
      const finalSelection = selectionState.merge({
        anchorOffset: selectionState.getAnchorOffset() + len,
        focusOffset: selectionState.getFocusOffset() + len,
      });
      const finalEditorState = EditorState.forceSelection(newEditorState, finalSelection);

      setEditorState(finalEditorState);
    },
    [editorState]
  );

  const handleKeyCommand = useCallback(
    (command) => {
      if (command === "backspace") {
        const selection = editorState.getSelection();
        const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
        const text = block.getText();
        const start = selection.getStartOffset();

        for (let tag of option) {
          const tagPattern = ` \${${tag.value}} `;
          const tagIndex = text.lastIndexOf(tagPattern, start);
          if (tagIndex !== -1 && start <= tagIndex + tagPattern.length && start > tagIndex) {
            const newSelection = new SelectionState({
              anchorKey: block.getKey(),
              focusKey: block.getKey(),
              anchorOffset: tagIndex,
              focusOffset: start,
            });

            const contentAfterRemoval = Modifier.removeRange(
              editorState.getCurrentContent(),
              newSelection,
              "backward"
            );
            const newEditorState = EditorState.push(editorState, contentAfterRemoval, "remove-range");

            const finalEditorState = EditorState.forceSelection(
              newEditorState,
              new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: tagIndex,
                focusKey: block.getKey(),
                focusOffset: tagIndex,
              })
            );

            setEditorState(finalEditorState);
            return "handled";
          }
        }
      }
      return "not-handled";
    },
    [editorState, option]
  );

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
    const updatedHtml = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    if (updatedHtml !== value) {
      setFieldValue(name, updatedHtml);
    }
  };

  return (
    <BlockStack gap="200">
      <InlineStack gap="200">
        <Text>{label}</Text>
        {tooltip}
      </InlineStack>
      <div className={error ? "editor-error-field" : ""}>
        <div className={multiline ? "helptext-multiline" : ""}>
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </div>
      <InlineError message={error} />
      {isSkeletonLine && option?.length === 0 ? (
        <BlockStack gap="100">
          <SkeletonBodyText lines={3} />
        </BlockStack>
      ) : (
        <InlineStack gap="200">
          {option?.map((tag) => (
            <Tag key={tag.label} onClick={() => insertTag(tag)}>
              {tag.label}
            </Tag>
          ))}
        </InlineStack>
      )}
    </BlockStack>
  );
}
