<script lang="ts">
  import { writable } from 'svelte/store';
  import Sidebar from './Sidebar.svelte';
  import ChatArea from './ChatArea.svelte';

  let selectedChat = writable(null);
  let isMobileMenuOpen = writable(false);

  function toggleMobileMenu() {
    isMobileMenuOpen.update(value => !value);
  }
</script>

<div class="flex h-screen bg-white text-purple-500">
  <div class:hidden={!$isMobileMenuOpen} class="md:block md:w-80 lg:w-96 flex-shrink-0">
    <Sidebar on:selectChat={(event) => {
      selectedChat.set(event.detail);
      isMobileMenuOpen.set(false);
    }} />
  </div>
  <div class="flex-grow">
    <ChatArea 
      selectedChat={$selectedChat} 
      {toggleMobileMenu}
    />
  </div>
</div>

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }
</style>