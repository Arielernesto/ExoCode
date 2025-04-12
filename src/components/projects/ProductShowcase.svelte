<script lang="ts">
  import { fade, slide, scale, fly } from 'svelte/transition';
  import { elasticOut, quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  interface Product {
    title: string;
    description: string;
    image: string;
    features: string[];
    link: string;
    category: string;
    price?: string;
    status?: "available" | "development" | "comingSoon";
  }

  const products: Product[] = [
    {
      title: "NetFusion Video Conference",
      description: "Plataforma de videoconferencia moderna para reuniones virtuales y colaboración en tiempo real.",
      image: "/products/net-fusion.webp",
      features: [
        "Reuniones en grupo",
        "Entrada con código de reunión",
        "Interfaz de pantalla dividida",
        "Funcionalidad de salir de pantalla completa",
        "Compartir pantalla en tiempo real",
        "Chats integrados con emojis"
      ],
      link: "/products/video-conference",
      category: "Colaboración",
      price: "En desarrollo",
      status: "development"
    },
    {
      title: "Tier Maker",
      description: "Herramienta para organizar elementos en categorías jerárquicas de manera sencilla y visual.",
      image: "/products/ranking.webp",
      features: [
        "Organización en categorías jerárquicas",
        "Edición y gestión de elementos",
        "Guardado y carga de tier lists",
        "Compartir tier lists en línea",
        "Generación de imágenes de tier lists",
        "Estadísticas detalladas",
        "Autenticación de usuarios"
      ],
      link: "https://tier-list-frontend.vercel.app/",
      category: "Productividad",
      price: "En desarrollo",
      status: "development"
    },
    {
      title: "ExoCode Dashboard",
      description: "Panel de control integral para supervisar el desempeño de tu negocio con métricas clave y herramientas analíticas.",
      image: "/products/dashboard.png",
      features: [
        "Métricas Financieras (Ingresos Totales)",
        "Análisis de Tráfico Web (Tasa de Rebote)",
        "Gestión de Distribuidores de Ventas",
        "Seguimiento de Crecimiento (Porcentajes de Cambio)",
        "Visualización de Datos Críticos en Tiempo Real",
        "Exportación de informes en múltiples formatos"
      ],
      link: "https://dashboard-company-ivory.vercel.app/",
      category: "Análisis y Inteligencia de Negocios",
      price: "Personalizado",
      status: "available"
    },
    {
      title: "ShortLink",
      description: "Herramienta para acortar URLs y seguir clics de manera sencilla. Ideal para campañas de marketing digital.",
      image: "/products/web-url.webp",
      features: [
        "Acortamiento de URLs", 
        "Seguimiento de clics", 
        "Administración de enlaces",
        "Estadísticas detalladas de tráfico",
        "Personalización de enlaces",
        "Protección contra spam"
      ],
      link: "/products/shortlink",
      category: "Utilidad",
      price: "Gratis",
      status: "available"
    } 
  ];

  let visible = false;
  let hoveredProduct = -1;
  let selectedCategory = "all";
  let currentProductView = "grid"; // "grid" o "list"

  const categories = ["all", ...new Set(products.map(p => p.category))];

  onMount(() => {
    visible = true;
  });

  function handleMouseEnter(index: number) {
    hoveredProduct = index;
  }

  function handleMouseLeave() {
    hoveredProduct = -1;
  }
  
  function getStatusBadge(status: string | undefined) {
    switch(status) {
      case 'available':
        return { color: 'bg-green-100 text-green-800', text: 'Disponible' };
      case 'development':
        return { color: 'bg-amber-100 text-amber-800', text: 'En desarrollo' };
      case 'comingSoon':
        return { color: 'bg-blue-100 text-blue-800', text: 'Próximamente' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Disponible' };
    }
  }
</script>

<section class="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
  <!-- Elementos decorativos de fondo -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute right-0 top-0 w-1/3 h-80 bg-gradient-to-bl from-[#8854d0]/10 to-transparent rounded-bl-full"></div>
    <div class="absolute left-0 bottom-0 w-1/3 h-80 bg-gradient-to-tr from-[#8854d0]/10 to-transparent rounded-tr-full"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <span 
        class="inline-block px-4 py-1 rounded-full bg-[#8854d0]/10 text-[#8854d0] text-sm font-medium mb-4"
        in:fade={{ duration: 600 }}
      >
        SOLUCIONES DIGITALES
      </span>
      <h2 
        class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
        in:fly={{ y: 30, duration: 800, delay: 200, easing: elasticOut }}
      >
        Nuestros Productos
      </h2>
      <p 
        class="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
        in:fly={{ y: 30, duration: 800, delay: 300, easing: elasticOut }}
      >
        Herramientas y plataformas diseñadas para potenciar tu productividad
      </p>
    </div>

    <!-- Category Filter and View Toggle -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
      <!-- Category Filters -->
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3" in:fade={{ duration: 600, delay: 400 }}>
        {#each categories as category}
          <button
            class="px-4 sm:px-5 py-2 rounded-full text-sm transition-all duration-300 {selectedCategory === category 
              ? 'bg-[#8854d0] text-white shadow-md shadow-[#8854d0]/20 transform scale-105' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
            on:click={() => selectedCategory = category}
          >
            {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        {/each}
      </div>
      
      <!-- View Toggle -->
      <div class="flex bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm" in:fade={{ duration: 600, delay: 600 }}>
        <button 
          class={`p-2 rounded-md transition-colors ${currentProductView === 'grid' ? 'bg-[#8854d0] text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          on:click={() => currentProductView = 'grid'}
          aria-label="Vista de cuadrícula"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button 
          class={`p-2 rounded-md transition-colors ${currentProductView === 'list' ? 'bg-[#8854d0] text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          on:click={() => currentProductView = 'list'}
          aria-label="Vista de lista"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    {#if visible}
      <!-- Grid View con layout mejorado: 2 primeros productos destacados y el resto a ancho completo -->
      {#if currentProductView === 'grid'}
        <div class="grid grid-cols-1 gap-8">
          <!-- Primeros dos productos destacados en dos columnas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {#each products.filter(p => selectedCategory === "all" || p.category === selectedCategory).slice(0, 2) as product, i}
              <div
                in:scale={{ delay: i * 100, duration: 500, easing: quintOut }}
                class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                on:mouseenter={() => handleMouseEnter(i)}
                on:mouseleave={handleMouseLeave}
              >
                <!-- Product image con major emphasis -->
                <div class="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <!-- Overlay gradual para mejor legibilidad -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                  
                  <!-- Badge container para mejor organización -->
                  <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                    <!-- Category badge -->
                    <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white shadow-lg transform translate-y-0 transition-transform duration-300">
                      {product.category}
                    </span>
                    
                    <!-- Status badge -->
                    {#if product.status}
                      <span class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status).color} shadow-md`}>
                        {getStatusBadge(product.status).text}
                      </span>
                    {/if}
                  </div>
                  
                  <!-- Product title sobre la imagen -->
                  <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 transition-transform duration-300">
                    <h3 class="text-xl font-bold text-white mb-1 group-hover:text-[#8854d0]/90 transition-colors">{product.title}</h3>
                    <p class="text-white/80 text-sm line-clamp-2">{product.price}</p>
                  </div>
                </div>
                
                <!-- Product content -->
                <div class="p-6 flex flex-col flex-grow">
                  <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{product.description}</p>
                  
                  <!-- Feature highlights -->
                  <div class="grid grid-cols-1 gap-1 mb-5">
                    {#each product.features.slice(0, 3) as feature}
                      <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg class="w-4 h-4 text-[#8854d0] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="truncate">{feature}</span>
                      </div>
                    {/each}
                    
                    {#if product.features.length > 3}
                      <div class="text-xs text-[#8854d0] mt-1 font-medium">
                        +{product.features.length - 3} características más
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Action button -->
                  <a
                    href={product.link}
                    class="mt-auto w-full text-center bg-white dark:bg-gray-700 border border-[#8854d0] text-[#8854d0] dark:text-white hover:bg-[#8854d0] hover:text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm group-hover:shadow-md transform group-hover:-translate-y-1"
                  >
                    Explorar {product.title.split(' ')[0]} →
                  </a>
                </div>
                
                {#if hoveredProduct === i}
                  <div
                    class="absolute inset-0 border-2 border-[#8854d0] rounded-2xl pointer-events-none"
                    in:scale={{ duration: 200, start: 0.95 }}
                  ></div>
                {/if}
              </div>
            {/each}
          </div>
          
          <!-- Productos restantes a ancho completo -->
          {#each products.filter(p => selectedCategory === "all" || p.category === selectedCategory).slice(2) as product, i}
            <div
              in:scale={{ delay: (i + 2) * 100, duration: 500, easing: quintOut }}
              class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              on:mouseenter={() => handleMouseEnter(i + 2)}
              on:mouseleave={handleMouseLeave}
            >
              <div class="flex flex-col md:flex-row">
                <!-- Imagen a la izquierda en pantallas medianas y grandes -->
                <div class="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <!-- Overlay gradual -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                  
                  <!-- Badge container -->
                  <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                    <!-- Category badge -->
                    <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white shadow-lg">
                      {product.category}
                    </span>
                    
                    <!-- Status badge -->
                    {#if product.status}
                      <span class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status).color} shadow-md`}>
                        {getStatusBadge(product.status).text}
                      </span>
                    {/if}
                  </div>
                </div>
                
                <!-- Contenido a la derecha -->
                <div class="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
                  <div class="mb-4">
                    <h3 class="text-xl font-bold group-hover:text-[#8854d0] transition-colors">{product.title}</h3>
                    <p class="text-sm text-gray-500">{product.price}</p>
                  </div>
                  
                  <p class="text-gray-600 dark:text-gray-300 text-sm mb-5">{product.description}</p>
                  
                  <!-- Features en grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-6">
                    {#each product.features.slice(0, 4) as feature}
                      <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg class="w-4 h-4 text-[#8854d0] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="truncate">{feature}</span>
                      </div>
                    {/each}
                    
                    {#if product.features.length > 4}
                      <div class="text-xs text-[#8854d0] font-medium mt-1 sm:col-span-2">
                        +{product.features.length - 4} características más
                      </div>
                    {/if}
                  </div>
                  
                  <a
                    href={product.link}
                    class="mt-auto self-start inline-flex items-center bg-white dark:bg-gray-700 border border-[#8854d0] text-[#8854d0] dark:text-white hover:bg-[#8854d0] hover:text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm transform hover:-translate-y-1 hover:shadow-md"
                  >
                    Ver detalles
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {#if hoveredProduct === i + 2}
                <div
                  class="absolute inset-0 border-2 border-[#8854d0] rounded-2xl pointer-events-none"
                  in:scale={{ duration: 200, start: 0.95 }}
                ></div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View con imágenes más prominentes -->
        <div class="space-y-8">
          {#each products.filter(p => selectedCategory === "all" || p.category === selectedCategory) as product, i}
            <div
              in:fly={{ y: 20, delay: i * 100, duration: 500, easing: quintOut }}
              class="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              on:mouseenter={() => handleMouseEnter(i)}
              on:mouseleave={handleMouseLeave}
            >
              <div class="flex flex-col md:flex-row">
                <!-- Image section con mayor énfasis -->
                <div class="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  
                  <!-- Badge container -->
                  <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                    <!-- Category badge -->
                    <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white shadow-lg">
                      {product.category}
                    </span>
                    
                    <!-- Status badge -->
                    {#if product.status}
                      <span class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status).color} shadow-md`}>
                        {getStatusBadge(product.status).text}
                      </span>
                    {/if}
                  </div>
                </div>
                
                <!-- Content section -->
                <div class="w-full md:w-3/5 p-6 md:p-8">
                  <div class="mb-4">
                    <h3 class="text-xl font-bold group-hover:text-[#8854d0] transition-colors">{product.title}</h3>
                    <p class="text-sm text-gray-500">{product.price}</p>
                  </div>
                  
                  <p class="text-gray-600 dark:text-gray-300 text-sm mb-5">{product.description}</p>
                  
                  <!-- Features in a responsive grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-6">
                    {#each product.features.slice(0, 4) as feature}
                      <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg class="w-4 h-4 text-[#8854d0] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="truncate">{feature}</span>
                      </div>
                    {/each}
                    
                    {#if product.features.length > 4}
                      <div class="text-xs text-[#8854d0] font-medium mt-1 sm:col-span-2">
                        +{product.features.length - 4} características más
                      </div>
                    {/if}
                  </div>
                  
                  <a
                    href={product.link}
                    class="inline-flex items-center bg-white dark:bg-gray-700 border border-[#8854d0] text-[#8854d0] dark:text-white hover:bg-[#8854d0] hover:text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm transform hover:-translate-y-1 hover:shadow-md"
                  >
                    Ver detalles
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {#if hoveredProduct === i}
                <div
                  class="absolute inset-0 border-2 border-[#8854d0] rounded-xl pointer-events-none"
                  in:scale={{ duration: 200, start: 0.95 }}
                ></div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
      
      <!-- No products message -->
      {#if products.filter(p => selectedCategory === "all" || p.category === selectedCategory).length === 0}
        <div class="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-lg">
          <div class="inline-block p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-medium mb-2">No hay productos disponibles</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">No se encontraron productos en esta categoría</p>
          <button 
            class="px-4 py-2 bg-[#8854d0] text-white rounded-full font-medium hover:bg-[#8854d0]/90 transition-colors shadow-md shadow-[#8854d0]/20"
            on:click={() => selectedCategory = 'all'}
          >
            Ver todos los productos
          </button>
        </div>
      {/if}
      
      <!-- CTA section -->
      <div class="mt-24 bg-gradient-to-br from-[#8a3ffc] to-[#6023c0] text-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-32 -mr-32"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -mb-32 -ml-32"></div>
        
        <!-- Partículas decorativas -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
          <div class="particle-small"></div>
          <div class="particle-small"></div>
          <div class="particle-small"></div>
          <div class="particle-small"></div>
          <div class="particle-small"></div>
          <div class="particle-small"></div>
        </div>
        
        <div class="relative z-10 max-w-3xl mx-auto text-center">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">¿Necesitas una solución personalizada?</h3>
          <p class="text-white/90 mb-8 text-lg">
            Nuestro equipo de expertos puede desarrollar productos a medida que se adapten perfectamente a las necesidades específicas de tu negocio.
          </p>
          <a
            href="/contact"
            class="inline-block bg-white text-[#8854d0] px-8 py-4 rounded-full font-bold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 shadow-lg"
          >
            Hablemos de tu proyecto
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  /* Partículas decorativas para CTA */
  .particle-small {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.2);
  }

  .particle-small:nth-child(1) {
    top: 20%;
    left: 10%;
    width: 20px;
    height: 20px;
    animation: float-small 8s ease-in-out infinite alternate;
  }
  
  .particle-small:nth-child(2) {
    top: 60%;
    left: 20%;
    width: 15px;
    height: 15px;
    animation: float-small 6s ease-in-out infinite alternate-reverse;
  }
  
  .particle-small:nth-child(3) {
    top: 30%;
    left: 70%;
    width: 25px;
    height: 25px;
    animation: float-small 9s ease-in-out infinite alternate;
  }
  
  .particle-small:nth-child(4) {
    top: 70%;
    left: 80%;
    width: 18px;
    height: 18px;
    animation: float-small 7s ease-in-out infinite alternate-reverse;
  }
  
  .particle-small:nth-child(5) {
    top: 40%;
    left: 40%;
    width: 12px;
    height: 12px;
    animation: float-small 5s ease-in-out infinite alternate;
  }
  
  .particle-small:nth-child(6) {
    top: 80%;
    left: 60%;
    width: 16px;
    height: 16px;
    animation: float-small 8s ease-in-out infinite alternate-reverse;
  }

  @keyframes float-small {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-10px) translateX(5px);
      opacity: 0.5;
    }
    100% {
      transform: translateY(5px) translateX(-7px);
      opacity: 0.2;
    }
  }
</style> 