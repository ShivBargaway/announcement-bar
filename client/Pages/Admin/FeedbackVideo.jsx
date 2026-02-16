import React, { useCallback, useRef, useState } from "react";
import {
  Badge,
  BlockStack,
  Button,
  Icon,
  IndexTable,
  InlineGrid,
  InlineStack,
  Link,
  Modal,
  Page,
  Text,
} from "@shopify/polaris";
import { ClipboardIcon, ExternalSmallIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonForm from "@/Components/Common/CommonForm";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import TruncatedText from "@/Components/Common/TruncatedText";
import { VideoDisplay } from "@/Components/Common/VideoPlayer";

export default function FeedbackVideo() {
  const [copied, setCopied] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const fetch = useAuthenticatedFetch();
  const childRef = useRef();
  const formRef = useRef();

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopied(true);
  };

  const openDescriptionModal = (user) => {
    setOpenModal(user ? true : false);
    setCurrentUser(user);
  };

  const submitDescription = useCallback(
    async (data) => {
      await fetch.post("admin/feedback-description", { ...data, shopUrl: currentUser });
      openDescriptionModal();
      childRef?.current?.fetchData();
    },
    [currentUser]
  );

  const createRowsData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>{index + 1}</IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack gap="200">
              <Text>{row?.shopUrl}</Text>
              <a style={{ cursor: "pointer" }} onClick={() => copyToClipboard(row.shopUrl)}>
                <Icon source={ClipboardIcon} />
              </a>
            </InlineStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap={200}>
              {row?.feedBack?.map((e, index) => (
                <BlockStack gap={200} align="center" inlineAlign="center" key={index}>
                  <VideoDisplay
                    url={e?.vultrUrl}
                    duration={Math.floor(e?.duration)}
                    settings={{ width: "200px", height: "170px" }}
                  />
                  <Link url={e?.vultrUrl} target="_blank">
                    <InlineGrid columns={"1fr 0fr"}>
                      <TruncatedText text={e?.vultrUrl} maxLength={30} />
                      <Icon source={ExternalSmallIcon} />
                    </InlineGrid>
                  </Link>
                </BlockStack>
              ))}
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {row?.description ? (
              <BlockStack gap={200} align="center" inlineAlign="center">
                <InlineStack>
                  <Badge tone="success">Reward done</Badge>
                </InlineStack>
                <div style={{ whiteSpace: "normal" }}>
                  <Text>{row?.description}</Text>
                </div>
              </BlockStack>
            ) : (
              <InlineStack align="center">
                <Button onClick={() => openDescriptionModal(row?.shopUrl)}>
                  Add Video Feedback Reward Description
                </Button>
              </InlineStack>
            )}
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }, []);

  return (
    <Page fullWidth>
      <CommonTable
        resourceName={{
          singular: "Bulk Operation",
          plural: "Bulk Operations",
        }}
        title={"Video Link"}
        queryPlaceholder={"Search Video Link"}
        url={"admin/getAllFeedbackVideo"}
        selectable={false}
        rowsData={createRowsData}
        isFilterVisible
        headings={[
          { title: "Index" },
          { title: "Store Name" },
          { title: "Video" },
          { title: "Action", alignment: "center" },
        ]}
        searchKey={["shopUrl"]}
        ref={childRef}
        isAdd={false}
        verticalAlign="center"
        columnContentTypes={["text", "text", "numeric", "numeric", "numeric", "text", "text"]}
      />
      <Modal open={openModal} onClose={() => openDescriptionModal()} title={`Selected user is : ${currentUser}`}>
        <Modal.Section>
          <CommonForm
            onSubmit={submitDescription}
            formRef={formRef}
            initialValues={{ description: "" }}
            formFields={[
              {
                id: "description",
                name: "description",
                label: "Add description",
                type: "text",
                validated: true,
                multiline: 4,
              },
            ]}
          />
        </Modal.Section>
      </Modal>
    </Page>
  );
}
