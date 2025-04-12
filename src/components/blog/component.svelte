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
  import { ReadImage, uploadImage } from 'utils/images';
  import { type PostRequest } from 'interfaces/BlogInterface';
  import { Toaster, toast } from 'svelte-sonner';
  import { Mutate } from 'lib/apollo-client';
  import { POST_CREATE_MUTATION } from 'queries/post.ts';

  let editor: EditorJS;
  let image: string | null = $state(null);
  let title: string = $state("");
  let description: string = $state("");
  let content: string = $state("");
  let fileUpload: File | null = $state(null);
  let imagePreview: string | null = $state(null);
  let categories = ['JavaScript', 'TypeScript', 'React', 'Svelte', 'CSS', 'Backend', 'DevOps'];
  let selectedCategories: string[] = $state(['JavaScript']);
  let isSubmitting: boolean = $state(false);
  let error: string | null = $state(null);
  let success: boolean = $state(false);
  let selectedImage: File | null = $state(null);
  let editorContent: any = null;

  // Configuración inicial del editor
  const initialData = {
    time: new Date().getTime(),
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Bienvenido a tu editor de blog',
          level: 2,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Este es un párrafo de ejemplo. Puedes editar este texto y agregar más bloques.',
        },
      },
    ],
  };

  onMount(() => {
    initEditor();
  });

  function initEditor() {
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
      data: initialData,
      onChange: () => {
        editor.save().then(outputData => {
          editorContent = outputData;
        });
      }
    });
  }

  async function saveContent() {
    try {
      isSubmitting = true;
      
      if (!title || !description || !selectedImage || selectedCategories.length === 0) {
        toast.error("Por favor, completa todos los campos requeridos");
        isSubmitting = false;
        return;
      }
      
      const outputData = await editor.save();
      
      // Crear objeto con la información del post
      const postData: PostRequest = {
        title,
        description,
        content: outputData,
        categories: [...selectedCategories],
        image: selectedImage
      };
      
      const { data: imageData, error: imgError } = await uploadImage(postData.image);
      if (imgError) {
        toast.error(imgError);
        isSubmitting = false;
        return;
      }
      
      postData.image = imageData;
      
      console.log("Enviando datos al servidor:", {
        title: postData.title,
        description: postData.description,
        content: JSON.stringify(postData.content),
        categories: postData.categories,
        image: postData.image
      });
      
      const { data, error: postError } = await Mutate(
        POST_CREATE_MUTATION, 
        {
          title: postData.title,
          description: postData.description,
          content: JSON.stringify(postData.content),
          categories: selectedCategories,
          image: postData.image
        }
      );
      
      if (postError) {
        toast.error("Error al crear el post: " + postError);
        isSubmitting = false;
        return;
      }
      
      // Éxito: redireccionar o mostrar mensaje
      toast.success("Post creado exitosamente");
      success = true;
      
      // Redireccionar al post creado
      setTimeout(() => {
        try {
          if (data && typeof data === 'object' && 'createPost' in data && data.createPost && typeof data.createPost === 'object' && 'slug' in data.createPost) {
            window.location.href = `/blog/${data.createPost.slug}`;
          } else {
            console.log("No se pudo obtener el slug del post, redirigiendo al blog");
            window.location.href = '/blog';
          }
        } catch (e) {
          console.error("Error en la redirección:", e);
          window.location.href = '/blog';
        }
      }, 1500);
      
    } catch (err) {
      console.error("Error al guardar el post:", err);
      toast.error("Ocurrió un error al crear el post");
    } finally {
      isSubmitting = false;
    }
  }

  function OpenImage(){
    const file : HTMLElement | null = document.getElementById("file");
    file?.click();
  }

  async function setImage(e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }) {
    const file: File | null = e.currentTarget.files ? e.currentTarget.files[0] : null;
    if (file) {
      fileUpload = file;
      selectedImage = file;
      const imageUpload = await ReadImage(file);
      image = imageUpload;
      imagePreview = imageUpload;
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
  
  // Reiniciar formulario
  function resetForm() {
    title = '';
    description = '';
    selectedCategories = [];
    selectedImage = null;
    imagePreview = null;
    initEditor();
    success = false;
  }
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <div class="mb-8 text-center">
    <h1 class="text-3xl font-bold mb-2">Crear Nuevo Artículo</h1>
    <p class="text-gray-600 dark:text-gray-400">Comparte tus conocimientos con la comunidad</p>
  </div>
  
  <Toaster richColors />
  
  {#if success}
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-8 animate-fadeIn">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-green-800 mb-2">¡Artículo creado con éxito!</h2>
        <p class="text-green-700 mb-4">Redirigiendo a tu artículo...</p>
        <button 
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          on:click={resetForm}
        >
          Crear otro artículo
        </button>
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
                on:click={() => { selectedImage = null; imagePreview = null; }}
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
            on:change={setImage}
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
            Publicando...
          {:else}
            Publicar artículo
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