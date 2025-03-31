"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoveRight, ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSocketStore, WEBSOCKET_URI } from "@/lib/SocketContext";

function LobbyPage() {
  const [hoveredSide, setHoveredSide] = useState<"create" | "join" | null>(
    null,
  );
  const [clickSide, setClickSide] = useState<"create" | "join" | null>(null);
  const [username, setUsername] = useState("");

  const roomID = useRef<string | null>(null);
  const [status, setStatus] = useState("");

  const Socket = useSocketStore();
  const socket = useRef<null | WebSocket>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    Socket.setSocket(new WebSocket(WEBSOCKET_URI));

    if (searchParams.get("join") && searchParams.get("join") !== "true") {
      setClickSide("join");
      roomID.current = searchParams.get("join");
    }

    socket.current = Socket.getSocket();

    if (socket.current) {
      socket.current.addEventListener("message", (event) => {
        if(event.data === "message") return;
        const data = JSON.parse(event.data);
        if (data) {
          setStatus(data.status);
          roomID.current = data.roomID;
        }

        if (data.isPaired === true) {
          Socket.setRoomID(data.roomID);
          switch (data.status) {
            case "They Joined":
              router.push("/room?create=true");
              break;
            case "Room Joined":
              router.push("/room?join=true");
              break;
          }
        }
      });
    }
  }, []);

  const handleClick = (action: "create" | "join") => {
    setClickSide(action);
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClickSide("create");
    socket.current?.send(
      JSON.stringify({ type: "createRoom", name: username }),
    );
    //console.log("created");
  };

  const handleJoinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClickSide("join");

    if (searchParams.get("join") && searchParams.get("join") !== "true") {
      socket.current?.send(
        JSON.stringify({
          type: "joinRoom",
          name: username,
          roomID: searchParams.get("join") || roomID.current,
        }),
      );
      //console.log("joined");
      return;
    }

    socket.current?.send(
      JSON.stringify({
        type: "joinRoom",
        name: username,
        roomID: roomID.current,
      }),
    );
    //console.log("joined");
  };

  return (
    <main className="flex h-screen min-h-screen w-full flex-col items-center justify-center text-center lg:flex-row">
      <motion.div
        id="create-room"
        className={`relative flex cursor-pointer items-center justify-center bg-[#00ccaa] text-white ${clickSide === null ? "h-1/2 w-full lg:h-full lg:w-1/2" : clickSide === "create" ? "h-full w-full" : "hidden h-0 w-0"}`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setHoveredSide("create")}
        onHoverEnd={() => setHoveredSide(null)}
        onClick={() => handleClick("create")}
      >
        {clickSide === null ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: hoveredSide === "create" ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-4 text-4xl font-bold">Create a Room</h2>
            <p className="mb-6 text-xl">
              Start a new chat room for others to join
            </p>
            <motion.div
              className="inline-flex items-center"
              initial={{ x: 0 }}
              animate={{ x: hoveredSide === "create" ? 10 : 0 }}
            >
              <span className="mr-2">Get Started</span>
              <MoveRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ) : clickSide === "create" && status !== "Room created" ? (
          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-col items-center space-y-4 rounded-lg border-2 border-gray-300 p-6"
          >
            <div className="flex flex-col items-center space-x-4">
              <Label htmlFor="username" className="text-2xl">
                Username
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-2xl"
                id="username"
                placeholder="Enter your username"
              />
            </div>
            <Button size="lg" type="submit">
              Create Room
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center space-x-4 space-y-4 rounded-lg border-2 border-gray-300 p-6">
              <strong>Copy and share this ID with your PEER</strong>
              <p>{roomID.current}</p>
              <Button
                size="lg"
                type="submit"
                onClick={async () =>
                  await navigator.clipboard.writeText(roomID.current!)
                }
              >
                Copy RoomID
              </Button>
            </div>
            <div className="flex flex-col items-center space-x-4 space-y-4 rounded-lg border-2 border-gray-300 p-6">
              <strong>Or share this link with your PEER</strong>
              <Button
                size="lg"
                type="submit"
                onClick={async () =>
                  await navigator.clipboard.writeText(
                    `${window.location.href}?join=${roomID.current}`,
                  )
                }
              >
                Copy Link
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      <motion.div
        id="join-room"
        className={`relative flex cursor-pointer items-center justify-center bg-[#0066cc] text-white ${clickSide === null ? "h-1/2 w-full lg:h-full lg:w-1/2" : clickSide === "join" ? "h-full w-full" : "hidden h-0 w-0"}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onHoverStart={() => setHoveredSide("join")}
        onHoverEnd={() => setHoveredSide(null)}
        onClick={() => handleClick("join")}
      >
        {clickSide === null ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: hoveredSide === "join" ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-4 text-4xl font-bold">Join a Room</h2>
            <p className="mb-6 text-xl">Enter an existing chat room</p>
            <motion.div
              className="inline-flex items-center"
              initial={{ x: 0 }}
              animate={{ x: hoveredSide === "join" ? 10 : 0 }}
            >
              <span className="mr-2">Enter Room</span>
              <MoveRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ) : (
          clickSide === "join" && (
            <form
              onSubmit={handleJoinSubmit}
              className="flex flex-col items-center space-y-4 rounded-lg border-2 border-gray-300 p-6"
            >
              <div className="flex flex-col items-center space-x-4">
                <Label htmlFor="username" className="text-2xl">
                  Username
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-2xl"
                  id="username"
                  placeholder="Enter your username"
                />
                {searchParams.get("join") === null && (
                  <>
                    <Label htmlFor="roomID" className="text-2xl">
                      Room ID
                    </Label>
                    <Input
                      value={roomID.current!}
                      onChange={(e) => {
                        roomID.current = e.target.value;
                      }}
                      className="text-2xl"
                      id="roomID"
                      placeholder="Past your RoomID"
                    />
                  </>
                )}
              </div>
              <Button size="lg" type="submit">
                Join Room
              </Button>
            </form>
          )
        )}
      </motion.div>
      {clickSide !== null && (
        <Button
          onClick={() => (window.location.href = "/lobby")}
          className="absolute left-4 top-4 cursor-pointer space-x-2 text-xl text-white"
        >
          <ChevronsLeft />
          <span>close</span>
        </Button>
      )}
    </main>
  );
}

export default LobbyPage;
