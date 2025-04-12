<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut, quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  interface Project {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    link: string;
    year?: string;
    role?: string;
    client?: string;
  }

  const projects: Project[] = [
    {
      title: "Bicicletas Java Colombia",
      description: "Plataforma de venta de bicicletas en línea con catálogo completo, gestión de pedidos y sistema de pagos integrado.",
      image: "/projects/bicicletas-colombia.png",
      technologies: ["React", "Express", "Node.js", "MongoDB", "Styled Components"],
      link: "https://bicicletasjavacolombia.artosh.dev/",
      year: "2023",
      client: "Java Colombia",
      role: "Desarrollo Full Stack"
    },
    {
      title: "ARIS Kenia",
      description: "Sistema de Gestión de quejas con dashboard administrativo, notificaciones en tiempo real y generación de reportes estadísticos.",
      image: "/projects/aris-kenia.png",
      technologies: ["React", "Next.js", "Laravel", "Socket.IO", "MySQL", "TailwindCSS"],
      link: "https://kenia-client.vercel.app/",
      year: "2022",
      client: "Gobierno de Kenia",
      role: "Arquitectura y Frontend"
    }
  ];

  let visible = false;
  let activeProject = -1;
  
  onMount(() => {
    visible = true;
  });
  
  function setActiveProject(index: number) {
    activeProject = index;
  }
  
  function clearActiveProject() {
    activeProject = -1;
  }
  
  // Colores dinámicos para las tecnologías
  const techColors: Record<string, string> = {
    "React": "bg-purple-100 text-purple-800",
    "Express": "bg-gray-100 text-gray-800",
    "Node.js": "bg-green-100 text-green-800",
    "MongoDB": "bg-emerald-100 text-emerald-800",
    "Styled Components": "bg-pink-100 text-pink-800",
    "Next.js": "bg-black text-white",
    "Laravel": "bg-red-100 text-red-800",
    "Socket.IO": "bg-purple-100 text-purple-800",
    "MySQL": "bg-purple-100 text-purple-800",
    "TailwindCSS": "bg-teal-100 text-teal-800"
  };
  
  function getTechColor(tech: string) {
    return techColors[tech] || "bg-gray-100 text-gray-800";
  }
</script>

<section class="py-24 relative overflow-hidden">
  <!-- Elementos decorativos de fondo -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-[#8854d0]/10 to-transparent rounded-full"></div>
    <div class="absolute left-0 bottom-0 w-80 h-80 bg-gradient-to-tr from-[#8854d0]/10 to-transparent rounded-full"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <!-- Section header -->
    <div class="text-center mb-16">
      <span 
        class="inline-block px-4 py-1 rounded-full bg-[#8854d0]/10 text-[#8854d0] dark:text-[#a37ad5] text-sm font-medium mb-4"
        in:fade={{ duration: 600 }}
      >
        NUESTRO PORTAFOLIO
      </span>
      <h2 
        class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
        in:scale={{ duration: 800, delay: 200, easing: quintOut }}
      >
        Proyectos Destacados
      </h2>
      <p 
        class="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
        in:fade={{ duration: 800, delay: 400 }}
      >
        Soluciones creativas que transforman ideas en experiencias digitales impactantes
      </p>
    </div>

    {#if visible}
      <!-- Projects grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {#each projects as project, i}
          <div
            class="group project-card relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            in:scale={{ delay: i * 200, duration: 800, easing: quintOut }}
            on:mouseenter={() => setActiveProject(i)}
            on:mouseleave={clearActiveProject}
          >
            <!-- Project image - Mayor prominencia, sin overlay oscuro -->
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              <!-- Badges de tecnología en la parte superior -->
              <div class="absolute top-0 left-0 right-0 p-4">
                <div class="flex flex-wrap gap-2 justify-end">
                  {#each project.technologies.slice(0, 3) as tech}
                    <span class="px-3 py-1 rounded-full text-xs font-medium shadow-md bg-white/90 backdrop-blur-sm text-gray-800 transition-all duration-300 transform group-hover:translate-y-0">
                      {tech}
                    </span>
                  {/each}
                  {#if project.technologies.length > 3}
                    <span class="px-3 py-1 rounded-full text-xs font-medium shadow-md bg-white/90 backdrop-blur-sm text-[#8854d0] transition-all duration-300 transform group-hover:translate-y-0">
                      +{project.technologies.length - 3}
                    </span>
                  {/if}
                </div>
              </div>
              
              <!-- Sutiles badges de cliente y año -->
              <div class="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {#if project.client}
                  <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-md">
                    {project.client}
                  </span>
                {/if}
                {#if project.year}
                  <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-md">
                    {project.year}
                  </span>
                {/if}
              </div>
            </div>
            
            <!-- Project information -->
            <div class="p-6 md:p-8">
              <h3 class="text-2xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-[#8854d0] dark:group-hover:text-[#a37ad5] transition-colors">
                {project.title}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                {project.description}
              </p>
              
              <!-- Role badge if available -->
              {#if project.role}
                <div class="mb-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-[#8854d0]/10 dark:bg-[#8854d0]/30 text-[#8854d0] dark:text-[#a37ad5]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {project.role}
                  </span>
                </div>
              {/if}
              
              <!-- View project link -->
              <a
                href={project.link}
                class="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#8854d0] to-[#7048c0] text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                Ver Proyecto
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            
            <!-- Highlight border on hover -->
            {#if activeProject === i}
              <div
                class="absolute inset-0 border-2 border-[#8854d0] rounded-xl pointer-events-none"
                in:scale={{ duration: 200, start: 0.95 }}
                out:scale={{ duration: 150 }}
              ></div>
            {/if}
          </div>
        {/each}
      </div>
      
      <!-- CTA button -->
      <div class="text-center">
        <a
          href="/contact"
          class="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#8854d0] to-[#7048c0] text-white font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        >
          Hablemos de tu proyecto
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    {/if}
  </div>
</section> 