export function scrollToBottom() {
    const messagesEndRef = document.querySelector('#messagesEndRef');
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }