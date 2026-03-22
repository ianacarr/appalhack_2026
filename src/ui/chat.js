import createTextExtension from "./textExtension.js";

const TextExtension = createTextExtension();
const activeWires = [];

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function addLine(text, type = "peer") {
  const messages = document.getElementById("chatMessages");
  if (!messages) return;
  const line = document.createElement("div");
  line.className = `chat-line chat-line-${type}`;
  line.textContent = `[${timestamp()}] ${text}`;
  messages.appendChild(line);
  messages.scrollTop = messages.scrollHeight;
}

export function registerWire(wire, ip) {
  wire._chatIp = ip;
  wire.use(TextExtension);

  const ext = wire.campfire_chat;
  ext.on("peer_ready", (peerIp) => {
    document.getElementById("chatConsole").classList.remove("hidden");
    addLine(`${peerIp} joined the campfire`, "sys");
  });
  ext.on("message", (peerIp, text) => {
    addLine(`${peerIp}: ${text}`, "peer");
  });

  activeWires.push(wire);
  wire.on("close", () => {
    const idx = activeWires.indexOf(wire);
    if (idx !== -1) activeWires.splice(idx, 1);
  });
}

export function showChat() {
  document.getElementById("chatConsole").classList.remove("hidden");
}

export function resetChat() {
  activeWires.length = 0;
  const messages = document.getElementById("chatMessages");
  if (messages) messages.innerHTML = "";
  document.getElementById("chatConsole").classList.add("hidden");
}

export function broadcastMessage(text) {
  activeWires.forEach((wire) => {
    if (wire.campfire_chat) {
      wire.campfire_chat.send(text);
    }
  });
}

export function initChat() {
  const input = document.getElementById("chatInputField");
  const sendBtn = document.getElementById("chatSendBtn");

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    broadcastMessage(text);
    addLine(`you: ${text}`, "self");
    input.value = "";
  };

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
