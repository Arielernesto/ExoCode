<script>
  import { user as User } from "store/store";
  import * as Avatar from "lib/components/ui/avatar";
  import * as DropdownMenu from "lib/components/ui/dropdown-menu/index.ts";
  import Dropdown from "components/ui/dropdown-menu.svelte"
  import {
      LayoutGridIcon,
      TrashIcon,
      Building2,
      UserCircleIcon,
      ChevronRightIcon,
      BellIcon,
    } from "lucide-svelte";
  let user = $state(null)
  User.subscribe(value => {
    user = value
    console.log(user)
  })

    $effect(() => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('nav')
    let isMenuOpen = false;
    console.log(menuToggle, mobileMenu)
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        console.log("Clck")
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
          navbar?.classList.add("pb-2")
          mobileMenu.style.maxHeight = `${mobileMenu.scrollHeight}px`;
          mobileMenu.style.opacity = '1';
        } else {
          navbar?.classList.remove("pb-2")
          mobileMenu.style.maxHeight = '0';
          mobileMenu.style.opacity = '0';
        }
      });
    }
    })
    const items = [
      { icon: UserCircleIcon, name: "Perfil" },
      { icon: LayoutGridIcon, name: "Dashboard" },
      { icon: Building2, name: "Inbox" },
      {
        icon: TrashIcon,
        name: "Cerrar Sesión",
        customStyle:
          "!text-red-500 hover:bg-red-500/10 focus-visible:text-red-500 focus-visible:bg-red-500/10 focus-visible:border-red-500/10",
      },
    ];
</script>


<header class="fixed inset-x-0 top-0  mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg z-[1000]">
    <nav class="px-4" id="nav">
      <div class="flex items-center justify-between">
        <div class="flex shrink-0">
          <a href="/" class="flex items-center">
            <span class="text-purple-500 font-bold text-xl">ExoCode</span>
            <span class="sr-only">ExoCode</span>
          </a>
        </div>
        <div class="hidden md:flex md:items-center md:justify-center md:gap-5 flex-grow">
          <div class="flex justify-center space-x-5 w-full">
            <a href="/projects" class="nav-link">Proyectos</a>
            <a href="/about" class="nav-link">Nosotros</a>
            <a href="/contact" class="nav-link">Contacto</a>
            <a href="/blog" class="nav-link">Blog</a>
          </div>
        </div>
        {#if !user}
        <div class="hidden md:flex items-center justify-end gap-3">
          <a href="/auth/register" class="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex">
            Sign in
          </a>
          <a href="/auth/login" class="inline-flex items-center justify-center rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
            Login
          </a>
        </div>
        {:else}
        <Dropdown items={items} className="hidden md:block">
          <Avatar.Root>
            <!-- <Avatar.Image src="" alt="@shadcn" /> -->
            <Avatar.Fallback class="bg-gray-200">{user?.username.charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar.Root>
        </Dropdown>
        {/if}
      
        <div class="md:hidden flex gap-x-2">
          {#if user}
          <Dropdown items={items}  className="block md:hidden">
            <Avatar.Root>
              <!-- <Avatar.Image src="" alt="@shadcn" /> -->
              <Avatar.Fallback class="bg-gray-200">{user?.username.charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar.Root>
          </Dropdown>
          {/if}
          <button id="menu-toggle" class="text-gray-500 hover:text-gray-600 focus:outline-none" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
    <div id="mobile-menu" class="md:hidden overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0">
      <div class="px-4 py-2 bg-white border-t border-gray-100">
        <div class="flex flex-col gap-2 relative z-[1002]">
          <a href="/projects" class="nav-link mobile">Proyectos</a>
          <a href="/about" class="nav-link mobile">Nosotros</a>
          <a href="/contact" class="nav-link mobile">Contacto</a>
          <a href="/blog" class="nav-link mobile">Blog</a>
          {#if !user}
            <a href="/auth/register" class="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50">
            Sign in
          </a>
          <a href="/auth/login" class="inline-flex items-center justify-center rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 relative z-[1002]">
            Login
          </a>
          {/if} 
        </div>
      </div>
    </div>
  </header>
  
  <style>
    .nav-link {
      display: inline-block;
      border-radius: 0.5rem;
      padding: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
      transition: all 0.2s;
    }
    .nav-link:hover {
      color: #8b5cf6;
    }
    .nav-link.mobile {
      width: 100%;
    }
    .nav-link.mobile:hover {
      background-color: #f3f4f6;
    }
  </style>