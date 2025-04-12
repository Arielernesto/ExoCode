<script lang="ts">
  import { type Post } from "interfaces/BlogInterface";
  import { Query } from "lib/apollo-client";
  import { POSTS_QUERY } from "queries/post.ts";
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';

  let featuredPosts: Post[] = [];
  let isLoading = true;
  let error: any = null;
  let currentSlide = 0;
  let totalSlides = 0;
  let autoplayInterval: ReturnType<typeof setInterval>;
  let touchStartX = 0;
  let touchEndX = 0;
  
  onMount(() => {
    fetchFeaturedPosts();
    
    // Start autoplay
    autoplayInterval = setInterval(() => {
      if (totalSlides > 0) {
        currentSlide = (currentSlide + 1) % totalSlides;
      }
    }, 5000);
    
    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  });
  
  async function fetchFeaturedPosts() {
    try {
      const result = await Query(POSTS_QUERY);
      const { data } = result;
      if (data && 'posts' in data && Array.isArray(data.posts)) {
        // Get the first three posts as featured
        featuredPosts = data.posts.slice(0, 3);
        totalSlides = featuredPosts.length;
      }
    } catch (e) {
      console.error('Error fetching featured posts:', e);
      error = e;
    } finally {
      isLoading = false;
    }
  }
  
  function goToSlide(index: number) {
    currentSlide = index;
    // Reset autoplay timer when manually changing slides
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
    }, 5000);
  }
  
  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
  }
  
  function handleTouchEnd(e: TouchEvent) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped right
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    } else if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped left
      currentSlide = (currentSlide + 1) % totalSlides;
    }
  }
  
  // Formato de fecha
  function formatDate(dateInput: string): string {
  if (!dateInput) return '';

  try {
    const date = new Date(parseInt(dateInput));

    // Extraer día, mes y año
    const day = date.getDate();
    const month = date.getMonth(); // Los meses comienzan en 0 (enero = 0)
    const year = date.getFullYear();

    // Nombres de los meses en español
    const monthsInSpanish = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const monthName = monthsInSpanish[month];

    // Construir la cadena manualmente
    return `${day} de ${monthName} de ${year}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
}

  
  // Colores de categorías
  const categoryColors: Record<string, string> = {
    JavaScript: 'bg-yellow-500',
    TypeScript: 'bg-blue-500',
    CSS: 'bg-pink-500',
    React: 'bg-sky-500',
    Svelte: 'bg-orange-500',
    Backend: 'bg-emerald-500',
    DevOps: 'bg-purple-500',
    default: 'bg-primary'
  };
  
  function getCategoryClass(category: string): string {
    return categoryColors[category] || categoryColors.default;
  }
</script>

<section class="mb-16">
  <h2 class="inline-block text-3xl font-bold relative mb-10">
    <span class="z-10 relative">Artículos Destacados</span>
    <span class="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-0 transform -rotate-1"></span>
  </h2>
  
  {#if isLoading}
    <div class="relative rounded-xl bg-gray-100 dark:bg-gray-800 h-96 animate-pulse overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-gradient"></div>
      <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div class="absolute bottom-8 left-8 right-8">
        <div class="h-8 w-2/3 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
        <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  {:else if error}
    <div class="p-6 rounded-xl bg-red-50 border border-red-200 text-center">
      <p class="text-red-700">No se pudieron cargar los artículos destacados</p>
      <button 
        class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        on:click={fetchFeaturedPosts}
      >
        Reintentar
      </button>
    </div>
  {:else if featuredPosts.length === 0}
    <div class="p-8 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
      <p class="text-gray-500 dark:text-gray-400">No hay artículos destacados disponibles</p>
    </div>
  {:else}
    <div 
      class="relative h-[500px] md:h-[550px] rounded-xl overflow-hidden shadow-xl group"
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
    >
      <!-- Slide track -->
      <div 
        class="absolute inset-0 transition-transform duration-500 ease-out"
        style="transform: translateX(-{currentSlide * 100}%)"
      >
        <div class="flex h-full">
          {#each featuredPosts as post, i}
            <div class="w-full h-full flex-shrink-0 relative">
              <!-- Background image with gradient overlay -->
              <img 
                src={post.image || 'https://via.placeholder.com/1200x800'} 
                alt={post.title}
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              
              <!-- Content overlay -->
              {#if i === currentSlide}
                <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  <div in:fly={{ y: 30, duration: 800, delay: 200, easing: elasticOut }}>
                    <!-- Category badges -->
                    {#if post.categories && post.categories.length > 0}
                      <div class="flex flex-wrap gap-2 mb-4">
                        {#each post.categories.slice(0, 2) as category}
                          <span class={`inline-block px-3 py-1 rounded-full ${getCategoryClass(category)} text-white text-sm font-medium`}>
                            {category}
                          </span>
                        {/each}
                      </div>
                    {/if}
                    
                    <!-- Title -->
                    <h3 class="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl">
                      {post.title}
                    </h3>
                    
                    <!-- Description -->
                    <p class="text-white/90 mb-6 max-w-2xl text-lg">
                      {post.description}
                    </p>
                    
                    <!-- Author and date -->
                    <div class="flex items-center mb-8">
                      <img 
                        src={post.author?.avatar || "https://ui-avatars.com/api/?name=" + (post.author?.name || "Unknown")}
                        alt={post.author?.name || "Author"}
                        class="w-10 h-10 rounded-full border-2 border-white mr-3"
                      />
                      <div>
                        <div class="text-white font-medium">
                          {post.author?.name || "Equipo ExoCode"}
                        </div>
                        <div class="text-white/70 text-sm">
                          {formatDate(post.createdAt || Date.now())}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Read more link -->
                    <a 
                      href={`/blog/${post.slug}`} 
                      class="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-lg group-hover:shadow-xl"
                    >
                      Leer artículo
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Navigation arrows -->
      <button 
        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        on:click={() => goToSlide((currentSlide - 1 + totalSlides) % totalSlides)}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        on:click={() => goToSlide((currentSlide + 1) % totalSlides)}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Slide indicators -->
      <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {#each featuredPosts as _, i}
          <button 
            class="w-3 h-3 rounded-full focus:outline-none transition-all {i === currentSlide ? 'bg-white' : 'bg-white/30'}"
            on:click={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === currentSlide ? 'true' : 'false'}
          ></button>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 1.5s ease infinite;
  }
</style> 