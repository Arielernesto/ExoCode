<script>
    import { onMount } from 'svelte';
    import { fade, fly, slide, scale } from 'svelte/transition';
    import { spring, tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    // Form state
    let formState = {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
    
    // Form validation
    let errors = {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
    
    let touched = {
      name: false,
      email: false,
      subject: false,
      message: false
    };
    
    let isSubmitting = false;
    let isSubmitted = false;
    let formProgress = tweened(0, {
      duration: 1000,
      easing: cubicOut
    });
    
    // Intersection observer for animations
    let formElement;
    let contactInfoElement;
    let communicationElement;
    
    let formInView = false;
    let contactInfoInView = false;
    let communicationInView = false;
    
    // Tabs state
    let activeTab = "exochat";
    
    // Form field focus state
    let focusedField = null;
    
    onMount(() => {
      // Set up intersection observers
      const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
      };
      
      const formObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            formInView = true;
            formObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      const contactInfoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            contactInfoInView = true;
            contactInfoObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      const communicationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            communicationInView = true;
            communicationObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      if (formElement) formObserver.observe(formElement);
      if (contactInfoElement) contactInfoObserver.observe(contactInfoElement);
      if (communicationElement) communicationObserver.observe(communicationElement);
      
      return () => {
        if (formElement) formObserver.unobserve(formElement);
        if (contactInfoElement) contactInfoObserver.unobserve(contactInfoElement);
        if (communicationElement) communicationObserver.unobserve(communicationElement);
      };
    });
    
    // Validate form fields
    function validateField(field, value) {
      switch(field) {
        case 'name':
          return value.trim() === '' ? 'El nombre es obligatorio' : '';
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value.trim() === '') return 'El email es obligatorio';
          if (!emailRegex.test(value)) return 'Por favor, introduce un email válido';
          return '';
        case 'subject':
          return value.trim() === '' ? 'El asunto es obligatorio' : '';
        case 'message':
          return value.trim() === '' ? 'El mensaje es obligatorio' : 
                 value.trim().length < 10 ? 'El mensaje debe tener al menos 10 caracteres' : '';
        default:
          return '';
      }
    }
    
    function handleChange(e) {
      const { name, value } = e.target;
      formState = { ...formState, [name]: value };
      
      // Validate if field has been touched
      if (touched[name]) {
        errors = { ...errors, [name]: validateField(name, value) };
      }
    }
    
    function handleBlur(e) {
      const { name, value } = e.target;
      touched = { ...touched, [name]: true };
      errors = { ...errors, [name]: validateField(name, value) };
      focusedField = null;
    }
    
    function handleFocus(e) {
      focusedField = e.target.name;
    }
    
    function validateForm() {
      let isValid = true;
      let newErrors = { ...errors };
      
      // Validate all fields
      Object.keys(formState).forEach(field => {
        const error = validateField(field, formState[field]);
        newErrors[field] = error;
        if (error) isValid = false;
      });
      
      errors = newErrors;
      return isValid;
    }
    
    function handleSubmit(e) {
      e.preventDefault();
      
      // Mark all fields as touched
      touched = {
        name: true,
        email: true,
        subject: true,
        message: true
      };
      
      // Validate form
      if (!validateForm()) return;
      
      isSubmitting = true;
      
      // Simulate form submission with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        formProgress.set(progress);
        
        if (progress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            isSubmitting = false;
            isSubmitted = true;
            
            // Reset form after showing success message
            setTimeout(() => {
              isSubmitted = false;
              formState = {
                name: "",
                email: "",
                subject: "",
                message: ""
              };
              errors = {
                name: "",
                email: "",
                subject: "",
                message: ""
              };
              touched = {
                name: false,
                email: false,
                subject: false,
                message: false
              };
              formProgress.set(0);
            }, 3000);
          }, 500);
        }
      }, 150);
    }
    
    function setActiveTab(tab) {
      activeTab = tab;
    }
    
    // Check if form is valid
    $: isFormValid = Object.values(errors).every(error => !error) && 
                     Object.values(formState).every(value => value.trim() !== '');
  </script>
  
  <section class="py-20 px-4 md:px-6 bg-white relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full -mr-32 -mt-32 opacity-70"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full -ml-32 -mb-32 opacity-70"></div>
  
    <div class="container mx-auto max-w-6xl relative z-10">
      <div 
        class="mb-16 text-center"
        in:fade={{ duration: 700 }}
      >
        <div 
          class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-[#8a3ffc] mb-4"
          in:fly={{ scale: 0.8, duration: 500, delay: 200 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4"/>
            <path d="M19 17v4"/>
            <path d="M3 5h4"/>
            <path d="M17 19h4"/>
          </svg>
          Múltiples canales a tu disposición
        </div>
  
        <h2 
          class="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          in:fly={{ y: 20, duration: 500, delay: 300 }}
        >
          Comunícate con nosotros
        </h2>
  
        <p 
          class="text-gray-600 max-w-3xl mx-auto"
          in:fly={{ y: 20, duration: 500, delay: 400 }}
        >
          Te ofrecemos diferentes formas de comunicarte con nosotros. Elige la que mejor te convenga.
        </p>
      </div>
  
      <!-- Improved responsive grid for tablets -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <!-- Form section -->
        <div 
          bind:this={formElement}
          class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden order-2 md:order-1"
          class:opacity-0={!formInView}
          class:translate-x-[-50px]={!formInView}
          class:opacity-100={formInView}
          class:translate-x-0={formInView}
          style="transition: opacity 0.7s ease-out, transform 0.7s ease-out"
        >
          <!-- Decorative background -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -mt-20 -mr-20 z-0"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 bg-purple-50 rounded-full -mb-20 -ml-20 z-0"></div>
  
          {#if isSubmitted}
            <div 
              class="flex flex-col items-center justify-center h-full py-12 text-center relative z-10"
              in:scale={{ start: 0.8, duration: 500 }}
            >
              <div 
                class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                in:scale={{ start: 0, duration: 500, delay: 200 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 text-green-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
  
              <h3
                class="text-2xl font-bold text-gray-800 mb-4"
                in:fly={{ y: 10, duration: 500, delay: 300 }}
              >
                ¡Mensaje enviado!
              </h3>
  
              <p
                class="text-gray-600"
                in:fly={{ y: 10, duration: 500, delay: 400 }}
              >
                Gracias por contactarnos. Te responderemos a la brevedad.
              </p>
  
              <div
                class="mt-6 w-full max-w-md h-1 bg-gray-100 rounded overflow-hidden"
                in:fade={{ duration: 500, delay: 500 }}
              >
                <div
                  class="h-1 bg-green-500 rounded"
                  style="animation: progressBar 3s ease-in-out forwards;"
                ></div>
              </div>
              
              <!-- Confetti animation -->
              <div class="confetti-container">
                {#each Array(20) as _, i}
                  <div 
                    class="confetti"
                    style="
                      --fall-delay: {Math.random() * 3}s;
                      --fall-speed: {5 + Math.random() * 5}s;
                      --left-pos: {Math.random() * 100}%;
                      --size: {5 + Math.random() * 10}px;
                      --color: hsl({Math.random() * 360}, 70%, 60%);
                      --rotation: {Math.random() * 360}deg;
                    "
                  ></div>
                {/each}
              </div>
            </div>
          {:else}
            <form
              on:submit={handleSubmit}
              class="space-y-6 relative z-10"
            >
              <div class:opacity-0={!formInView} class:opacity-100={formInView} style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.2s;">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span class="relative">
                    Envíanos un mensaje
                    <span 
                      class="absolute -bottom-1 left-0 h-1 bg-[#8a3ffc]"
                      class:w-0={!formInView}
                      class:w-full={formInView}
                      style="transition: width 0.8s ease-out; transition-delay: 0.5s;"
                    ></span>
                  </span>
                </h2>
              </div>
  
              <div class="space-y-4">
                <!-- Name field -->
                <div 
                  class="relative"
                  class:opacity-0={!formInView} 
                  class:translate-y-[20px]={!formInView}
                  class:opacity-100={formInView}
                  class:translate-y-0={formInView}
                  style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.3s;"
                >
                  <label for="name" class="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Nombre completo</span>
                    {#if touched.name && errors.name}
                      <span class="text-red-500 text-xs" in:fade={{ duration: 200 }}>{errors.name}</span>
                    {/if}
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm group overflow-hidden">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 group-hover:text-[#8a3ffc] transition-colors duration-300">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      bind:value={formState.name}
                      on:input={handleChange}
                      on:blur={handleBlur}
                      on:focus={handleFocus}
                      class="pl-10 py-3 transition-all duration-300 border border-gray-300 hover:border-[#8a3ffc] block w-full rounded-md bg-white focus:outline-none
                      {touched.name && errors.name ? 'border-red-500' : ''}
                      {focusedField === 'name' ? 'border-[#8a3ffc] ring-2 ring-[#8a3ffc]/20' : ''}"
                      placeholder="Tu nombre"
                      required
                    />
                    
                    {#if formState.name}
                      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 opacity-0 transition-opacity duration-300 {formState.name && !errors.name ? 'opacity-100' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                    {/if}
                  </div>
                </div>
  
                <!-- Email field -->
                <div 
                  class="relative"
                  class:opacity-0={!formInView} 
                  class:translate-y-[20px]={!formInView}
                  class:opacity-100={formInView}
                  class:translate-y-0={formInView}
                  style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.4s;"
                >
                  <label for="email" class="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Correo electrónico</span>
                    {#if touched.email && errors.email}
                      <span class="text-red-500 text-xs" in:fade={{ duration: 200 }}>{errors.email}</span>
                    {/if}
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm group overflow-hidden">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 group-hover:text-[#8a3ffc] transition-colors duration-300">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      bind:value={formState.email}
                      on:input={handleChange}
                      on:blur={handleBlur}
                      on:focus={handleFocus}
                      class="pl-10 py-3 transition-all duration-300 border border-gray-300 hover:border-[#8a3ffc] block w-full rounded-md bg-white focus:outline-none
                      {touched.email && errors.email ? 'border-red-500' : ''}
                      {focusedField === 'email' ? 'border-[#8a3ffc] ring-2 ring-[#8a3ffc]/20' : ''}"
                      placeholder="tu@email.com"
                      required
                    />
                    
                    {#if formState.email}
                      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 opacity-0 transition-opacity duration-300 {formState.email && !errors.email ? 'opacity-100' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                    {/if}
                  </div>
                </div>
  
                <!-- Subject field -->
                <div 
                  class="relative"
                  class:opacity-0={!formInView} 
                  class:translate-y-[20px]={!formInView}
                  class:opacity-100={formInView}
                  class:translate-y-0={formInView}
                  style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.5s;"
                >
                  <label for="subject" class="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Asunto</span>
                    {#if touched.subject && errors.subject}
                      <span class="text-red-500 text-xs" in:fade={{ duration: 200 }}>{errors.subject}</span>
                    {/if}
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm group overflow-hidden">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 group-hover:text-[#8a3ffc] transition-colors duration-300">
                        <path d="M5 4h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 9h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"></path>
                      </svg>
                    </div>
                    <input
                      id="subject"
                      name="subject"
                      bind:value={formState.subject}
                      on:input={handleChange}
                      on:blur={handleBlur}
                      on:focus={handleFocus}
                      class="pl-10 py-3 transition-all duration-300 border border-gray-300 hover:border-[#8a3ffc] block w-full rounded-md bg-white focus:outline-none
                      {touched.subject && errors.subject ? 'border-red-500' : ''}
                      {focusedField === 'subject' ? 'border-[#8a3ffc] ring-2 ring-[#8a3ffc]/20' : ''}"
                      placeholder="¿Sobre qué quieres hablar?"
                      required
                    />
                    
                    {#if formState.subject}
                      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 opacity-0 transition-opacity duration-300 {formState.subject && !errors.subject ? 'opacity-100' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                    {/if}
                  </div>
                </div>
  
                <!-- Message field -->
                <div 
                  class="relative"
                  class:opacity-0={!formInView} 
                  class:translate-y-[20px]={!formInView}
                  class:opacity-100={formInView}
                  class:translate-y-0={formInView}
                  style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.6s;"
                >
                  <label for="message" class="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Mensaje</span>
                    {#if touched.message && errors.message}
                      <span class="text-red-500 text-xs" in:fade={{ duration: 200 }}>{errors.message}</span>
                    {/if}
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm group overflow-hidden">
                    <div class="absolute top-3 left-3 flex items-start pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 group-hover:text-[#8a3ffc] transition-colors duration-300">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      bind:value={formState.message}
                      on:input={handleChange}
                      on:blur={handleBlur}
                      on:focus={handleFocus}
                      class="min-h-[150px] pl-10 py-3 transition-all duration-300 border border-gray-300 hover:border-[#8a3ffc] block w-full rounded-md bg-white resize-none focus:outline-none
                      {touched.message && errors.message ? 'border-red-500' : ''}
                      {focusedField === 'message' ? 'border-[#8a3ffc] ring-2 ring-[#8a3ffc]/20' : ''}"
                      placeholder="Cuéntanos sobre tu proyecto o consulta..."
                      required
                    ></textarea>
                    
                    {#if formState.message && formState.message.length >= 10}
                      <div class="absolute right-2 top-4 text-green-500 opacity-0 transition-opacity duration-300 {formState.message && !errors.message ? 'opacity-100' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Character counter with progress bar -->
                  {#if formState.message}
                    <div class="mt-2 flex items-center space-x-2">
                      <div class="flex-1 bg-gray-200 h-1 rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300"
                          style="width: {Math.min(100, formState.message.length / 10 * 100)}%"
                        ></div>
                      </div>
                      <div class="text-xs text-gray-500 flex-shrink-0">
                        {formState.message.length} caracteres
                        {#if formState.message.length < 10}
                          <span class="text-amber-500"> (mínimo 10)</span>
                        {/if}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
  
              <div 
                class:opacity-0={!formInView} 
                class:translate-y-[20px]={!formInView}
                class:opacity-100={formInView}
                class:translate-y-0={formInView}
                style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.7s;"
              >
                <!-- Form progress bar -->
                {#if isSubmitting}
                  <div class="mb-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      class="bg-[#8a3ffc] h-2.5 rounded-full transition-all duration-300"
                      style="width: {$formProgress * 100}%"
                    ></div>
                  </div>
                {/if}
                
                <button
                  type="submit"
                  class="w-full bg-[#8a3ffc] hover:bg-[#7535e5] text-white py-3 px-4 rounded-md transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
                  disabled={isSubmitting || !isFormValid}
                  class:opacity-70={!isFormValid && !isSubmitting}
                  class:cursor-not-allowed={!isFormValid && !isSubmitting}
                >
                  <!-- Button background animation -->
                  <div class="absolute inset-0 w-full h-full">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div class="absolute inset-0 bg-gradient-to-r from-[#8a3ffc] via-[#a56eff] to-[#8a3ffc] bg-[length:200%_100%] animate-gradient"></div>
                    </div>
                  </div>
                  
                  {#if isSubmitting}
                    <div class="flex items-center justify-center relative z-10">
                      <div
                        class="rounded-full h-5 w-5 border-2 border-t-transparent border-white mr-2"
                        style="animation: spin 1s linear infinite;"
                      ></div>
                      <span>Enviando mensaje... {Math.round($formProgress * 100)}%</span>
                    </div>
                  {:else}
                    <div class="flex items-center justify-center group relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                        <path d="m22 2-7 20-4-9-9-4Z"/>
                        <path d="M22 2 11 13"/>
                      </svg>
                      <span>Enviar mensaje</span>
                    </div>
                  {/if}
                </button>
                
                <!-- Form validation status -->
                {#if !isFormValid && Object.values(touched).some(t => t)}
                  <p class="mt-2 text-xs text-center text-amber-600">
                    Por favor, completa todos los campos correctamente antes de enviar.
                  </p>
                {/if}
              </div>
            </form>
          {/if}
        </div>
  
        <!-- Contact info and communication channels -->
        <div class="space-y-8 order-1 md:order-2">
          <!-- Contact information -->
          <div 
            bind:this={contactInfoElement}
            class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
            class:opacity-0={!contactInfoInView}
            class:opacity-100={contactInfoInView}
            style="transition: opacity 0.7s ease-out;"
          >
            <h2
              class="text-2xl font-bold text-gray-800 mb-6 relative inline-block"
              class:opacity-0={!contactInfoInView} 
              class:translate-y-[20px]={!contactInfoInView}
              class:opacity-100={contactInfoInView}
              class:translate-y-0={contactInfoInView}
              style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.2s;"
            >
              Información de contacto
              <span
                class="absolute -bottom-1 left-0 h-1 bg-[#8a3ffc]"
                class:w-0={!contactInfoInView}
                class:w-full={contactInfoInView}
                style="transition: width 0.8s ease-out; transition-delay: 0.5s;"
              ></span>
            </h2>
  
            <p 
              class="text-gray-600 mb-8"
              class:opacity-0={!contactInfoInView} 
              class:translate-y-[20px]={!contactInfoInView}
              class:opacity-100={contactInfoInView}
              class:translate-y-0={contactInfoInView}
              style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.3s;"
            >
              Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios o completa el formulario.
            </p>
  
            <div class="space-y-6">
              <!-- Location -->
          
  
              <!-- Email -->
              <div 
                class="flex items-start transform transition-all duration-300 hover:translate-x-2"
                class:opacity-0={!contactInfoInView} 
                class:translate-y-[20px]={!contactInfoInView}
                class:opacity-100={contactInfoInView}
                class:translate-y-0={contactInfoInView}
                style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.5s;"
              >
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-[#8a3ffc]">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-800">Email</h3>
                  <p class="mt-1 text-gray-600">
                    info@exocode.com
                    <br />
                    soporte@exocode.com
                  </p>
                </div>
              </div>
  
              <!-- Phone -->
              <div 
                class="flex items-start transform transition-all duration-300 hover:translate-x-2"
                class:opacity-0={!contactInfoInView} 
                class:translate-y-[20px]={!contactInfoInView}
                class:opacity-100={contactInfoInView}
                class:translate-y-0={contactInfoInView}
                style="transition: opacity 0.5s ease-out, transform 0.5s ease-out; transition-delay: 0.6s;"
              >
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-[#8a3ffc]">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-800">Teléfono</h3>
                  <p class="mt-1 text-gray-600">
                    +34 912 345 678
                    <br />
                    Lun - Vie, 9:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Communication channels -->
          <div 
            bind:this={communicationElement}
            class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
            class:opacity-0={!communicationInView} 
            class:translate-y-[30px]={!communicationInView}
            class:opacity-100={communicationInView}
            class:translate-y-0={communicationInView}
            style="transition: opacity 0.7s ease-out, transform 0.7s ease-out;"
          >
            <h3 class="text-xl font-bold text-gray-800 mb-4 relative inline-block">
              Canales de comunicación
              <span
                class="absolute -bottom-1 left-0 h-1 bg-[#8a3ffc]"
                class:w-0={!communicationInView}
                class:w-full={communicationInView}
                style="transition: width 0.8s ease-out; transition-delay: 0.5s;"
              ></span>
            </h3>
  
            <p class="text-gray-600 mb-6">Elige el canal que prefieras para comunicarte con nosotros.</p>
  
            <!-- Tabs -->
            <div class="w-full">
              <!-- Tab headers -->
              <div class="grid grid-cols-3 mb-4 w-full rounded-md overflow-hidden">
                <button 
                  class="py-2 px-4 text-center {activeTab === 'exochat' ? 'bg-[#8a3ffc] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors"
                  on:click={() => setActiveTab('exochat')}
                >
                  ExoChat
                </button>
                <button 
                  class="py-2 px-4 text-center {activeTab === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors"
                  on:click={() => setActiveTab('whatsapp')}
                >
                  WhatsApp
                </button>
                <button 
                  class="py-2 px-4 text-center {activeTab === 'telegram' ? 'bg-[#0088cc] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors"
                  on:click={() => setActiveTab('telegram')}
                >
                  Telegram
                </button>
              </div>
  
              <!-- Tab content -->
              <div class="mt-0">
                {#if activeTab === 'exochat'}
                  <div 
                    class="border-none shadow-lg bg-gradient-to-r from-[#7535e5] to-[#8a3ffc] text-white p-6 rounded-lg overflow-hidden relative"
                    in:fade={{ duration: 300 }}
                  >
                    <!-- Decorative elements -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                    <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -mb-8 -ml-8"></div>
  
                    <div class="flex items-center mb-4 relative z-10">
                      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-[#8a3ffc]">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <h3 class="text-xl font-bold text-white">Nuestro Chat Propio</h3>
                    </div>
                    <p class="mb-6 relative z-10">
                      <span class="font-bold">ExoChat</span> - Nuestro servicio exclusivo de mensajería para
                      clientes. Comunicación instantánea con nuestro equipo desde cualquier dispositivo.
                    </p>
                    <div class="hover:scale-105 active:scale-95 transition-transform">
                      <button
                        class="bg-white text-[#8a3ffc] hover:bg-gray-100 border-white group relative z-10 py-2 px-4 rounded-md"
                      >
                        <span class="group-hover:mr-2 transition-all duration-300">Probar ExoChat</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 inline-block">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/if}
  
                {#if activeTab === 'whatsapp'}
                  <div 
                    class="border-none shadow-lg bg-gradient-to-r from-[#1da851] to-[#25D366] text-white p-6 rounded-lg overflow-hidden relative"
                    in:fade={{ duration: 300 }}
                  >
                    <!-- Decorative elements -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                    <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -mb-8 -ml-8"></div>
  
                    <div class="flex items-center mb-4 relative z-10">
                      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#25D366"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                        </svg>
                      </div>
                      <h3 class="text-xl font-bold text-white">WhatsApp</h3>
                    </div>
                    <p class="mb-6 relative z-10">
                      Contáctanos directamente por WhatsApp para una respuesta rápida. Estamos disponibles en horario
                      laboral.
                    </p>
                    <div class="hover:scale-105 active:scale-95 transition-transform">
                      <button
                        class="bg-white text-[#25D366] hover:bg-gray-100 border-white group relative z-10 py-2 px-4 rounded-md"
                      >
                        <span class="group-hover:mr-2 transition-all duration-300">Abrir WhatsApp</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 inline-block">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/if}
  
                {#if activeTab === 'telegram'}
                  <div 
                    class="border-none shadow-lg bg-gradient-to-r from-[#0088cc] to-[#00aaff] text-white p-6 rounded-lg overflow-hidden relative"
                    in:fade={{ duration: 300 }}
                  >
                    <!-- Decorative elements -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                    <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -mb-8 -ml-8"></div>
  
                    <div class="flex items-center mb-4 relative z-10">
                      <div class="w-10 h-10 bg-white rounded-full text-[#0088cc] flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" stroke-width="1.5">
                          <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
                        </svg>
                      </div>
                      <h3 class="text-xl font-bold text-white">Telegram</h3>
                    </div>
                    <p class="mb-6 relative z-10">
                      También estamos en Telegram. Envíanos un mensaje para consultas técnicas o soporte avanzado.
                    </p>
                    <div class="hover:scale-105 active:scale-95 transition-transform">
                      <button
                        class="bg-white text-[#0088cc] hover:bg-gray-100 border-white group relative z-10 py-2 px-4 rounded-md"
                      >
                        <span class="group-hover:mr-2 transition-all duration-300">Abrir Telegram</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 inline-block">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
  
          <!-- VIP Service -->
          <!-- <div
            class:opacity-0={!communicationInView} 
            class:translate-y-[30px]={!communicationInView}
            class:opacity-100={communicationInView}
            class:translate-y-0={communicationInView}
            style="transition: opacity 0.7s ease-out, transform 0.7s ease-out; transition-delay: 0.3s;"
          >
            <div class="p-6 border-none shadow-xl bg-gradient-to-r from-[#7535e5] to-[#8a3ffc] text-white rounded-lg overflow-hidden relative">
            
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mt-16 -mr-16"></div>
              <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -mb-8 -ml-8"></div>
  
              <div class="flex flex-col md:flex-row items-center gap-4 relative z-10">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                    </svg>
                    <h3 class="text-xl font-bold">Servicio VIP</h3>
                  </div>
                  <p class="text-white/90 text-sm">
                    Consigue atención prioritaria y respuesta garantizada en menos de 2 horas.
                  </p>
                </div>
                <div class="hover:scale-105 active:scale-95 transition-transform">
                  <button class="bg-white hover:bg-gray-100 text-[#8a3ffc] border-none py-2 px-4 rounded-md">
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </section>
  
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes progressBar {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    
    @keyframes animate-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-gradient {
      animation: animate-gradient 3s ease infinite;
    }
    
    /* Asegurar que el foco en los elementos del formulario tiene borde morado */
    input:focus, textarea:focus {
      border-color: #8a3ffc !important;
      box-shadow: 0 0 0 3px rgba(138, 63, 252, 0.2) !important;
      outline: none !important;
    }
    
    /* Confetti animation */
    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 5;
    }
    
    .confetti {
      position: absolute;
      width: var(--size);
      height: var(--size);
      background-color: var(--color);
      top: -20px;
      left: var(--left-pos);
      opacity: 0;
      transform: rotate(var(--rotation));
      animation: fall var(--fall-speed) ease-in forwards var(--fall-delay);
    }
    
    @keyframes fall {
      0% {
        opacity: 0;
        top: -20px;
        transform: rotate(0deg);
      }
      10% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        top: 100%;
        transform: rotate(var(--rotation));
      }
    }
    
    /* Improved responsive styles for tablets */
    @media (min-width: 768px) and (max-width: 1023px) {
      .grid {
        gap: 1.5rem !important;
      }
      
      .p-6 {
        padding: 1.25rem !important;
      }
      
      .space-y-6 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.25rem !important;
      }
      
      .space-y-4 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.75rem !important;
      }
      
      /* Better form layout for tablets */
      .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      
      /* Improved spacing for tablet forms */
      input, textarea {
        font-size: 16px !important; /* Prevents zoom on iOS */
      }
    }
  </style>