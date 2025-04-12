<script>
  import { onMount, tick } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  import { quintOut } from 'svelte/easing';
  
  import ContactForm from './ContactForm.svelte';

  
  // Reactive variables for scroll position
  let scrollY = 0;
  let innerHeight = 0;
  let innerWidth = 0;
  
  // Reactive derived values
  $: bgOpacity = 1 - (scrollY / 300) * 0.5;
  $: textY = -(scrollY / 300) * 50;
  $: isHeroInView = scrollY < innerHeight;
  
  // Spring animation for hero elements
  const heroOpacity = spring(0, {
    stiffness: 0.1,
    damping: 0.4
  });
  
  let particlesContainer;
  let animationFrameId;
  let particles = [];
  
  // Create particles with initial positions and velocities
  function createParticles() {
    particles = Array(50).fill().map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.7 ? Math.random() * 3 + 1 : Math.random() * 8 + 3, // Tamaños más variados
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.01 + 0.005
    }));
  }
  
  // Animation function
  function animateParticles() {
    if (!particlesContainer) return;
    
    // Get container dimensions
    const rect = particlesContainer.getBoundingClientRect();
    
    // Update particles
    particles = particles.map(p => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Bounce off edges
      if (p.x < 0 || p.x > 100) p.speedX *= -1;
      if (p.y < 0 || p.y > 100) p.speedY *= -1;
      
      // Keep within bounds
      p.x = Math.max(0, Math.min(100, p.x));
      p.y = Math.max(0, Math.min(100, p.y));
      
      return p;
    });
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(animateParticles);
  }
  
  onMount(() => {
    heroOpacity.set(1);
    createParticles();
    
    // Start animation after DOM update
    tick().then(() => {
      animateParticles();
    });
    
    // Cleanup animation on component destruction
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });
  
  // Scroll to contact section
  function scrollToContact() {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<svelte:window bind:scrollY bind:innerHeight bind:innerWidth />

<div class="min-h-screen bg-white overflow-x-hidden">

  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
    <!-- Background gradient -->
    <div 
      class="absolute inset-0 bg-gradient-to-b from-[#8a3ffc] to-[#6023c0]"
      style="opacity: {bgOpacity}"
    ></div>

    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        class="absolute top-1/4 right-[10%] w-64 h-64 md:w-96 md:h-96 bg-purple-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-60"
        style="transform: translate({Math.sin(Date.now() / 3000) * 30}px, {Math.cos(Date.now() / 3000) * -30}px) scale({1 + Math.sin(Date.now() / 5000) * 0.1});"
      ></div>
      <div 
        class="absolute bottom-1/4 left-[10%] w-64 h-64 md:w-96 md:h-96 bg-indigo-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-60"
        style="transform: translate({Math.cos(Date.now() / 3000) * -30}px, {Math.sin(Date.now() / 3000) * 30}px) scale({1 + Math.cos(Date.now() / 5000) * 0.1});"
      ></div>
    </div>

    <!-- Animated particles with requestAnimationFrame -->
    <div bind:this={particlesContainer} class="absolute inset-0 overflow-hidden pointer-events-none">
      {#each particles as particle, i (i)}
        <div 
          class="absolute rounded-full"
          style="left: {particle.x}%; top: {particle.y}%; 
                 width: {particle.size}px; height: {particle.size}px;
                 background-color: rgba(255, 255, 255, {particle.opacity});
                 box-shadow: 0 0 {particle.size * 2}px rgba(255, 255, 255, {particle.opacity});"
        ></div>
      {/each}
    </div>

    <!-- Content -->
    <div class="container px-4 md:px-6 lg:px-8 mx-auto relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <div style="transform: translateY({textY}px)" class="flex flex-col items-center justify-center min-h-[60vh] space-y-6 md:space-y-8">
          <h1 
            in:fly={{ y: 20, duration: 600, delay: 400 }}
            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            <span class="block">Contáctanos</span>
            <span class="block mt-2 text-xl sm:text-2xl md:text-3xl text-white/80">
              Estamos listos para escucharte
            </span>
          </h1>

          <p 
            in:fly={{ y: 20, duration: 600, delay: 600 }}
            class="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/90 px-4 md:px-0"
          >
            Convierte tus ideas en soluciones tecnológicas excepcionales con nuestro equipo de expertos
          </p>

          <div 
            in:fly={{ y: 20, duration: 600, delay: 800 }}
            class="flex flex-col sm:flex-row justify-center items-center w-full md:w-auto gap-3 mt-6"
          >
            <div class="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white py-2 px-4 md:px-6 w-full sm:w-auto whitespace-nowrap">
              <svg
                class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Respuesta en 24h</span>
            </div>
            <div class="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white py-2 px-4 md:px-6 w-full sm:w-auto whitespace-nowrap">
              <svg
                class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte personalizado</span>
            </div>
            <div class="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white py-2 px-4 md:px-6 w-full sm:w-auto whitespace-nowrap">
              <svg
                class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Múltiples canales</span>
            </div>
          </div>

          <button 
            on:click={scrollToContact}
            in:fly={{ y: 20, duration: 600, delay: 1000 }}
            class="mt-8 inline-flex items-center justify-center p-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors hover:scale-110 active:scale-95"
          >
            <div 
              class="p-1.5 md:p-2 lg:p-3 rounded-full bg-white text-[#8a3ffc]"
              style="animation: bounce 2s infinite;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 md:w-6 md:h-6">
                <path d="M12 5v14"/>
                <path d="m19 12-7 7-7-7"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom gradient overlay -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
  </section>

  <div id="contact-section" class="w-full max-w-[1920px] mx-auto">
    <ContactForm />
  </div>
  
</div>

<style>
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(5px);
    }
  }
</style>