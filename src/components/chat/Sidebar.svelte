<script lang="ts">
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import { Search } from "lucide-svelte";
  import { Input } from "lib/components/ui/input";
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "lib/components/ui/avatar";
  import ListUser from "utils/chat/listUser";
  import ChatHistory from "lib/chat/sockets/events/chatHistory";
  import UnreadCounts from "lib/chat/sockets/events/unreadCount";
  import { selectedChat as SelectedChat,
    unreadcount as UnreadCount,
    messages as Messages,
    lastMessages as LastMessages,
    usersList as UsersList
  } from "store/store";
 
  import getLastMessages from "utils/chat/getLastMessages";
  import { getLastMessage, getLastMessageTime } from "utils/chat/chat";
  import CleanCount from "utils/chat/cleanCount";

  const dispatch = createEventDispatcher();
  let messages1 = [];
  let users = [];
  let searchTerm = "";
  let lastMessages = [];
  let unreadCounts = [];
  let selectedChat = null;
  UsersList.subscribe((value=>{
    users = value;
  }))

  $: filteredContacts = users.filter((contact) =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function selectChat(contact) {
    SelectedChat.set(contact);
    CleanCount(contact);
    ChatHistory(contact);
    dispatch("selectChat", contact);
  }

  SelectedChat.subscribe((value) => {
    selectedChat = value;
  });

  Messages.subscribe((value) => {
    messages1 = value;
  });

  LastMessages.subscribe((value) => {
    lastMessages = value;
  });

  onMount(async () => {
    try {
      lastMessages = await getLastMessages();
      const response = await ListUser();
      UsersList.set(response);
      UnreadCounts(users);
    } catch (error) {
      console.error("Error fetching users or last messages:", error);
    }
    
  });


  UnreadCount.subscribe((value) => {
    unreadCounts = value;
  });
</script>

<div class="h-full bg-purple-50 border-r border-purple-200">
  <div class="p-4 bg-purple-100">
    <div class="relative">
      <Search
        class="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-400"
      />
      <Input
        type="text"
        placeholder="Search contacts..."
        class="pl-8 bg-white text-purple-500 placeholder-purple-300"
        bind:value={searchTerm}
      />
    </div>
  </div>
  <div class="h-[calc(100vh-5rem)] overflow-y-auto">
    {#each filteredContacts as contact (contact.id)}
      <div
        class="p-4 hover:bg-purple-100 cursor-pointer transition-colors duration-200"
        on:click={() => selectChat(contact)}
      >
        <div class="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={contact.avatar} alt={contact.username} />
            <AvatarFallback>
              {contact.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div class="flex-grow">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">{contact.username}</h3>
              <span class="text-xs text-purple-400">
                {getLastMessageTime(contact, lastMessages)}
              </span>
            </div>
            <p class="text-sm text-purple-400 truncate">
              {getLastMessage(contact, lastMessages)}
            </p>
          </div>
          {#if unreadCounts.find((count) => count.chatId === contact.id)?.count > 0}
            <div class="mt-2 flex justify-end">
              <span
                class="inline-flex items-center justify-center bg-purple-500 text-white rounded-full w-5 h-5 text-xs"
              >
                {unreadCounts.find((count) => count.chatId === contact.id)?.count}
              </span>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

