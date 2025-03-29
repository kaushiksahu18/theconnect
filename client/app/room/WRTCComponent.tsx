import React, { useState } from "react";

import { Button } from "@/components/ui/button";

function WRTCComponent() {
  const [isRTC, setIsRTC] = useState(false);

  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement | null>(null);

  const localStream = React.useRef<MediaStream | null>(null);
  const remoteStream = React.useRef<MediaStream | null>(null);

  function handleRTCInit() {
    localStream.current = new MediaStream();
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        if (
          localVideoRef.current &&
          localStream.current &&
          remoteVideoRef.current
        ) {
          stream.getTracks().forEach((track) => {
            localStream.current?.addTrack(track);
          });
          localVideoRef.current.srcObject = localStream.current;
          remoteVideoRef.current.srcObject = localStream.current;
        }
      });
    setIsRTC(true);
  }

  function handleRTCDisconnect() {
    if (!remoteStream.current || !localStream.current) return;
    localStream.current.getTracks().forEach((track) => {
      track.stop();
    });
    localStream.current = null;
    remoteStream.current.getTracks().forEach((track) => {
      track.stop();
    });
    remoteStream.current = null;
    setIsRTC(false);
  }

  return (
    <div className="mx-auto w-[95vw] space-y-8 pt-4 lg:w-[70vw]">
      {!isRTC && (
        <div className="flex h-full w-full items-center justify-center">
          <Button onClick={() => handleRTCInit()}>
            Switch to Video/Voice call
          </Button>
        </div>
      )}
      {isRTC && (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <Button onClick={() => setIsRTC(false)}>Switch to Chat Only</Button>
          <div className="flex h-full w-full space-x-4">
            <div className="h-full w-1/2 overflow-hidden rounded-lg border-2 border-white">
              <video
                className="h-full w-full"
                ref={localVideoRef}
                autoPlay
                muted
              />
            </div>
            <div className="h-full w-1/2 overflow-hidden rounded-lg border-2 border-white">
              <video
                className="h-full w-full"
                ref={remoteVideoRef}
                autoPlay
                muted
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WRTCComponent;
