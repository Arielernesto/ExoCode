// Variables globales
import { io } from 'socket.io-client'
let currentUser = null;
let selectedChat = null;
let socket = null;
let typingTimeout;

const notificationSound = new Audio("./livechat-129007.mp3"); // Ajusta la ruta a tu archivo de sonido

const loginForm = document.getElementById("login-form");
const chatInterface = document.getElementById("chat-interface");
const usersList = document.getElementById("users-list");
const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const typingSpan = document.getElementById("typing");
const currentUserName = document.getElementById("current-user-name");
const currentUserAvatar = document.getElementById("current-user-avatar");
const chatUserName = document.getElementById("chat-user-name");
const chatUser = document.getElementById("chat-user");
const avatarChat = document.getElementById("chat-avatar");

// Agregar botón de logout con estilos
const logoutButton = document.createElement("button");
logoutButton.id = "logout-button";
logoutButton.textContent = "Cerrar Sesión";
logoutButton.className = "logout-btn";
document.querySelector(".user-profile").appendChild(logoutButton);

// Agregar estilos para el botón de logout
const styles = document.createElement("style");
styles.textContent = `

@keyframes typingDots {
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
    87% { content: '....'; }
    100% { content: ''; }
}

.typing-indicator::after {
    content: '';
    display: inline-block;
    animation: typingDots 1.5s infinite;
}
    .logout-btn {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
        margin-left: 10px;
    }

    .logout-btn:hover {
        background-color: #c82333;
    }
        .message-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    font-size: 0.7em;
    margin-top: 2px;
}

    .message {
        max-width: 70%;
        padding: 12px 15px;
        border-radius: 15px;
        margin: 8px 0;
        position: relative;
        word-wrap: break-word;
    }

    .message.sent {
        background-color: #868fe2;
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 5px;
    }

    .message.received {
        background-color: #e9ecef;
        color: #343a40;
        margin-right: auto;
        align-self: flex-start;
         border-bottom-left-radius: 5px;
         box-shadow: 0 1px 2px rgba(0,0,0,0.1);
       
    }

    .message-time {
        font-size: 0.75rem;
        opacity: 0.7;
        margin-top: 4px;
    }

    .message-sender {
        font-size: 0.8rem;
        font-weight: bold;
        margin-bottom: 4px;
    }
        .message-status {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    font: bold;
}
.Desconectado{
color:rgb(246, 28, 28);
}


.message.sent .message-status {
    margin-left: 4px;
}

    .chat-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #6c757d;
        text-align: center;
        padding: 20px;
    }
`;
document.head.appendChild(styles);
//Agregando iniciales
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
//Formateando la hora
function formatTime(date) {
  return new Date(date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function getMessageStatusIcon(status) {
  const iconStyle =
    status === "read" ? 'style="color: green;"' : 'style="color: white;"';
  switch (status) {
    case "read":
      return `<span class="message-status" ${iconStyle}>
                        <i class="fas fa-check"></i> <i class="fas fa-check"></i>
                    </span>`;
    case "delivered":
      return `<span class="message-status" ${iconStyle}>
                        <i class="fas fa-check"></i> <i class="fas fa-check"></i>
                    </span>`;
    case "sent":
    default:
      return `<span class="message-status" ${iconStyle}>
                        <i class="fas fa-check"></i>
                    </span>`;
  }
}
// Gestiónar la lista de los usuarios
function updateUsersList(users) {
  usersList.innerHTML = "";

  if (!users || users.length === 0) {
    usersList.innerHTML =
      '<div class="no-users">No hay usuarios disponibles</div>';
    return;
  }

  const currentUserId = currentUser.id;

  users
    .filter((user) => user.id !== currentUserId)
    .forEach((user) => {
      const userElement = document.createElement("div");
      userElement.className = `user-item ${
        selectedChat?.id === user.id ? "active" : ""
      }`;
      userElement.dataset.userId = user.id;

      const userData = {
        id: user.id,
        name: `${user.username} ${user.lastname}`,
        username: user.username,
        lastname: user.lastname,
        status: user.status,
      };

      userElement.innerHTML = `
                <div class="user-avatar">${getInitials(userData.name)}</div>
                <div class="user-info">
                    <h4>${userData.name}</h4>
                    <span class="status-badge ${
                      userData.status === "online"
                        ? "status-online"
                        : "status-offline"
                    }">
                        ${
                          userData.status === "online"
                            ? "En línea"
                            : "Desconectado"
                        }
                    </span>
                </div>
            `;

      userElement.onclick = () => selectChat(userData);
      usersList.appendChild(userElement);
    });
}

// Gestión de mensajes y chat
function initializeSocket(token) {
  socket = io("http://localhost:4000", {
    auth: { token },
    withCredentials: true,
  });

  // Agregar los event listeners una vez que el socket esté conectado
  socket.on("connect", () => {
    console.log("Socket conectado");
    messageInput.addEventListener("input", () => {
      if (!selectedChat) return; // No hacer nada si no hay chat seleccionado

      // Emitir evento typing
      socket.emit("typing", {
        recipientId: selectedChat.id,
      });

      // Limpiar timeout anterior si existe
      if (typingTimeout) clearTimeout(typingTimeout);

      // Establecer nuevo timeout
      typingTimeout = setTimeout(() => {
        socket.emit("stop-typing", {
          recipientId: selectedChat.id,
        });
      }, 1500);
    });

    // Escuchar eventos de typing
    socket.on("user-typing", ({ senderId, senderName }) => {
      if (selectedChat && selectedChat.id === senderId) {
        typingSpan.textContent = "escribiendo";
        typingSpan.className = "typing-indicator";
      }
    });

    socket.on("user-stop-typing", ({ senderId }) => {
      if (selectedChat && selectedChat.id === senderId) {
        typingSpan.textContent = "";
        typingSpan.className = "";
      }
    });

    // Limpiar el indicador de typing cuando se envía el mensaje
    messageForm.addEventListener("submit", () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      socket.emit("stop-typing", {
        recipientId: selectedChat?.id,
      });
    });

    socket.on("message-status-update", ({ messageId, status }) => {
      const messageEl = document.querySelector(
        `[data-message-id="${messageId}"]`
      );
      if (messageEl) {
        const statusEl = messageEl.querySelector(".message-status");
        if (statusEl) {
          statusEl.outerHTML = getMessageStatusIcon(status);
        }
      }
    });

    socket.on("messages-read", ({ messageIds }) => {
      messageIds.forEach((messageId) => {
        const messageEl = document.querySelector(
          `[data-message-id="${messageId}"]`
        );
        if (messageEl) {
          const statusEl = messageEl.querySelector(".message-status");
          if (statusEl) {
            statusEl.outerHTML = getMessageStatusIcon("read");
          }
        }
      });
    });
  });

  socket.on("users-list", (users) => {
    updateUsersList(users);
  });

  socket.on("new-message", (message) => {
    // Verificar si hay un chat seleccionado y si corresponde al mensaje
    if (
      selectedChat &&
      (message.sender._id === selectedChat.id ||
        message.recipient._id === selectedChat.id)
    ) {
      // Si el chat está activo, agregar mensaje
      addMessage({
        ...message,
        sender: {
          ...message.sender,
          _id: message.sender._id,
        },
        recipient: {
          ...message.recipient,
          _id: message.recipient._id,
        },
      });

      // Si no es un mensaje propio y el chat está activo, marcarlo como leído
      if (!message.isSender) {
        socket.emit("read-messages", {
          senderId: message.sender._id,
          messageIds: [message._id],
        });
      }
      return;
    }
    if (!message.isSender && message.shouldPlaySound) {
      playNotificationSound();

      // Marcar como entregado ya que el usuario está conectado pero en otro chat
      socket.emit("message-delivered", {
        senderId: message.sender._id,
        messageId: message._id,
      });
    }
  });

  socket.on("chat-history", (messages) => {
    messagesContainer.innerHTML = "";
    if (messages.length === 0) {
      messagesContainer.innerHTML = `
                <div class="chat-empty-state">
                    <p>No hay mensajes aún</p>
                    <small>Envía un mensaje para comenzar la conversación</small>
                </div>
            `;
      return;
    }
    messages.forEach((message) => {
      addMessage({
        ...message,
        isSender: message.sender._id === currentUser.id,
      });
    });
    scrollToBottom();
  });

  socket.on("error", (error) => {
    console.error("Error del servidor:", error);
    alert(error.message);
  });
  socket.on("user-status-change", ({ userId, status }) => {
    // Actualizar el estado si es el usuario seleccionado actualmente
    if (selectedChat && selectedChat.id === userId) {
      let estado = status === "online" ? "En linea" : "Desconectado";
      chatUser.textContent = estado;
      chatUser.className = estado;
    }

    // También actualizar en la lista de usuarios
    const userElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (userElement) {
      const statusElement = userElement.querySelector(".user-status");
      if (statusElement) {
        statusElement.textContent =
          status === "online" ? "En linea" : "Desconectado";
        statusElement.className = `user-status ${status}`;
      }
    }
  });

  socket.on("message-status-update", ({ messageId, status }) => {

    if (messageId) {
      // Si tenemos ID, actualizamos ese mensaje específico
      const messageEl = document.querySelector(
        `[data-message-id="${messageId}"]`
      );
      if (messageEl) {
        const statusEl = messageEl.querySelector(".message-status");
        if (statusEl) {
          statusEl.innerHTML = getMessageStatusIcon(status);
        }
      }
    }
  });
}

function selectChat(user) {
  selectedChat = {
    id: user.id,
    name: `${user.username} ${user.lastname}`,
    status: user.status,
  };
  if (!selectedChat) {
    avatarChat.style = "display:none";
  } else {
    avatarChat.style = "display:block";
  }
  chatUserName.textContent = selectedChat.name;
  let estado = selectedChat.status === "online" ? "En linea" : "Desconectado";
  chatUser.textContent = estado;
  chatUser.className = estado;
  // Actualizar UI
  document.querySelectorAll(".user-item").forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.userId === selectedChat.id) {
      item.classList.add("active");
    }
  });

  // Limpiar mensajes anteriores y mostrar estado de carga
  messagesContainer.innerHTML =
    '<div class="chat-empty-state">Cargando mensajes...</div>';

  // Solicitar historial de chat
  socket.emit("get-chat-history", { recipientId: selectedChat.id });
}

