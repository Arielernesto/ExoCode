<script lang="ts">
  import { onMount } from 'svelte';
  import EditorJS from '@editorjs/editorjs';
  import Header from '@editorjs/header';
  import List from '@editorjs/list';
  import ImageTool from '@editorjs/image';
  import Embed from '@editorjs/embed';
  import CodeTool from '@editorjs/code';
  import Table from '@editorjs/table';
  import 'prismjs/themes/prism-tomorrow.css';
  import { Plus, Save } from 'lucide-svelte';
  import { ReadImage, uploadImage } from 'utils/images';
  import { type Post, type PostRequest } from 'interfaces/BlogInterface';
  import { Toaster, toast } from 'svelte-sonner';
  import { Mutate, Query } from 'lib/apollo-client';
  import { POST_BY_SLUG_QUERY, POST_UPDATE_MUTATION } from 'queries/post.ts';

  // Propiedades externas usando runes
  const { slug } = $props<{ slug: string }>();

  let editor: EditorJS;
  let image: string | null = $state(null);
  let title: string = $state("");
  let description: string = $state("");
  let content: any = $state(null);
  let fileUpload: File | null = $state(null);
  let imagePreview: string | null = $state(null);
  let categories = ['JavaScript', 'TypeScript', 'React', 'Svelte', 'CSS', 'Backend', 'DevOps'];
  let selectedCategories: string[] = $state([]);
  let isSubmitting: boolean = $state(false);
  let isLoading: boolean = $state(true);
  let error: string | null = $state(null);
  let success: boolean = $state(false);
  let selectedImage: File | null = $state(null);
  let existingImageUrl: string | null = $state(null);
  let post: Post | null = $state(null);

  onMount(async () => {
    await fetchPostData();
  });

  async function fetchPostData() {
    try {
      isLoading = true;
      const { data, error: queryError } = await Query(POST_BY_SLUG_QUERY, { slug });
      
      if (queryError) {
        toast.error("Error al cargar el post");
        console.error(queryError);
        return;
      }
      
      if (data && data.post) {
        post = data.post;
        title = post.title;
        description = post.description;
        existingImageUrl = post.image;
        imagePreview = post.image;
        selectedCategories = post.categories || [];
        content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
        
        // Wait for the next tick to ensure DOM is updated
        setTimeout(() => {
          initEditor(content);
        }, 0);
      } else {
        toast.error("Post no encontrado");
        setTimeout(() => {
          window.location.href = '/blog';
        }, 1500);
      }
    } catch (err) {
      console.error("Error al cargar el post:", err);
      toast.error("Error al cargar el post");
    } finally {
      isLoading = false;
    }
  }

  function initEditor(initialData: any = null) {
    const editorElement = document.getElementById('editorjs');
    
    if (!editorElement) {
      console.error('Editor element not found');
      toast.error("Error al inicializar el editor");
      return;
    }
    
    const editorData = initialData || {
      time: new Date().getTime(),
      blocks: [
        {
          type: 'header',
          data: {
            text: 'Comienza a escribir aquí',
            level: 2,
          },
        },
      ],
    };

    editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${import.meta.env.PUBLIC_API_URL || ''}/api/image`,
              byUrl: `${import.meta.env.PUBLIC_API_URL || ''}/api/image-by-url`
            },
            field: 'image',
            types: 'image/*'
          }
        },
        embed: Embed,
        code: CodeTool,
        table: Table
      },
      data: editorData,
      onChange: () => {
        editor.save().then(outputData => {
          content = outputData;
        });
      }
    });
  }

  async function handleImageChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file: File | null = target.files ? target.files[0] : null;
    
    if (file) {
      selectedImage = file;
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (result) {
          imagePreview = result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async function saveContent() {
    try {
      isSubmitting = true;
      
      if (!title || !description || selectedCategories.length === 0) {
        toast.error("Por favor, completa todos los campos requeridos");
        isSubmitting = false;
        return;
      }
      
      const outputData = await editor.save();
      
      // Preparar datos para actualización
      const updateData: any = {
        slug,
        title,
        description,
        content: JSON.stringify(outputData),
        categories: selectedCategories
      };
      
      // Si se seleccionó una nueva imagen, subirla
      if (selectedImage) {
        const { data: imageData, error: imgError } = await uploadImage(selectedImage);
        if (imgError) {
          toast.error(imgError);
          isSubmitting = false;
          return;
        }
        updateData.image = imageData;
      }
      
      console.log("Enviando datos de actualización:", updateData);
      
      const { data, error: updateError } = await Mutate(
        POST_UPDATE_MUTATION, 
        updateData
      );
      
      if (updateError) {
        toast.error("Error al actualizar el post: " + updateError);
        isSubmitting = false;
        return;
      }
      
      // Éxito
      toast.success("Post actualizado exitosamente");
      success = true;
      
      // Redireccionar a la vista del post
      setTimeout(() => {
        try {
          if (data && typeof data === 'object' && 'updatePost' in data && data.updatePost && typeof data.updatePost === 'object' && 'slug' in data.updatePost) {
            window.location.href = `/blog/${data.updatePost.slug}`;
          } else {
            console.log("No se pudo obtener el slug del post actualizado, redirigiendo al blog");
            window.location.href = '/blog';
          }
        } catch (e) {
          console.error("Error en la redirección:", e);
          window.location.href = '/blog';
        }
      }, 1500);
      
    } catch (err) {
      console.error("Error al actualizar el post:", err);
      toast.error("Ocurrió un error al actualizar el post");
    } finally {
      isSubmitting = false;
    }
  }

  // Manejo de categorías
  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      if (selectedCategories.length < 3) {
        selectedCategories = [...selectedCategories, category];
      } else {
        toast.error("Máximo 3 categorías permitidas");
      }
    }
  }
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <div class="mb-8 text-center">
    <h1 class="text-3xl font-bold mb-2">Editar Artículo</h1>
    <p class="text-gray-600 dark:text-gray-400">Actualiza tu contenido</p>
  </div>
  
  <Toaster richColors />
  
  {#if isLoading}
    <div class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-gradient-to-r from-primary/30 to-primary/10"></div>
        <div class="mt-4 text-sm text-gray-500">Cargando artículo...</div>
      </div>
    </div>
  {:else if success}
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-8 animate-fadeIn">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-green-800 mb-2">¡Artículo actualizado con éxito!</h2>
        <p class="text-green-700 mb-4">Redirigiendo a tu artículo...</p>
      </div>
    </div>
  {:else}
    <div class="space-y-8">
      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      {/if}
      
      <!-- Título -->
      <div>
        <label for="title" class="block font-medium text-gray-700 dark:text-gray-300 mb-2">Título del artículo *</label>
        <input 
          type="text" 
          id="title" 
          bind:value={title} 
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white dark:bg-gray-800 dark:text-white"
          placeholder="Escribe un título descriptivo..."
          required
        />
      </div>
      
      <!-- Descripción -->
      <div>
        <label for="description" class="block font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción breve *</label>
        <textarea 
          id="description" 
          bind:value={description} 
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white dark:bg-gray-800 dark:text-white"
          placeholder="Resume el contenido de tu artículo en 2-3 frases..."
          rows="3"
          required
        ></textarea>
      </div>
      
      <!-- Imagen destacada -->
      <div>
        <label for="image" class="block font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen destacada *</label>
        <div class="mt-1 flex items-center">
          {#if imagePreview}
            <div class="relative">
              <img src={imagePreview} alt="Vista previa" class="h-40 w-auto rounded-lg object-cover" />
              <button 
                type="button"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                on:click={() => { selectedImage = null; imagePreview = existingImageUrl; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          {:else}
            <label for="image-upload" class="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg p-8 w-full flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="mt-2 block text-gray-600 dark:text-gray-400">Haz clic para subir una imagen</span>
              <span class="mt-1 text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF hasta 5MB</span>
            </label>
          {/if}
          <input 
            id="image-upload" 
            type="file" 
            accept="image/*"
            on:change={handleImageChange}
            class="hidden"
          />
        </div>
      </div>
      
      <!-- Categorías -->
      <div>
        <label class="block font-medium text-gray-700 dark:text-gray-300 mb-2">Categorías * (máximo 3)</label>
        <div class="flex flex-wrap gap-2">
          {#each categories as category}
            <button 
              type="button" 
              class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {selectedCategories.includes(category) ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
              on:click={() => toggleCategory(category)}
            >
              {category}
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Editor de contenido -->
      <div>
        <label class="block font-medium text-gray-700 dark:text-gray-300 mb-2">Contenido del artículo *</label>
        <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <div id="editorjs" class="min-h-[400px] p-4"></div>
        </div>
      </div>
      
      <!-- Botón de envío -->
      <div class="flex justify-end">
        <button 
          class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
          on:click={saveContent}
        >
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
          {:else}
            <Save size={18} class="mr-2" />
            Guardar cambios
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Animaciones */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  /* Animación del spinner */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Estilos para el Editor.js */
  :global(.ce-block__content) {
    max-width: 100%;
    margin: 0;
  }
  
  :global(.ce-toolbar__content) {
    max-width: 100%;
  }
  
  :global(.codex-editor) {
    padding: 0 !important;
  }
</style> 