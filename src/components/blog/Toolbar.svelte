<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  import { Bell, Globe, Gauge, FileCode, Cpu, X } from 'lucide-svelte';

  let isHovered = false;
  let isOpen = false;
  let activeTab = 'info';
  let y = spring(60, { stiffness: 0.2, damping: 0.4 });

  // Actualiza la posición del botón flotante
  $: if (isOpen) {
    y.set(0);
  } else if (isHovered) {
    y.set(20);
  } else {
    y.set(60);
  }

  let timeout: number;

  // Gestiona el estado de hover
  $: {
    if (isHovered || isOpen) {
      clearTimeout(timeout);
    } else {
      timeout = setTimeout(() => {
        isHovered = false;
      }, 3000);
    }
  }

  onMount(() => {
    return () => clearTimeout(timeout);
  });

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function setTab(tab: string) {
    activeTab = tab;
    isOpen = true;
  }
</script>

<div class="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
  {#if isOpen}
    <div
      transition:scale={{ duration: 200, start: 0.9 }}
      class="absolute bottom-24 bg-slate-800 rounded-lg shadow-lg p-6 w-96 pointer-events-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-white">Development Tools</h3>
        <button
          on:click={() => (isOpen = false)}
          class="text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div class="space-y-4">
        {#if activeTab === 'info'}
          <div class="space-y-2">
            <p class="text-slate-300">Page: /blog/create</p>
            <p class="text-slate-300">Route: /blog/[slug]</p>
            <p class="text-slate-300">Svelte version: 4.0.0</p>
          </div>
        {:else if activeTab === 'performance'}
          <div class="space-y-2">
            <p class="text-slate-300">Load time: 245ms</p>
            <p class="text-slate-300">First Contentful Paint: 0.8s</p>
            <p class="text-slate-300">Time to Interactive: 1.2s</p>
          </div>
        {:else if activeTab === 'network'}
          <div class="space-y-2">
            <p class="text-slate-300">Requests: 12</p>
            <p class="text-slate-300">Transferred: 256 KB</p>
            <p class="text-slate-300">Resources: 8</p>
          </div>
        {:else if activeTab === 'components'}
          <div class="space-y-2">
            <p class="text-slate-300">Total components: 24</p>
            <p class="text-slate-300">Server components: 15</p>
            <p class="text-slate-300">Client components: 9</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <div
    style="transform: translateY({$y}px)"
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => !isOpen && (isHovered = false)}
    class="bg-slate-900 rounded-full px-4 py-3 shadow-lg flex items-center space-x-3 pointer-events-auto"
  >
    <button
      class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors duration-200 ease-in-out"
      on:click={toggleOpen}
    >
      <Bell size={20} />
      <span class="sr-only">Notifications</span>
    </button>
    <button
      class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors duration-200 ease-in-out"
      on:click={() => setTab('network')}
    >
      <Globe size={20} />
      <span class="sr-only">Network</span>
    </button>
    <button
      class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors duration-200 ease-in-out"
      on:click={() => setTab('performance')}
    >
      <Gauge size={20} />
      <span class="sr-only">Performance</span>
    </button>
    <button
      class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors duration-200 ease-in-out"
      on:click={() => setTab('components')}
    >
      <FileCode size={20} />
      <span class="sr-only">Components</span>
    </button>
    <button
      class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors duration-200 ease-in-out"
      on:click={() => setTab('info')}
    >
      <Cpu size={20} />
      <span class="sr-only">System Info</span>
    </button>
  </div>
</div>

<style>
  /* Estilos globales */
</style>