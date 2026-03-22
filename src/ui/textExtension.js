import { EventEmitter } from "events";

export default () => {
  class CampfireChat extends EventEmitter {
    constructor(wire) {
      super();
      this._wire = wire;
      this._ip = wire._chatIp || "unknown";
      this._peerSupports = false;
    }

    onHandshake(infoHash, peerId, extensions) {}

    onExtendedHandshake(handshake) {
      if (!handshake.m || !handshake.m.campfire_chat) {
        return this.emit(
          "warning",
          new Error("Peer does not support campfire_chat"),
        );
      }
      this._peerSupports = true;
      this.emit("peer_ready", this._ip);
    }

    onMessage(buf) {
      let text;
      try {
        text = buf.toString("utf8");
      } catch (e) {
        return;
      }
      this.emit("message", this._ip, text);
    }

    send(text) {
      if (!this._peerSupports) return;
      try {
        this._wire.extended("campfire_chat", Buffer.from(text, "utf8"));
      } catch (e) {}
    }
  }

  CampfireChat.prototype.name = "campfire_chat";

  return CampfireChat;
};
