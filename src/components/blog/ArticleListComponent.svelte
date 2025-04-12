<script lang="ts">
  import { type Post } from "interfaces/BlogInterface";
  import { Query } from "lib/apollo-client";
  import { POSTS_QUERY } from "queries/post.ts";
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let articles: Post[] = [];
  let filteredArticles: Post[] = [];
  let isLoading = true;
  let error: any = null;
  
  // Filtrado por categorías
  let selectedFilter: string = '';
  let categories = ['Todos', 'JavaScript', 'TypeScript', 'React', 'Svelte', 'CSS', 'Backend', 'DevOps'];
  
  // Animación al scroll
  let articleRefs: HTMLElement[] = [];
  let observer: IntersectionObserver;
  let visibleArticles = new Set<string>();

  onMount(() => {
    fetchArticles();
    setupObserver();
    
    return () => {
      if (observer) {
        articleRefs.forEach(ref => {
          if (ref) observer.unobserve(ref);
        });
      }
    };
  });
  
  function setupObserver() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute('data-index');
          if (index) {
            visibleArticles.add(index);
            visibleArticles = visibleArticles; // Trigger reactivity
          }
        }
      });
    }, { threshold: 0.1 });
  }
  
  async function fetchArticles() {
    try {
      const result = await Query(POSTS_QUERY);
      const { data } = result;
      if (data && 'posts' in data && Array.isArray(data.posts)) {
        articles = data.posts;
        filteredArticles = [...articles];
      }
    } catch (e) {
      console.error('Error loading articles:', e);
      error = e;
    } finally {
      isLoading = false;
      
      // Observe elements after articles are loaded
      setTimeout(() => {
        articleRefs.forEach((ref, index) => {
          if (ref) observer.observe(ref);
        });
      }, 100);
    }
  }
  
  function filterByCategory(category: string) {
    selectedFilter = category;
    
    if (category === 'Todos' || !category) {
      filteredArticles = [...articles];
    } else {
      filteredArticles = articles.filter(article => 
        article.categories && 
        article.categories.includes(category)
      );
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
    JavaScript: 'bg-yellow-100 text-yellow-800',
    TypeScript: 'bg-blue-100 text-blue-800',
    CSS: 'bg-pink-100 text-pink-800',
    React: 'bg-sky-100 text-sky-800',
    Svelte: 'bg-orange-100 text-orange-800',
    Backend: 'bg-emerald-100 text-emerald-800',
    DevOps: 'bg-purple-100 text-purple-800',
    default: 'bg-gray-100 text-gray-800'
  };
  
  function getCategoryClass(category: string): string {
    return categoryColors[category] || categoryColors.default;
  }
</script>

<div>
  <!-- Filtros de categorías -->
  <div class="mb-8 overflow-x-auto">
    <div class="flex space-x-2 pb-2">
      {#each categories as category}
        <button 
          class="px-4 py-2 rounded-full whitespace-nowrap transition-colors {selectedFilter === category ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}"
          on:click={() => filterByCategory(category)}
        >
          {category}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Lista de artículos -->
  {#if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {#each Array(4) as _, i}
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div class="p-6">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div class="mt-4 flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-700">Lo sentimos, ha ocurrido un error al cargar los artículos</p>
      <button 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        on:click={() => fetchArticles()}
      >
        Intentar de nuevo
      </button>
    </div>
  {:else if filteredArticles.length === 0}
    <div class="py-20 text-center">
      <div class="text-4xl mb-4">🔍</div>
      <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No hay artículos para esta categoría</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Intenta seleccionar otra categoría o vuelve más tarde.</p>
      <button
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        on:click={() => filterByCategory('Todos')}
      >
        Ver todos los artículos
      </button>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 gap-8">
      {#each filteredArticles as article, index}
        <div 
          bind:this={articleRefs[index]} 
          data-index={index.toString()}
          class="group relative"
        >
          {#if visibleArticles.has(index.toString()) || index < 2}
            <article 
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              in:fly={{ y: 20, duration: 500, delay: 200, easing: quintOut }}
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
                    {formatDate(article.createdAt || Date.now())}
                  </time>
                </div>
              </div>
              
              <!-- Content section -->
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                  <a 
                    href={`/blog/${article.slug}`} 
                    class="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </a>
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <!-- Footer: Author + Read more -->
                <div class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-center">
                    <img 
                      src={article.author?.avatar || "https://ui-avatars.com/api/?name=" + (article.author?.name || "Unknown")}
                      alt={article.author?.name || "Author"}
                      class="w-8 h-8 rounded-full mr-2"
                    />
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {article.author?.name || "Equipo ExoCode"}
                    </span>
                  </div>
                  <a 
                    href={`/blog/${article.slug}`} 
                    class="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                  >
                    Leer más
                    <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          {:else}
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-80 overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700"></div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style> 