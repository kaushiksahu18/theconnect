import { useEffect, useRef, useState } from "react";

import { useSocketStore } from "@/lib/SocketContext";

import { Button } from "@/components/ui/button";

function WRTCComponent() {
  const [isRTC, setIsRTC] = useState(false);

  const Socket = useSocketStore();
  const socket = useRef<null | WebSocket>(Socket.getSocket());

  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null,
  );

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (socket.current === null) return;
    try {
      socket.current.addEventListener("message", (event) => {
        if (event.data === "message") return;
        const data = JSON.parse(event.data);
        //console.log("Message received", data);

        if (data.type === "switch-to-rtc") {
          console.log("Getting the server response to switch to RTC mode");
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
              }
            });

          //console.log("Sending startRTC");
          setIsRTC(true);
        }
        if (data.type === "send-offer") {
          console.log("getting the server response to send the offer");
          const pc = new RTCPeerConnection();
          console.log("new RTCPeerConnection created", pc);
          setSendingPc(pc);

          if (localStream.current !== null) {
            console.log("adding all tracks to the new RTCPeerConnection", pc);
            localStream.current.getTracks().forEach((tracks) => {
              pc.addTrack(tracks, localStream.current!);
            });
          }

          pc.onicecandidate = (e) => {
            console.log("inside send-offer onicecandidate", e);
            if (e.candidate) {
              socket.current?.send(
                JSON.stringify({
                  type: "add-ice-candidate",
                  candidate: e.candidate,
                  type2: "sender",
                  roomID: Socket.getRoomID(),
                }),
              );
            }
          };

          pc.onnegotiationneeded = (e) => {
            console.log("inside send-offer onnegotiationneeded", e);
            pc.createOffer().then((offer) => {
              console.log("pc.createOffer() created offer", offer);
              pc.setLocalDescription(offer);
              socket.current?.send(
                JSON.stringify({
                  type: "offer",
                  sdp: offer,
                  roomID: Socket.getRoomID(),
                }),
              );
            });
          };
        }
        if (data.type === "offer") {
          console.log("Inside offer");
          const pc = new RTCPeerConnection();
          console.log("new RTCPeerConnection inside offer created", pc);
          setReceivingPc(pc);

          console.log("setting remote description", data.sdp);
          pc.setRemoteDescription(data.sdp);

          pc.createAnswer().then((answer) => {
            console.log("pc.createAnswer() created answer", answer);
            pc.setLocalDescription(answer);
            console.log("pc.setLocalDescription() set answer", answer);

            socket.current?.send(
              JSON.stringify({
                type: "answer",
                sdp: answer,
                roomID: Socket.getRoomID(),
              }),
            );
          });

          const stream = new MediaStream();
          console.log("new empty MediaStream created", stream);
          if (remoteVideoRef.current) {
            console.log(
              "setting remoteVideoRef.current.srcObject to stream",
              stream,
            );
            remoteVideoRef.current.srcObject = stream;
          }
          remoteStream.current = stream;

          pc.onicecandidate = (e) => {
            console.log("inside offer onicecandidate", e);
            if (!e.candidate) {
              return;
            }
            //console.log("on ice candidate on receiving seide");
            socket.current?.send(
              JSON.stringify({
                type: "add-ice-candidate",
                candidate: e.candidate,
                type2: "receiver",
                roomID: Socket.getRoomID(),
              }),
            );
          };

          pc.ontrack = (e) => {
            console.log("inside offer ontrack", e);
            e.streams.forEach((stream) => {
              stream.getTracks().forEach((track) => {
                console.log("adding track to remoteVideoRef.current", track);
                console.log(
                  "remoteVideoRef.current?.srcObject",
                  remoteVideoRef.current?.srcObject,
                );
                //@ts-ignore
                remoteVideoRef.current?.srcObject?.addTrack(track);
              });
            });
          };
        }
        if (data.type === "answer") {
          console.log("inside answer");
          console.log("sending pc.setRemoteDescription(data.sdp)", data.sdp);
          sendingPc?.setRemoteDescription(data.sdp);
        }
        if (data.type === "add-ice-candidate") {
          console.log("inside add-ice-candidate");
          if (data.type2 === "sender") {
            console.log("adding ice candidate from remote", data.candidate);
            receivingPc?.addIceCandidate(data.candidate);
          } else {
            console.log("adding ice candidate from local", data.candidate);
            sendingPc?.addIceCandidate(data.candidate);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  function handleRTCInit() {
    console.log("Request to switch to RTC");
    if (socket.current === null) return;
    socket.current.send(
      JSON.stringify({ type: "switch-to-rtc", roomID: Socket.getRoomID() }),
    );
  }

  function handleRTCDisconnect() {
    console.log("Disconnecting RTC ans switching back to chat only...");
    localStream.current?.getTracks().forEach((track) => {
      track.stop();
    });
    localStream.current = null;
    remoteStream.current?.getTracks().forEach((track) => {
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
          <Button onClick={() => handleRTCDisconnect()}>
            Switch to Chat Only
          </Button>
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="h-1/2 w-full overflow-hidden rounded-lg border-2 border-white md:h-full md:w-1/2">
              <video className="h-full w-full" ref={localVideoRef} autoPlay />
            </div>
            <div className="h-1/2 w-full overflow-hidden rounded-lg border-2 border-white md:h-full md:w-1/2">
              <video className="h-full w-full" ref={remoteVideoRef} autoPlay />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WRTCComponent;
