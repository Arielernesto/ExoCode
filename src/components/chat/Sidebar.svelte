<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Search } from 'lucide-svelte';
    import { Input } from 'lib/components/ui/input';
    import { Avatar, AvatarImage, AvatarFallback } from 'lib/components/ui/avatar';
  
    const dispatch = createEventDispatcher();
  
    let searchTerm = '';
  
    const contacts = [
      { id: 1, name: 'Alice Johnson', lastMessage: 'Hey, how are you?', time: '10:30 AM', unread: 2, avatar: '/avatars/alice.jpg' },
      { id: 2, name: 'Bob Smith', lastMessage: 'Can we meet tomorrow?', time: 'Yesterday', unread: 0, avatar: '/avatars/bob.jpg' },
      { id: 3, name: 'Charlie Brown', lastMessage: 'Sure, no problem!', time: 'Monday', unread: 1, avatar: '/avatars/charlie.jpg' },
    ];
  
    $: filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    function selectChat(contact) {
      dispatch('selectChat', contact);
    }
  </script>
  
  <div class="h-full bg-purple-50 border-r border-purple-200">
    <div class="p-4 bg-purple-100">
      <div class="relative">
        <Search class="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-400" />
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
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <h3 class="font-semibold">{contact.name}</h3>
                <span class="text-xs text-purple-400">{contact.time}</span>
              </div>
              <p class="text-sm text-purple-400 truncate">{contact.lastMessage}</p>
            </div>
          </div>
          {#if contact.unread > 0}
            <div class="mt-2 flex justify-end">
              <span class="inline-flex items-center justify-center bg-purple-500 text-white rounded-full w-5 h-5 text-xs">
                {contact.unread}
              </span>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  