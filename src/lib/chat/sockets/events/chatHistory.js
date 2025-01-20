import socket from '../socket';
import { user as User } from "store/store";


const ChatHistory = (selectedChat) => {
  let currentUser = null;

User.subscribe((value) => {
  currentUser = value;
});
  
  socket.emit("get-chat-history", { recipientId: selectedChat.id });
  // Marcar mensajes como leídos
  socket.emit('read-messages', {
    senderId: selectedChat.id,
    recipientId: currentUser.id
});
};

export default ChatHistory;
