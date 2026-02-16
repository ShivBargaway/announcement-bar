import React, { useCallback, useEffect, useRef, useState } from "react";
import { BlockStack, Button, InlineError, InlineStack, Text } from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { Editor } from "@tinymce/tinymce-react";
import { convert } from "html-to-text";
import { t } from "i18next";
import _ from "lodash";
import { AITextGenerator } from "./AITextGenerator";
import ShopifyImages from "./ShopifyImages";
import VideoButton from "./VideoButton";

const TinyEditorComponent = (props) => {
  const {
    error,
    value,
    form: { setFieldValue },
    field: {
      name,
      label,
      toolbar,
      plugins,
      scrollHeight,
      aiButton = false,
      addImage = false,
      addVideo = false,
      showCount = false,
    },
  } = props;

  const tinyRef = useRef(true);

  const [editorState, setEditorState] = useState(value);
  const [aiGeneratedValue, setAiGeneratedValue] = useState();
  const [showAiModal, setShowAiModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedData, setSelectedData] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(true);

  const closeModals = () => {
    setShowAiModal(false);
    setShowImageModal(false);
    setShowVideoModal(false);
    setAiGeneratedValue(null);
  };

  // const onEditorChange = useCallback((newValue, editor) => {
  //   setEditorState(newValue);
  //   setFieldValue(name, newValue);
  // }, []);

  const onEditorChange = useCallback((newValue, editor) => {
    if (tinyRef?.current) {
      tinyRef.current = false; // Mark first render as done
      return;
    }
    setEditorState(newValue);
    setFieldValue(name, newValue);
  }, []);

  useEffect(() => {
    setEditorState(value ?? "");
  }, [value]);

  const handleEditorInit = (editor) => {
    editor.on("click", (e) => {
      const iframeElement = e.target.querySelector("iframe");
      if (iframeElement) {
        const source = iframeElement.getAttribute("src");
        const width = iframeElement.getAttribute("width");
        const height = iframeElement.getAttribute("height");
        setSelectedVideo({ source, width, height, embedCode: iframeElement.outerHTML });
      }
    });

    if (aiButton) {
      editor.ui.registry.addButton("aiButton", {
        text: "AI",
        onAction: () => {
          const selectedTextData = editor.selection.getContent({ format: "text" });
          if (selectedTextData) {
            setSelectedData(selectedTextData);
            setShowAiModal(true);
          }
        },
      });
    }

    if (addImage) {
      editor.ui.registry.addButton("addImage", {
        icon: "image",
        tooltip: "Add Image",
        onAction: () => setShowImageModal(true),
      });
    }
    if (addVideo) {
      editor.ui.registry.addButton("addVideo", {
        icon: "video",
        tooltip: "Add Media",
        onAction: () => setShowVideoModal(editor),
      });
    }
  };

  const handleAiSubmit = useCallback(async (data) => {
    const editor = tinymce.activeEditor;
    editor.selection.setContent(data);
    setEditorState(editor.getContent());
    setFieldValue(name, editor.getContent());
    setAiGeneratedValue("");
    closeModals();
  }, []);

  const handleImageSubmit = useCallback(async (data) => {
    const url = data.image?.originalSrc;
    const editor = tinymce.activeEditor;
    const imgElement = `<img src="${url}" style="margin-left: 10px; margin-right: 10px;">`;
    editor.execCommand("mceInsertContent", false, imgElement);
    closeModals();
  }, []);

  const handleVideoSubmit = useCallback((data) => {
    const editor = tinymce.activeEditor;
    let videoContent;

    if (data.embedCode) {
      let embedCode = data.embedCode;
      embedCode = data?.width ? embedCode.replace(/width="\d+"/, `width="${data?.width}"`) : embedCode;
      embedCode = data?.height ? embedCode.replace(/height="\d+"/, `height="${data?.height}"`) : embedCode;
      videoContent = embedCode;
    } else if (
      data.source.includes("youtube.com") ||
      data.source.includes("youtu.be") ||
      data.source.includes("vimeo.com")
    ) {
      videoContent = `
        <iframe width="${data.width}" height="${data.height}" src="${data.source}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    }
    editor.execCommand("mceInsertContent", false, videoContent);
    closeModals();
  }, []);

  return (
    <BlockStack gap="200">
      <InlineStack align="space-between" blockAlign="center">
        <span>{label}</span>
        {props?.showExpandButton && (
          <Button
            variant="plain"
            icon={isFormExpanded ? ChevronUpIcon : ChevronDownIcon}
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          />
        )}
      </InlineStack>
      {isFormExpanded && (
        <BlockStack gap="200">
          <div className={error ? "editor-error-field" : ""}>
            <Editor
              tinymceScriptSrc={process.env.SHOPIFY_APP_URL + "/tinymce/tinymce.min.js"}
              value={editorState}
              onEditorChange={onEditorChange}
              init={{
                height: scrollHeight,
                menubar: false,
                statusbar: false,
                plugins: plugins,
                toolbar: `aiButton addImage addVideo ${toolbar}`,
                content_style: "body { font-size:0.8rem }",
                entity_encoding: "raw",
                setup: handleEditorInit,
                image_advtab: true,
                imagetools_toolbar: "editimage imageoptions editmedia | remove",
                valid_elements: "*[*]", // Allow all elements/attributes (use cautiously)
                init_instance_callback: function () {
                  if (tinyRef?.current) tinyRef.current = false;
                },
              }}
            />
          </div>
          {showCount && (
            <Text>
              {t(`common.Current count is`) +
                " " +
                convert(editorState)?.replace(/\s+/g, " ")?.trim()?.length +
                " " +
                t(`common.characters`)}
            </Text>
          )}
          {props?.helpText}
          {showAiModal && (
            <AITextGenerator
              selectedData={selectedData}
              showAiModal={showAiModal}
              setShowAiModal={setShowAiModal}
              aiGeneratedValue={aiGeneratedValue}
              setAiGeneratedValue={setAiGeneratedValue}
              closeModals={closeModals}
              handleAiSubmit={handleAiSubmit}
            />
          )}
          {showImageModal && (
            <ShopifyImages
              showImageModal={showImageModal}
              setShowImageModal={setShowImageModal}
              closeModals={closeModals}
              handleImageSubmit={handleImageSubmit}
            />
          )}
          {showVideoModal && (
            <VideoButton
              showVideoModal={showVideoModal}
              setShowVideoModal={setShowVideoModal}
              closeModals={closeModals}
              handleVideoSubmit={handleVideoSubmit}
              selectedVideo={selectedVideo}
            />
          )}
          {error && <InlineError message={error} />}
        </BlockStack>
      )}
    </BlockStack>
  );
};

export default TinyEditorComponent;
