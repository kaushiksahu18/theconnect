import { ExtWebSocket } from "../types";

export interface User {
  name: string;
  socket: ExtWebSocket;
  isPaired: boolean;
}

export class UserManager {
  private users: User[];
  constructor() {
    this.users = [];
  }

  addUser(name: string, socket: ExtWebSocket) {
    this.users.push({ name, socket, isPaired: false });
  }

  removeUserByID(socketID: string) {
    const user = this.users.find((user) => user.socket.id === socketID);
    if (user) {
      user.isPaired = false;
    }
    this.users = this.users.filter((user) => user.socket.id !== socketID);
  }

  updateName(socketID: string, name: string) {
    const user = this.users.find((user) => user.socket.id === socketID);
    if (user) {
      user.name = name;
    }
  }

  getUserById(socketID: string) {
    return this.users.find((user) => user.socket.id === socketID);
  }

  getUnpairedUser() {
    return this.users.find((user) => !user.isPaired);
  }

  getUsers() {
    return this.users;
  }
}
