import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";

import { ExtWebSocket } from "./types";
import { UserManager } from "./managers/UserManager";
import { RoomManager } from "./managers/RoomManager";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 6969;

const userManager = new UserManager();
const roomManager = new RoomManager();

let usercount = 0;

wss.on("connection", (ws: ExtWebSocket) => {
  ws.on("error", (err) => {
    console.log(new Date() + "\tError:" + err);
    return;
  });

  ws.id = randomUUID();
  console.log(new Date() + "\tConnection established");

  userManager.addUser("user" + usercount++, ws);

  try {
    ws.on("message", (message: string) => {
      const response = JSON.parse(message);
      console.log(new Date() + "\tresponse:" + JSON.stringify(response));

      if (response.name) {
        userManager.updateName(ws.id, response.name);
      }

      switch (response.type) {
        case "createRoom": {
          console.log(new Date() + ws.id + "\tCreating room");
          const roomID = roomManager.startNewRoom(
            userManager.getUserById(ws.id)!,
          );
          console.log(new Date() + "\tinside createRoom Roomid:" + roomID);

          ws.send(
            JSON.stringify({
              status: "Room created",
              roomID,
              isPaired: false,
            }),
          );
          break;
        }
        case "joinRoom": {
          console.log(new Date() + ws.id + "\tJoining room");
          console.log(new Date(), "inside joinRoom", response.roomID);
          const room = roomManager.getRoombyId(response.roomID);
          console.log(
            new Date() +
              "\tinside joinRoom Room:" +
              JSON.stringify({ u1: room?.user1.name, u2: room?.user2.name }),
          );
          if (room) {
            const roomID = roomManager.createRoom(
              room.id,
              userManager.getUserById(ws.id)!,
            );
            ws.send(
              JSON.stringify({
                status: "Room Joined",
                roomID,
                isPaired: true,
              }),
            );
          } else {
            ws.send("Room not found");
          }
          break;
        }
        case "sendMessage": {
          console.log(new Date() + "\tSending message");
          const room = roomManager.getRoombyId(response.roomID)!;
          console.log(
            new Date() +
              "\tinside sendMessage ROOM:" +
              JSON.stringify({ u1: room?.user1.name, u2: room?.user2.name }),
          );
          const sender = userManager.getUserById(ws.id)!;
          const reciver = room.user1 === sender ? room.user2 : room.user1;

          console.log(
            new Date() + sender.name + "\tSending message to " + reciver.name,
          );

          if (sender.isPaired && reciver.isPaired) {
            sender.socket.send(
              JSON.stringify({
                type: "sentMessage",
                message: `s#${response.message}`,
                isPaired: true,
              }),
            );
            reciver.socket.send(
              JSON.stringify({
                type: "receiveMessage",
                message: `r#${response.message}`,
                isPaired: true,
              }),
            );
          }
          break;
        }
        default:
          ws.send("Invalid request");
          break;
      }
    });
  } catch (e: any) {
    console.log(new Date() + "\tError:" + e);
    ws.send(JSON.stringify({ status: "Error", message: e.message }));
  }

  ws.on("close", () => {
    console.log(new Date() + "\tConnection closed");
    roomManager.removeRoombyUser(userManager.getUserById(ws.id)!);
    userManager.removeUserByID(ws.id);
  });
});

app.get("/", (req, res) => {
  res.send(
    'The nodejs backend for website <a href="https://theconnect.vercel.app">theConnect</a>',
  );
});

// app.get("/rooms", (req, res) => {
//   res.send(JSON.stringify(roomManager.getRooms()));
// });

// app.get("/users", (req, res) => {
//   res.send(JSON.stringify(userManager.getUsers()));
// });

// Server listening
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
