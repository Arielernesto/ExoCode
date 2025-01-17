<script lang="ts">
    import { onMount } from 'svelte';
    import { Send, Menu, Phone, Video, MoreVertical, MessageCircle } from 'lucide-svelte';
    import { Input } from 'lib/components/ui/input';
    import { Button } from 'lib/components/ui/button';
    import { Avatar, AvatarImage, AvatarFallback } from 'lib/components/ui/avatar';
    import ChatBubble from './ChatBubble.svelte';

    export let selectedChat;
    export let toggleMobileMenu;
  
    let inputMessage = '';
    let isTyping = false;
    let messagesEndRef;
  
    const messages = [
      { id: 1, sender: 'Alice', content: 'Hey, how are you?', time: '10:30 AM', replyTo: { author: "sd", content: "dawdadawd"} },
      { id: 2, sender: 'You', content: 'I\'m good, thanks! How about you?', time: '10:31 AM' },
      { id: 3, sender: 'Alice', content: 'Doing great! Any plans for the weekend?', time: '10:32 AM' },
    ];
  
    $: if (selectedChat) {
      const typingTimeout = setTimeout(() => isTyping = false, 3000);
      () => clearTimeout(typingTimeout);
    }
    function scrollToBottom() {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  
    onMount(() => {
      scrollToBottom();
    });
  

    function handleSendMessage(e) {
      e.preventDefault();
      if (inputMessage.trim()) {
        // Here you would typically send the message to your backend
        console.log('Sending message:', inputMessage);
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
            <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
            <AvatarFallback>{selectedChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 class="font-semibold">{selectedChat.name}</h2>
            <span class="text-sm text-purple-400">Online</span>
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
        {#each messages as message (message.id)}
        <ChatBubble
          message={message.content}
          isOwnMessage={message.sender === 'You'}
          timestamp={message.time}
          status={message.status}
          replyTo={message.replyTo}
        />
        {/each}
        {#if isTyping}
          <div class="text-purple-400 text-sm">
            {selectedChat.name} is typing...
          </div>
        {/if}
        <div bind:this={messagesEndRef}></div >
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
  
  