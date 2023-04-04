import Alpine from "alpinejs";
import Peer, { DataConnection } from "peerjs";

let peer: Peer;
let chat: DataConnection;

Alpine.data("chat", () => ({
  ownId: "",
  friendId: "",
  connected: false,
  chatting: false,
  messages: [],
  messageToSend: "",

  connect() {
    peer = new Peer(this.ownId, { debug: 1 });
    peer.on("open", () => {
      this.connected = true;
      peer.on("connection", (connection) => {
        chat = connection;
        this.chatting = true;
        chat.on("data", (text) => {
          this.messages.push({ from: "friend", text });
        });
      });
    });
  },

  chat() {
    chat = peer.connect(this.friendId);
    chat.on("open", () => {
      this.chatting = true;
      chat.on("data", (text) => {
        this.messages.push({ from: "friend", text });
      });
    });
    chat.on("error", () => {
      alert("Error!");
    });
  },

  send() {
    chat.send(this.messageToSend);
    this.messages.push({ from: "own", text: this.messageToSend });
    this.messageToSend = "";
  },
}));

Alpine.start();
