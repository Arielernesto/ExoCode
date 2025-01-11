<script>
    import { onMount } from 'svelte';
    // import { ChevronDown, Menu, Bell, User } from 'lucide-svelte';
    import { BellOutline as Bell, UserOutline as User, ChevronDownOutline as ChevronDown, HomeSolid as Menu} from 'flowbite-svelte-icons'
    let isSidebarOpen = false;
    let currentPage = 'Dashboard';
  
    const toggleSidebar = () => {
      isSidebarOpen = !isSidebarOpen;
    };
  
    const navItems = [
      { name: 'Dashboard', icon: '📊' },
      { name: 'Analytics', icon: '📈' },
      { name: 'Orders', icon: '📦' },
      { name: 'Customers', icon: '👥' },
      { name: 'Settings', icon: '⚙️' },
    ];
  
    onMount(() => {
      // Aquí puedes agregar cualquier lógica que necesites ejecutar al montar el componente
    });
  </script>
  
  <div class="flex flex-col md:flex-row h-screen bg-indigo-50">
    <!-- Sidebar -->
    <aside class="bg-indigo-800 text-white w-full md:w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20">
      <nav>
        <ul class="space-y-2">
          {#each navItems as item}
            <li>
              <a
                href="#{item.name.toLowerCase()}"
                class="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 hover:text-white"
                class:bg-indigo-700={currentPage === item.name}
                on:click={() => {
                  currentPage = item.name;
                  if (window.innerWidth < 768) toggleSidebar();
                }}
              >
                {item.icon} {item.name}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </aside>
  
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-200">
        <div class="flex items-center">
          <button class="text-indigo-500 focus:outline-none md:hidden" on:click={toggleSidebar}>
            <Menu />
          </button>
          <h2 class="text-2xl font-semibold text-indigo-800 ml-4">{currentPage}</h2>
        </div>
        <div class="flex items-center gap-4">
          <button class="flex mx-4 text-indigo-600 focus:outline-none">
            <Bell />
          </button>
          <button class="flex items-center text-indigo-600 focus:outline-none">
            <User />
            <ChevronDown class="ml-1" />
          </button>
        </div>
      </header>
  
      <!-- Main content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-indigo-100 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <h3 class="text-xl font-semibold mb-4 text-indigo-800">Card 1</h3>
            <p class="text-indigo-600">This is some content for card 1.</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
            <h3 class="text-xl font-semibold mb-4 text-indigo-800">Card 2</h3>
            <p class="text-indigo-600">This is some content for card 2.</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <h3 class="text-xl font-semibold mb-4 text-indigo-800">Card 3</h3>
            <p class="text-indigo-600">This is some content for card 3.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
  
  <style>
    /* Estilos adicionales si son necesarios */
  </style>