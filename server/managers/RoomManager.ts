import { ExtWebSocket } from "../types";
import { User } from "./UserManager";

interface Room {
  id: string;
  user1: User;
  user2: User;
}

export class RoomManager {
  private rooms: Room[];
  constructor() {
    this.rooms = [];
  }

  startNewRoom(user1: User) {
    const roomID = user1.socket.id + user1.socket.id;
    this.rooms.push({ id: roomID, user1: user1, user2: user1 });
    //console.log(new Date() + "\tNew room started:" + roomID);
    return roomID;
  }

  createRoom(roomID: string, user2: User) {
    const room = this.rooms.find((room) => room.id === roomID);
    //console.log(
    //   new Date() +
    //     "\tinside createRoom: " +
    //     JSON.stringify({ u1: room?.user1.name, u2: room?.user2.name })
    // );
    if (room) {
      room.user2 = user2;
      room.id = room.user1.socket.id + room.user2.socket.id;
      //console.log(new Date() + "\tuser1:" + room.user1.name);
      //console.log(new Date() + "\tuser2:" + room.user2.name);
      //console.log(new Date() + "\ttinside createRoom new id:" + room.id);

      room.user2.isPaired = true;
      room.user1.isPaired = true;
      room.user1.socket.send(
        JSON.stringify({
          status: "They Joined",
          roomID: room.id,
          isPaired: true,
        })
      );
      return room.id;
    }
    return "room not found";
  }

  onOffer(roomID: string, sdp: string, senderSocketid: string) {
    console.log(new Date().toUTCString(), "onOffer");
    const room = this.getRoombyId(roomID);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    console.log(
      new Date().toUTCString(),
      "onOffer sending sdp ",
      receivingUser.name
    );
    receivingUser?.socket.send(JSON.stringify({ type: "offer", sdp, roomID }));
  }

  onAnswer(roomID: string, sdp: string, senderSocketid: string) {
    console.log(new Date().toUTCString(), "onAnswer");
    const room = this.getRoombyId(roomID);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    console.log(
      new Date().toUTCString(),
      "onAnswer sending sdp ",
      receivingUser.name
    );
    receivingUser?.socket.send(JSON.stringify({ type: "answer", sdp, roomID }));
  }

  onIceCandidates(
    roomID: string,
    senderSocketid: string,
    candidate: any,
    type2: "sender" | "receiver"
  ) {
    console.log(new Date().toUTCString(), "onIceCandidates");
    const room = this.getRoombyId(roomID);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    console.log(
      new Date().toUTCString(),
      "onIceCandidates sending candidate",
      receivingUser.name
    );
    receivingUser.socket.send(
      JSON.stringify({ type: "add-ice-candidate", candidate, type2 })
    );
  }

  removeRoomById(roomID: string) {
    const room = this.rooms.find((room) => room.id === roomID);
    if (room) {
      room.user1.isPaired = false;
      room.user2.isPaired = false;
      this.rooms = this.rooms.filter((room) => room.id !== roomID);
      //console.log(new Date() + "\tremoveRoomById:" + room.id);
      return room;
    }
    return "room not found";
  }

  removeRoombyUser(user: User) {
    const room = this.rooms.find(
      (room) => room.user1 === user || room.user2 === user
    );
    if (room) {
      room.user1.isPaired = false;
      room.user2.isPaired = false;
      this.rooms = this.rooms.filter(
        (room) => room.user1 !== user && room.user2 !== user
      );
      room.user1.socket.send(
        JSON.stringify({ status: "Room left", isPaired: false })
      );
      room.user2.socket.send(
        JSON.stringify({ status: "Room left", isPaired: false })
      );
      //console.log(new Date() + "\tremoveRoombyUser:" + room.id);
      return room;
    }
    return "room not found";
  }

  getRoombyId(roomID: string) {
    return this.rooms.find((room) => room.id === roomID);
  }

  getRooms() {
    return this.rooms;
  }
}
