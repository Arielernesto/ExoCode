import { socket } from "store/store";
const UpdateStatus = ( messages)=>{

    socket.on('message-status-update', ({ messageId, status }) => {
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
          message.status = status;
        }
      });

}

export default UpdateStatus;