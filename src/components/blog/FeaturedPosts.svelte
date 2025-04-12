<script lang="ts">
  import { type Post } from "interfaces/BlogInterface";
  import { Query } from "lib/apollo-client";
  import { POSTS_QUERY } from "queries/post.ts";
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';

  let featuredArticles: Post[] = [];
  let isLoading = true;
  let error: any = null;
  let currentSlide = 0;
  let totalSlides = 0;
  let autoplayInterval: number;
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
      if (data && data.posts) {
        // Get the first three articles as featured
        featuredArticles = data.posts.slice(0, 3);
        totalSlides = featuredArticles.length;
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
  {:else if featuredArticles.length === 0}
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
          {#each featuredArticles as article, i}
            <div class="w-full h-full flex-shrink-0 relative">
              <!-- Background image with gradient overlay -->
              <img 
                src={article.image || 'https://via.placeholder.com/1200x800'} 
                alt={article.title}
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
              
              <!-- Content overlay -->
              <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                {#if i === currentSlide}
                  <div in:fly={{ y: 30, duration: 800, delay: 200, easing: elasticOut }}>
                    <!-- Category badge -->
                    {#if article.categories && article.categories.length > 0}
                      <span class="inline-block px-3 py-1 rounded-full bg-primary/90 text-white text-sm font-medium mb-4">
                        {article.categories[0]}
                      </span>
                    {/if}
                    
                    <!-- Title -->
                    <h3 class="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl">
                      {article.title}
                    </h3>
                    
                    <!-- Description -->
                    <p class="text-white/80 mb-6 max-w-2xl text-lg">
                      {article.description}
                    </p>
                    
                    <!-- Author and date -->
                    <div class="flex items-center mb-8">
                      <img 
                        src={article.author?.avatar || "https://ui-avatars.com/api/?name=" + (article.author?.name || "Unknown")}
                        alt={article.author?.name || "Author"}
                        class="w-10 h-10 rounded-full border-2 border-white mr-3"
                      />
                      <div>
                        <div class="text-white font-medium">
                          {article.author?.name || "Equipo ExoCode"}
                        </div>
                        <div class="text-white/70 text-sm">
                          {new Date(article.content?.time || Date.now()).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Read more link -->
                    <a 
                      href={`/blog/${article.slug}`} 
                      class="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:-translate-y-1 shadow-lg group-hover:shadow-xl"
                    >
                      Leer artículo
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                {/if}
              </div>
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
        {#each featuredArticles as _, i}
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