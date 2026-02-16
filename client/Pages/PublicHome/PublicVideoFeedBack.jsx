import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Button, Card, InlineStack, List, Page, Text } from "@shopify/polaris";
import { CameraIcon, PlayIcon, XIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { VideoDisplay } from "@/Components/Common/VideoPlayer";
import { logger } from "@/Services/Logger/Index";
import FeedBackDonePage from "./FeedBackDonePage";

const feedbackQuestions = [
  "How was your experience using our app?",
  "Which feature do you find most valuable, and what challenges did you face?",
  "How has our app helped solve your SEO challenges?",
];

const feedBackInstruction = [
  { label: "Prepare Yourself for Recording", description: "Ensure good lighting and clear audio." },
  { label: "Review All Questions in Advance", description: "Read the questions and plan your answers." },
  {
    label: "Provide Honest and Constructive Feedback",
    description: "Share what you like and what can be improved.",
  },
  {
    label: "Submit a Clear and Concise Video",
    description: (
      <>
        Get a <b>lifetime 30%</b> discount on <b>monthly</b> plans and <b>50%</b> on <b>annual</b> plans.
      </>
    ),
  },
];

export default function PublicVideoFeedBack() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isFeedBackDone, setIsFeedBackDone] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [videoURL, setVideoURL] = useState();
  const [duration, setDuration] = useState(0);
  const [videoRecordedBlob, setVideoRecordedBlob] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fetch = useAuthenticatedFetch();
  const shopUrl = searchParams.get("shopUrl");

  const startRecording = () => {
    setIsRecording(true);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const startTime = Date.now();
        videoRef.current.srcObject = stream;

        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4";

        const options = {
          mimeType: mimeType,
          videoBitsPerSecond: 150000, // Adjust as needed (150 Kbps)
        };
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        mediaRecorder.onstop = async () => {
          const videoBlob = new Blob(chunksRef.current, { type: mimeType });
          const videoURL = URL.createObjectURL(videoBlob);
          setVideoURL(videoURL);
          setVideoRecordedBlob(videoBlob);
          const endTime = Date.now();
          const durationInSeconds = Math.round((endTime - startTime) / 1000);
          setDuration(durationInSeconds);
          chunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      })
      .catch((error) => {
        logger.error(error);
      });
  };

  const stopRecording = async () => {
    mediaRecorderRef?.current?.stop();
    videoRef?.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const deleteVideo = useCallback(async () => {
    setVideoRecordedBlob();
    setDuration();
    setVideoURL();
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsFeedBackDone(true);
    const fileName = `video-${Date.now()}.webm`;
    const additionalData = { recordedUrl: videoURL, duration, type: videoRecordedBlob.type, fileName };

    const formData = new FormData();
    formData.append("additionalData", JSON.stringify(additionalData));
    formData.append("file", videoRecordedBlob, fileName);

    await fetch.post(`/feed-back?shopUrl=${shopUrl}`, formData, true, { "Content-Type": "multipart/form-data" });
  }, [videoRecordedBlob, videoURL, duration]);

  const fetchData = async () => {
    const response = await fetch.get(`/feed-back?shopUrl=${shopUrl}`, false);
    setIsFeedBackDone(response?.data?.feedBack ? true : false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || !shopUrl) return <></>;
  if (isFeedBackDone) return <FeedBackDonePage />;

  return (
    <Page
      title="Video FeedBack"
      primaryAction={{ content: "Submit video", onAction: handleSubmit, disabled: !videoURL }}
    >
      <Card>
        <BlockStack gap={400} align="center">
          <BlockStack gap={100} align="center">
            <Text variant="headingMd">Feedback Submission Guidelines</Text>
            <Text />
            <List type="bullet">
              {feedBackInstruction?.map((item, index) => (
                <List.Item key={index}>
                  <InlineStack gap={100} blockAlign="center" key={index}>
                    <Text as="h2" fontWeight="semibold">
                      {item?.label} -
                    </Text>
                    <Text as="h2">{item?.description}</Text>
                  </InlineStack>
                </List.Item>
              ))}
            </List>
          </BlockStack>
          <BlockStack gap={100} align="center">
            <Text variant="headingMd">Your Feedback Matters: Enhancing Our App & SEO Experience</Text>
            <Text />
            {feedbackQuestions?.map((item, index) => (
              <InlineStack key={index} gap={200}>
                <Text />
                <Text>
                  {index + 1}. {item}
                </Text>
              </InlineStack>
            ))}
          </BlockStack>

          <BlockStack gap={200} align="center">
            {isRecording ? (
              <>
                <video
                  className="video-screen"
                  width={"400px"}
                  height={"320px"}
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: "100%", maxWidth: "400px", maxHeight: "320px", height: "auto" }}
                />
                <InlineStack>
                  <Button size="micro" icon={PlayIcon} onClick={stopRecording} className="start-button">
                    Stop Recording
                  </Button>
                </InlineStack>
              </>
            ) : videoURL ? (
              <>
                <VideoDisplay
                  url={videoURL}
                  duration={Math.floor(duration)}
                  settings={{
                    width: "400px",
                    height: "320px",
                  }}
                />
                <InlineStack gap={200}>
                  <Button icon={CameraIcon} onClick={startRecording}>
                    Re-capture a video
                  </Button>
                  <Button icon={XIcon} onClick={deleteVideo} variant="primary" tone="critical">
                    Delete Video
                  </Button>
                </InlineStack>
              </>
            ) : (
              <InlineStack>
                <Button icon={CameraIcon} onClick={startRecording}>
                  Capture a video
                </Button>
              </InlineStack>
            )}
          </BlockStack>
        </BlockStack>
      </Card>
    </Page>
  );
}
