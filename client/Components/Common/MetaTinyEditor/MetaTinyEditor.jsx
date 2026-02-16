import React, { useCallback, useEffect, useRef, useState } from "react";
import { BlockStack, InlineError, Text } from "@shopify/polaris";
import { Editor } from "@tinymce/tinymce-react";
import { convert } from "html-to-text";
import { t } from "i18next";
import _ from "lodash";

const MetaTinyEditor = (props) => {
  const {
    error,
    value,
    form: { setFieldValue },
    field: { name, label, toolbar, plugins, scrollHeight, showCount = false, metaTinyRef },
  } = props;

  const [editorState, setEditorState] = useState(value);

  const onEditorChange = useCallback(
    (newValue, editor) => {
      if (metaTinyRef?.current) {
        metaTinyRef.current = false;
        return;
      }

      setEditorState(newValue);
      setFieldValue(name, newValue);
    },
    [name, setFieldValue, value]
  );

  useEffect(() => {
    setEditorState(value ?? "");
    setFieldValue(name, value);
  }, [value]);

  return (
    <BlockStack gap="200">
      <span>{label}</span>
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
            image_advtab: true,
            imagetools_toolbar: "editimage imageoptions editmedia | remove",
            valid_elements: "*[*]", // Allow all elements/attributes (use cautiously)
            init_instance_callback: function () {
              if (metaTinyRef?.current) metaTinyRef.current = false;
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

      {error && <InlineError message={error} />}
    </BlockStack>
  );
};

export default MetaTinyEditor;
