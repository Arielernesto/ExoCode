import { lastMessage as LastMessage } from "store/store";
import socket from "../socket"

const LastMessageHandle = (selectedChat) => {
    socket.emit("get-last-message", { userId: selectedChat.id });

    socket.off("last-message-received");

    socket.on("last-message-received", ({ userId, message }) => {
        LastMessage.set({
            userId,
            message
        })
        });
}

export default LastMessageHandle;