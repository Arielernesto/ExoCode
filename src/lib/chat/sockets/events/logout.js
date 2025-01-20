import socket from "../socket";

function logout() {
    if (socket && socket.connected) {
      socket.emit("logout");
      socket.disconnect();
    }
}
export default logout;