<script lang="ts">
  import { type Post } from "interfaces/BlogInterface";
  import { Query } from "lib/apollo-client";
  import { POSTS_QUERY } from "queries/post.ts";
  import { convertDate } from "utils/dates";
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onMount, onDestroy } from 'svelte';
  
  let articles: Post[] = [];
  let isLoading = true;
  let error: any = null;
  
  // Create intersection observer for animation on scroll
  let articleRefs: HTMLElement[] = [];
  let observer: IntersectionObserver;
  let visibleArticles = new Set();
  
  function setupObserver() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleArticles.add(entry.target.getAttribute('data-index'));
        }
      });
    }, { threshold: 0.1 });
  }
  
  // Fetch articles
  async function loadArticles() {
    try {
      const result = await Query(POSTS_QUERY);
      const { data } = result;
      if (data && data.posts) {
        articles = data.posts;
      }
    } catch (e) {
      console.error('Error loading articles:', e);
      error = e;
    } finally {
      isLoading = false;
      
      // Setup observer after articles are loaded
      setTimeout(() => {
        setupObserver();
        articleRefs.forEach(ref => {
          if (ref) observer.observe(ref);
        });
      }, 100);
    }
  }
  
  // Load articles on mount
  loadArticles();
  
  // Category colors
  const categoryColors: Record<string, string> = {
    JavaScript: 'bg-yellow-100 text-yellow-800',
    TypeScript: 'bg-blue-100 text-blue-800',
    CSS: 'bg-pink-100 text-pink-800',
    React: 'bg-sky-100 text-sky-800',
    Svelte: 'bg-orange-100 text-orange-800',
    Backend: 'bg-emerald-100 text-emerald-800',
    DevOps: 'bg-purple-100 text-purple-800',
    'default': 'bg-gray-100 text-gray-800'
  };
  
  function getCategoryClass(category: string) {
    return categoryColors[category] || categoryColors.default;
  }
  
  // Clean up observer on component destruction
  onDestroy(() => {
    if (observer) {
      articleRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    }
  });
</script>

<section class="mb-16">
  {#if isLoading}
    <div class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-gradient-to-r from-primary/30 to-primary/10"></div>
        <div class="mt-4 text-sm text-gray-500">Cargando artículos...</div>
      </div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-700">Lo sentimos, ha ocurrido un error al cargar los artículos</p>
      <button 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        on:click={() => loadArticles()}
      >
        Intentar de nuevo
      </button>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 gap-8">
      {#each articles as article, index}
        <div 
          bind:this={articleRefs[index]} 
          data-index={index}
          class="group relative"
          in:fade={{ duration: 300, delay: index * 150 }}
        >
          {#if visibleArticles.has(index.toString()) || index < 2}
            <article 
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              in:fly={{ y: 20, duration: 500, delay: 300, easing: quintOut }}
            >
              <!-- Image container with gradient overlay -->
              <div class="relative h-48 overflow-hidden">
                <img
                  src={article.image || 'https://via.placeholder.com/600x400'}
                  alt={article.title}
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <!-- Categories -->
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                  {#if article.categories && article.categories.length > 0}
                    {#each article.categories.slice(0, 2) as category}
                      <span class={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryClass(category)}`}>
                        {category}
                      </span>
                    {/each}
                  {:else}
                    <span class="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800">
                      Blog
                    </span>
                  {/if}
                </div>
                
                <!-- Date at bottom of image -->
                <div class="absolute bottom-4 left-4">
                  <time class="text-xs text-white/90 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {convertDate(article.content?.time || new Date().toISOString())}
                  </time>
                </div>
              </div>
              
              <!-- Content section -->
              <div class="p-6">
                <h3 class="font-bold text-xl mb-3 text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                  {article.title}
                </h3>
                
                <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <!-- Author section -->
                <div class="flex items-center justify-between mt-6">
                  <div class="flex items-center">
                    <img
                      src={article.author?.avatar || "https://ui-avatars.com/api/?name=" + (article.author?.name || "Unknown")}
                      alt={article.author?.name || "Author"}
                      class="w-8 h-8 rounded-full mr-2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {article.author?.name || "Equipo ExoCode"}
                    </span>
                  </div>
                  
                  <a 
                    href={`/blog/${article.slug}`} 
                    class="text-primary font-medium text-sm flex items-center group-hover:underline"
                  >
                    Leer más
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          {/if}
        </div>
      {/each}
    </div>
    
    <!-- Load more & pagination -->
    <div class="flex justify-between items-center mt-12">
      <a 
        href="#" 
        class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Artículos anteriores
      </a>
      
      <div class="hidden md:flex gap-2">
        <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white">1</a>
        <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">2</a>
        <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">3</a>
        <span class="w-10 h-10 flex items-center justify-center">...</span>
        <a href="#" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">8</a>
      </div>
      
      <a 
        href="#" 
        class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
      >
        Artículos más recientes
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  {/if}
</section>

