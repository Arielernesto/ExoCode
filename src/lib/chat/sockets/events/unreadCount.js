
import {unreadcount as UnreadCount, user as User} from 'store/store';
import socket from '../socket';


const UnreadCounts = (users) => {

let currentUser= null;
User.subscribe(value => {
  currentUser = value;
}) 
if (currentUser && currentUser.id) {
    UnreadCount.update(unreadcount => {
      unreadcount.length = 0; // Clear the existing unread counts
      return unreadcount;
    });
}
users.forEach(user => {
  socket.emit("get-unread-count", { userId: user.id });

  socket.off("unread-count");

  socket.on("unread-count-received", ({ userId, count }) => {
  UnreadCount.update(unreadcount => {
    unreadcount.push({
      chatId: userId,
      count,
    });
    return unreadcount;
    });
    
  });
});
}
export default UnreadCounts;