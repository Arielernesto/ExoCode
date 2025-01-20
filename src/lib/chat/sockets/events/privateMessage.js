import socket from "../socket";

const PrivateMessage = async(selectedChat, messageInput, isTyping, replyingTo) => {
    const content = messageInput;

    if (selectedChat) {
        const typingTimeout = setTimeout(() => isTyping = false, 3000);
        () => clearTimeout(typingTimeout);
    }

    socket.emit("stop-typing", {
        recipientId: selectedChat?.id,
    });

    if (content && selectedChat) {
        const messageData = {
            recipientId: selectedChat.id,
            content: content,
            replyTo: replyingTo
        };

        socket.emit("private-message", messageData);
    }

    replyingTo = null;
}

export default PrivateMessage;