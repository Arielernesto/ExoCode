<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { Send, Menu, Phone, Video, MoreVertical, MessageCircle } from 'lucide-svelte';
  import { Input } from 'lib/components/ui/input';
  import { Button } from 'lib/components/ui/button';
  import { scrollToBottom } from 'utils/chat/scrollToBottom';
  import { Avatar, AvatarImage, AvatarFallback } from 'lib/components/ui/avatar';
  import ChatBubble from './ChatBubble.svelte';
  import { user as User, selectedChat as SelectedChat, messages as Messages, lastMessages } from 'store/store';
  import { formatLastSeen } from 'utils/chat/chat';
  import PrivateMessage from 'lib/chat/sockets/events/privateMessage';

  export let selectedChat;
  export let toggleMobileMenu;
  let inputMessage = '';
  let currentUser = null;
  let isTyping = false;
  let messagesEndRef;
  let messages1 = [];
  let replyingTo = null;

  Messages.subscribe((value) => {
    messages1 = value;
  });

  User.subscribe((value) => {
    currentUser = value;
  });

  SelectedChat.subscribe((value) => {
    selectedChat = value;
  });

  onMount(() => {
    scrollToBottom();
  });

  afterUpdate(() => {
    scrollToBottom();
  });

  function handleSendMessage(e) {
    e.preventDefault();
    if (inputMessage.trim()) {
      PrivateMessage(selectedChat, inputMessage, isTyping, replyingTo);
      inputMessage = '';
      scrollToBottom();
    }
  }
</script>

{#if !selectedChat}
  <div class="flex-1 flex items-center justify-center bg-white">
    <div class="text-center">
      <MessageCircle class="mx-auto h-12 w-12 text-purple-300" />
      <p class="mt-2 text-purple-400">Select a chat to start messaging</p>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full bg-white">
    <div class="bg-purple-100 p-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="icon" class="md:hidden" on:click={toggleMobileMenu}>
          <Menu class="h-6 w-6" />
        </Button>
        <Avatar>
          <AvatarImage src={selectedChat.avatar} alt={selectedChat.username} />
          <AvatarFallback>{selectedChat.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 class="font-semibold">{selectedChat.username}</h2>
          <span class="text-sm text-purple-400">{selectedChat.status === "online"
            ? "En línea"
            : formatLastSeen(selectedChat.lastConnection)}</span>
        </div>
      </div>
      <div class="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Phone class="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video class="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical class="h-5 w-5" />
        </Button>
      </div>
    </div>
    <div class="flex-1 p-4 overflow-y-auto">
      {#each messages1 as message (message._id)}
        <ChatBubble
          message={message.content}
          isOwnMessage={message.isSender}
          timestamp={message.createdAt}
          status={message.messageStatus}
          replyTo={message.replyTo ? { author: message.replyTo.sender.username, content: message.replyTo.content } : null}
        />
      {/each}
      <div id="messagesEndRef" bind:this={messagesEndRef}></div>
      {#if isTyping}
        <div class="text-purple-400 text-sm">
          {selectedChat.username} is typing...
        </div>
      {/if}
    </div>
    <form on:submit={handleSendMessage} class="p-4 bg-purple-50">
      <div class="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          class="flex-1 bg-white text-purple-500 placeholder-purple-300"
          bind:value={inputMessage}
        />
        <Button type="submit" class="bg-purple-500 hover:bg-purple-600">
          <Send class="h-4 w-4" />
        </Button>
      </div>
    </form>
  </div>
{/if}
