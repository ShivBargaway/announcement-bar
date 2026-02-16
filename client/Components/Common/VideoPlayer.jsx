import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@shopify/polaris";
import { PlayIcon } from "@shopify/polaris-icons";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

function VideoPlayer(props) {
  const { url, settings } = props;
  return <ReactPlayer url={url} controls={true} height={160} width={215} {...settings} />;
}
let currentVideoRef = null;
export const VideoDisplay = (props) => {
  const savedSpeed = localStorage.getItem("playbackSpeed");
  const [isPlaying, setIsPlaying] = useState(false);
  const plyrRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(savedSpeed ? Number(savedSpeed) : 1); // Default speed

  const plyrProps = {
    source: {
      type: "video",
      title: "Example title",
      sources: [
        {
          src: props.url,
          type: "video/webm",
          size: 720,
        },
      ],
    },
    options: {
      title: "Example Title",
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["captions", "quality", "speed", "loop"],
      duration: props.duration,
      displayDuration: true,
      autoplay: false,
      speed: {
        selected: playbackSpeed, // Apply the playback speed from state
      },
    }, // https://github.com/sampotts/plyr#options
    // Direct props for inner video tag (mdn.io/video)
  };

  const stopCurrentVideo = () => {
    if (currentVideoRef && currentVideoRef !== plyrRef.current) {
      currentVideoRef.plyr.pause();
    }
  };

  const handlePlayButtonClick = useCallback(() => {
    stopCurrentVideo();
    setIsPlaying(true);
    setTimeout(() => {
      if (plyrRef.current && plyrRef.current.plyr) {
        const player = plyrRef.current.plyr;
        const savedSpeed = localStorage.getItem("playbackSpeed");
        player.speed = savedSpeed ? Number(savedSpeed) : playbackSpeed; // Apply the playback speed
        plyrRef.current.plyr.play().catch((error) => {
          console.log("Error playing video:", error);
        });
        currentVideoRef = plyrRef.current;
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        const player = plyrRef.current?.plyr;

        if (player) {
          const handleSpeedChange = () => {
            localStorage.setItem("playbackSpeed", player.speed);
          };
          player.on("ratechange", handleSpeedChange);
          return () => {
            player.off("ratechange", handleSpeedChange);
          };
        }
      }, 500);
    }
  }, [isPlaying, plyrRef.current]);

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        const player = plyrRef.current?.plyr;

        if (player) {
          const handlePlay = () => {
            stopCurrentVideo();
            currentVideoRef = plyrRef.current;
          };

          player.on("play", handlePlay);
          return () => {
            player.off("play", handlePlay);
          };
        }
      }, 500);
    }
  }, [isPlaying, plyrRef.current]);

  return (
    <>
      {isPlaying ? (
        <div
          className="video-player"
          style={{
            width: props.settings.width ? props.settings.width : "400px",
            maxWidth: props.settings.width ? props.settings.width : "400px",
            height: props.settings.height ? props.settings.height : "400px",
          }}
        >
          <Plyr {...plyrProps} ref={plyrRef} width="100px" height="160px" />
        </div>
      ) : (
        <div
          className="video-display"
          style={{
            // position: "absolute",
            width: props.settings.width ? props.settings.width : "400px",
            height: props.settings.height ? props.settings.height : "320px",
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            icon={PlayIcon}
            className="start-button"
            onClick={handlePlayButtonClick}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Play Video
          </Button>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
