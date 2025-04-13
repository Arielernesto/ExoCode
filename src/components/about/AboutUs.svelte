<script lang="ts">
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { elasticOut, quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  interface TeamMember {
    name: string;
    role: string;
    image: string;
    description: string;
    social: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  }

  const teamMembers: TeamMember[] = [
    {
      name: "Juan Pérez",
      role: "CEO & Fundador",
      image: "/team/ceo.jpg",
      description: "Apasionado por la tecnología y la innovación, liderando el camino hacia el futuro digital.",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },
    {
      name: "María García",
      role: "CTO",
      image: "/team/cto.jpg",
      description: "Experta en desarrollo de software y arquitectura de sistemas.",
      social: {
        linkedin: "#",
        github: "#"
      }
    }
  ];

  const values = [
    {
      title: "Innovación",
      description: "Buscamos constantemente nuevas formas de resolver problemas y mejorar la experiencia del usuario.",
      icon: "💡"
    },
    {
      title: "Calidad",
      description: "Nos comprometemos a entregar productos y servicios de la más alta calidad.",
      icon: "✨"
    },
    {
      title: "Colaboración",
      description: "Creemos en el poder del trabajo en equipo y la sinergia entre diferentes perspectivas.",
      icon: "🤝"
    }
  ];

  let visible = false;
  onMount(() => {
    visible = true;
  });
</script>

<!-- Hero Banner con fondo morado similar al del resto del sitio -->
<section class="relative overflow-hidden bg-gradient-to-br from-[#8a3ffc] to-[#6023c0] text-white">
  <!-- Animated particles background -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 opacity-20">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>
  
  <div class="px-4 py-24 relative z-10">
    <div class="max-w-6xl mx-auto text-center">
      <span class="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-4"
        in:fade={{ duration: 600 }}>
        CONÓCENOS
      </span>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
        in:scale={{ duration: 800, delay: 200, easing: elasticOut }}>
        Sobre Nosotros
      </h1>
      <p class="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
        in:fade={{ duration: 800, delay: 400 }}>
        Somos un equipo apasionado por crear soluciones tecnológicas innovadoras que transforman la forma en que las personas interactúan con la tecnología.
      </p>
    </div>
  </div>
  
  <!-- Decorative wave -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
      <path fill="#ffffff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
    </svg>
  </div>
</section>

<!-- Historia Section con diseño moderno -->
<section class="py-24 bg-white dark:bg-gray-900 relative">
  <div class="absolute top-0 right-0 w-1/3 h-80 bg-gradient-to-bl from-[#8854d0]/10 to-transparent rounded-bl-full"></div>
  <div class="absolute bottom-0 left-0 w-1/3 h-80 bg-gradient-to-tr from-[#8854d0]/10 to-transparent rounded-tr-full"></div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div class="relative order-2 md:order-1" in:scale={{ delay: 200, duration: 800, easing: quintOut }}>
        <div class="absolute inset-0 bg-[#8854d0]/20 rounded-2xl transform rotate-3"></div>
        <img 
          src="/products/dashboard.png" 
          alt="Nuestra oficina" 
          class="relative rounded-2xl shadow-xl transform -rotate-3 w-full h-auto"
        />
      </div>
      <div class="order-1 md:order-2" in:slide={{ delay: 400, duration: 600, axis: 'x' }}>
        <span class="inline-block px-4 py-1 rounded-full bg-[#8854d0]/10 text-[#8854d0] text-sm font-medium mb-4">
          NUESTRA HISTORIA
        </span>
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          De una idea a una realidad transformadora
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Fundada en 2020, nuestra empresa nació de la visión de crear soluciones tecnológicas que hagan la diferencia en la vida de las personas y las empresas.
        </p>
        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Desde entonces, hemos crecido y evolucionado, manteniendo siempre nuestro compromiso con la excelencia y la innovación. Cada proyecto que emprendemos es una oportunidad para aprender, crecer y mejorar nuestras capacidades.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Values Section con tarjetas modernas -->
<section class="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-bl from-[#8854d0]/10 to-transparent rounded-full"></div>
    <div class="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-tr from-[#8854d0]/10 to-transparent rounded-full"></div>
  </div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center mb-16">
      <span class="inline-block px-4 py-1 rounded-full bg-[#8854d0]/10 text-[#8854d0] text-sm font-medium mb-4"
        in:fade={{ duration: 400 }}>
        LO QUE NOS DEFINE
      </span>
      <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        in:scale={{ duration: 600, easing: quintOut }}>
        Nuestros Valores
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        in:fade={{ duration: 800, delay: 200 }}>
        Principios que guían nuestras decisiones y definen nuestra cultura empresarial
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      {#each values as value, i}
        <div 
          in:fly={{ y: 50, delay: i * 200 }}
          class="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600 group"
        >
          <div class="w-16 h-16 flex items-center justify-center text-4xl mb-6 bg-[#8854d0]/10 text-[#8854d0] rounded-2xl group-hover:bg-[#8854d0] group-hover:text-white transition-all duration-500">
            {value.icon}
          </div>
          <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-[#8854d0] transition-colors duration-300">
            {value.title}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {value.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Team Section con diseño tipo tarjetas -->
<section class="py-24 bg-white dark:bg-gray-900 relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <span class="inline-block px-4 py-1 rounded-full bg-[#8854d0]/10 text-[#8854d0] text-sm font-medium mb-4"
        in:fade={{ duration: 400 }}>
        NUESTRO EQUIPO
      </span>
      <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        in:scale={{ duration: 600, easing: quintOut }}>
        Las Mentes Creativas
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        in:fade={{ duration: 800, delay: 200 }}>
        Conoce a las personas apasionadas detrás de nuestras soluciones
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-10">
      {#each teamMembers as member, i}
        <div 
          in:fly={{ y: 50, delay: i * 200 }}
          class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col md:flex-row border border-gray-100 dark:border-gray-700"
        >
          <div class="relative md:w-2/5">
            <img 
              src={member.image} 
              alt={member.name}
              class="w-full h-full object-cover aspect-square md:aspect-auto"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#8854d0]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
              <div class="p-6 md:p-4 w-full">
                <div class="flex justify-center gap-4">
                  {#if member.social.linkedin}
                    <a href={member.social.linkedin} class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#8854d0] transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  {/if}
                  {#if member.social.github}
                    <a href={member.social.github} class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#8854d0] transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  {/if}
                  {#if member.social.twitter}
                    <a href={member.social.twitter} class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#8854d0] transition-all duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
          <div class="p-6 md:w-3/5 flex flex-col">
            <h3 class="text-xl font-bold mb-1 text-gray-900 dark:text-white group-hover:text-[#8854d0] transition-colors">
              {member.name}
            </h3>
            <p class="text-[#8854d0] mb-4 font-medium">
              {member.role}
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
              {member.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Section con fondo degradado -->
<section class="py-16 bg-gradient-to-br from-[#8a3ffc] to-[#6023c0] text-white relative overflow-hidden">
  <!-- Decorative particles -->
  <div class="absolute inset-0 pointer-events-none opacity-20">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </div>
  
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white" in:scale={{ duration: 600 }}>
      ¿Listo para trabajar con nosotros?
    </h2>
    <p class="text-xl text-white/80 mb-10 max-w-3xl mx-auto" in:fade={{ duration: 800, delay: 200 }}>
      Contáctanos hoy mismo y descubre cómo podemos ayudarte a alcanzar tus objetivos tecnológicos.
    </p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/contact" class="bg-white text-[#8854d0] px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg">
        Contactar ahora
      </a>
      <a href="/projects" class="bg-transparent border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
        Ver proyectos
      </a>
    </div>
  </div>
</section>

<style>
  /* Animations for the particles */
  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.2);
  }

  .particle:nth-child(1) {
    top: 20%;
    left: 10%;
    width: 80px;
    height: 80px;
    animation: float 15s ease-in-out infinite alternate;
  }
  
  .particle:nth-child(2) {
    top: 60%;
    left: 20%;
    width: 40px;
    height: 40px;
    animation: float 12s ease-in-out infinite alternate-reverse;
  }
  
  .particle:nth-child(3) {
    top: 30%;
    left: 50%;
    width: 60px;
    height: 60px;
    animation: float 18s ease-in-out infinite alternate;
  }
  
  .particle:nth-child(4) {
    top: 70%;
    left: 80%;
    width: 50px;
    height: 50px;
    animation: float 14s ease-in-out infinite alternate-reverse;
  }
  
  .particle:nth-child(5) {
    top: 10%;
    left: 85%;
    width: 70px;
    height: 70px;
    animation: float 16s ease-in-out infinite alternate;
  }
  
  .particle:nth-child(6) {
    top: 45%;
    left: 30%;
    width: 30px;
    height: 30px;
    animation: float 12s ease-in-out infinite alternate-reverse;
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-20px) translateX(10px) scale(1.05);
      opacity: 0.5;
    }
    100% {
      transform: translateY(10px) translateX(-15px) scale(0.95);
      opacity: 0.2;
    }
  }
</style> 