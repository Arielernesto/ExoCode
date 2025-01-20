import { io } from "socket.io-client";
import addMessage from "utils/chat/addMessage";
import { selectedChat as SelectedChat } from "store/store";
import getLastMessages from "utils/chat/getLastMessages";
import { lastMessages, messages as Messages, user as User, unreadcount as UnreadCount , usersList as UsersList } from "store/store";
import { scrollToBottom } from "utils/chat/scrollToBottom";
import { playNotificationSound } from "utils/chat/chat";
import UnreadCounts from "./events/unreadCount";

let selectedChat = null;
let currentUser = null;
let usuarios = [];

User.subscribe((value) => {
  currentUser = value;
});
SelectedChat.subscribe((value) => {
  selectedChat = value;
});
UsersList.subscribe((value)=>{
  usuarios = value;
})

const socket = io(import.meta.env.PUBLIC_API_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket conectado");

  socket.off("message-status-update");
  socket.on("message-status-update", ({ messageId, status }) => {
    console.log('Actualizando estado del mensaje:', messageId, status);
    Messages.update(messages => {
      const updatedMessages = messages.map(msg => {
        if (msg._id === messageId) {
          console.log(`Actualizando mensaje ${messageId} a estado ${status}`);
          return { ...msg, messageStatus: status };
        }
        return msg;
      });
      return updatedMessages;
    });
  });

  socket.off("new-message"); // Desregistrar cualquier evento previo
  socket.on("new-message", async (message) => {
    const listLastMessages = await getLastMessages();
    lastMessages.set([...listLastMessages]);

    // Actualizar contador de no leídos
    if (!message.isSender && (!selectedChat || selectedChat.id !== message.sender._id)) {
      console.log("Emitiendo contador de no leídos");
      socket.emit("get-unread-count", { userId: message.sender._id });
    }

    // Si el chat está activo, marcar como leído inmediatamente
    if (selectedChat && selectedChat.id === message.sender._id) {
      console.log('Chat abierto, marcando como leído');
      socket.emit("read-messages", {
        senderId: message.sender._id,
        recipientId: currentUser.id,
        messageIds: [message._id],
      });
    }

    if (selectedChat && (message.sender._id === selectedChat.id || message.recipient._id === selectedChat.id)) {
      console.log("Nuevo mensaje recibido");
     socket.emit("get-chat-history", { recipientId: selectedChat.id });

      /*console.log(selectedChat.status)
      if(selectedChat.status==="online" && message.isSender){
        addMessage(message,'delivered');
        console.log('agragnado como entregado')
      }
      
      if(selectedChat.status!=="online"){
        addMessage(message,'sent');
        console.log('agregando como sent')
      }*/
      // Si no es un mensaje propio y el chat está activo, marcarlo como leído
      if (!message.isSender) {
        console.log('Marcando como leído');
        socket.emit("read-messages", {
          senderId: message.sender._id,
          messageIds: [message._id],
        });
      }
      return;
    }

    if (!message.isSender && message.shouldPlaySound) {
      playNotificationSound();
      console.log('🔔 Sonando notificación');
      UnreadCounts(usuarios)
      // Marcar como entregado ya que el usuario está conectado pero en otro chat
      socket.emit("message-delivered", {
        senderId: message.sender._id,
        messageId: message._id,
      });
    }
  });

  // Eliminar el listener anterior para evitar múltiples llamadas
  socket.off("chat-history");
  socket.on("chat-history", (chatMessages) => {
    Messages.update((messages) => {
      messages.length = 0; // Limpiar mensajes anteriores
      chatMessages.forEach((message) => {
        messages.push({
          ...message,
          isSender: message.sender._id === currentUser.id,
        });
      });
      return messages;
    });

    scrollToBottom();
  });

  // Escuchar cuando los mensajes son leídos
  socket.off("messages-read");
  socket.on("messages-read", (data) => {
    console.log("Datos de mensajes leídos recibidos:", data);

    if (!data || !data.messageIds) {
      console.log("No hay mensajes para marcar como leídos");
      return;
    }
    // Asegurarnos de que messageIds sea un array
    const messageIds = Array.isArray(data.messageIds)
      ? data.messageIds
      : [data.messageIds];
    console.log("Actualizando estados de mensajes:", messageIds);

    Messages.update((messages) => {
      const updatedMessages = messages.map((msg) => {
        if (messageIds.includes(msg._id)) {
          console.log(`Marcando mensaje ${msg._id} como leído`);
          return { ...msg, messageStatus: "read" };
        }
        return msg;
      });
      return updatedMessages;
    });
  });

  // Agregar manejo específico para mensajes entregados
  socket.off("message-delivered");
  socket.on("message-delivered", ({ messageId }) => {
    console.log("Mensaje marcado como entregado:", messageId);

    Messages.update((messages) => {
      const updatedMessages = messages.map((msg) => {
        if (msg._id === messageId) {
          return { ...msg, messageStatus: "delivered" };
        }
        return msg;
      });
      return updatedMessages;
    });
  });

  socket.on("user-status-change", ({ userId, status, lastConnection }) => {
    console.log("Estado de usuario cambiado:", userId, status, lastConnection);
  
      // Encuentra el usuario en el arreglo y actualiza su estado y última conexión
      const userIndex = usuarios.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
          usuarios[userIndex].status = status;
          usuarios[userIndex].lastConnection = lastConnection;
      } else {
          console.log("Usuario no encontrado en el arreglo");
      }
      UsersList.update(()=>{
        return usuarios;
        }
      )
  });

  socket.off("users-list");
  socket.on("users-list", async () => {
    socket.off("message-status-update");
    socket.on("message-status-update", ({ messageId, status }) => {
      console.log("Actualizando estado del mensaje:", messageId, status);
      Messages.update((messages) => {
        const updatedMessages = messages.map((msg) => {
          if (msg._id === messageId) {
            return { ...msg, status };
          }
          return msg;
        });
        return updatedMessages;
      });
    });
  });
});

export default socket;