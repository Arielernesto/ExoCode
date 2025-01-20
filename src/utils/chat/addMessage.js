import { messages as Messages, user as User } from 'store/store';

const addMessage = (message,status) => {
  let messages1 = [];
  let currentUser = null;

  // Subscribe to the messages and user stores
  const unsubscribeMessages = Messages.subscribe(value => {
    messages1 = value || [];
  });

  const unsubscribeUser = User.subscribe(value => {
    currentUser = value;
  });

  // Ensure messages1 is an array
  if (!Array.isArray(messages1)) {
    messages1 = [];
  }

  // Add the new message to the existing messages array
  messages1 = [...messages1, {
    ...message,
    isOwnMessage: message.sender._id === currentUser.id,
    messageStatus:status
  }];

  // Update the messages store
  Messages.set(messages1);

  // Unsubscribe from the stores
  unsubscribeMessages();
  unsubscribeUser();
};

export default addMessage;