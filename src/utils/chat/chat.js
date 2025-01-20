const notificationSound = new Audio('/livechat-129007.mp3')
// Función para formatear la última conexión
const formatLastSeen = (date) => {
  const lastSeenDate = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now - lastSeenDate) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `últ. vez hoy a las ${formatTime(lastSeenDate)}`;
  } else if (diffInHours < 48) {
    return `últ. vez ayer a las ${formatTime(lastSeenDate)}`;
  } else {
    const options = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return `últ. vez ${lastSeenDate.toLocaleDateString("es-ES", options)}`;
  }
};
//Función mejorada para formatear la hora
const formatTime = (date) => {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Esto habilita el formato AM/PM
  };
  return new Date(date)
    .toLocaleTimeString("es-ES", options)
    .replace(/\:/g, ":")
    .replace("AM", "a.m.")
    .replace("PM", "p.m.");
};

function getLastMessage(contact, lastMessages) {
  const lastMessage = lastMessages.find(
    (msg) => msg.sender._id === contact.id || msg.recipient._id === contact.id
  );

  return lastMessage
    ? lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + "..."
      : lastMessage.content
    : "No hay mensajes aún";
}

function getLastMessageTime(contact, lastMessages) {
  const lastMessage = lastMessages.find(
    (msg) => msg.sender._id === contact.id || msg.recipient._id === contact.id
  );

  return lastMessage ? formatTime(lastMessage.createdAt) : "";
}
function playNotificationSound() {
  notificationSound.play().catch((err) => {
    console.error("Error al reproducir sonido:", err);
  });
}

export { formatLastSeen, formatTime, getLastMessage, getLastMessageTime,playNotificationSound };