// Modificar la función addMessage existente
function addMessage(message) {
  const messageElement = document.createElement("div");
  const isCurrentUser = message.sender._id === currentUser.id;
  messageElement.className = `message ${isCurrentUser ? "sent" : "received"}`;
  messageElement.dataset.messageId = message._id; // Agregar ID del mensaje

  const senderName = isCurrentUser
    ? "Tú"
    : `${message.sender.username} ${message.sender.lastname}`;

  messageElement.innerHTML = `
        <div class="message-content">
            <small class="message-sender">${senderName}</small>
            <p>${message.content}</p>
            <div class="message-info">
                <span class="message-time">${formatTime(
                  message.createdAt
                )}</span>
                ${
                  isCurrentUser
                    ? getMessageStatusIcon(message.messageStatus)
                    : ""
                }
            </div>
        </div>
    `;

  messagesContainer.appendChild(messageElement);
  scrollToBottom();
}

function playNotificationSound() {
  notificationSound.play().catch((err) => {
    console.error("Error al reproducir sonido:", err);
  });
}

// Event Listeners
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:4000/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: `
                    mutation Login($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                            token
                            id
                            name
                            email
                        }
                    }
                `,
        variables: { email, password },
      }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(errors[0].message);
    }

    if (data.login) {
      localStorage.setItem("user", JSON.stringify(data.login));
      currentUser = data.login;

      loginForm.style.display = "none";
      chatInterface.style.display = "flex";
      currentUserName.textContent = currentUser.name;
      currentUserAvatar.textContent = getInitials(currentUser.name);

      initializeSocket(data.login.token);
    }
  } catch (error) {
    alert("Error de login: " + error.message);
    console.error("Error de login:", error);
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedChat) {
    alert("Por favor selecciona un usuario para chatear");
    return;
  }

  const content = messageInput.value.trim();
  if (content) {
    socket.emit("private-message", {
      recipientId: selectedChat.id,
      content: content,
    });
    messageInput.value = "";
  }
});

logoutButton.addEventListener("click", logout);

function logout() {
  if (socket && socket.connected) {
    socket.emit("logout");
    socket.disconnect();
  }

  localStorage.removeItem("user");
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload();
}

// Verificación inicial de usuario
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      currentUser = JSON.parse(userData);
      loginForm.style.display = "none";
      chatInterface.style.display = "flex";
      currentUserName.textContent = currentUser.name;
      currentUserAvatar.textContent = getInitials(currentUser.name);

      const token = document.cookie.split("=")[1];
      if (token) {
        initializeSocket(token);
      } else {
        console.error("No se encontró token en las cookies");
        logout();
      }
    }
  } catch (error) {
    console.error("Error en DOMContentLoaded:", error);
    logout();
  }
});
