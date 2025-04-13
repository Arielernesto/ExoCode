<script lang="ts">
const { slug, edit = false } = $props<{
    slug: string;
    edit?: boolean;
}>();

import { ArrowLeft, Calendar, User, Save, Share2, Edit } from "lucide-svelte"
import { type Post } from "interfaces/BlogInterface";
import { Query, Mutate } from "lib/apollo-client";
import { POST_BY_SLUG_QUERY, POST_UPDATE_MUTATION } from "queries/post.ts";
import Button from "lib/components/ui/button/button.svelte"
import editorjsHtml from "editorjs-to-html"
import { onMount } from "svelte";
import { convertDate } from "utils/dates";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table';
import { Toaster, toast } from 'svelte-sonner';
import { ReadImage, uploadImage } from 'utils/images';
import { user } from '../../store/store.js';

interface EditorData {
    time: number;
    blocks: any[];
}

let post: Post | null = $state(null);
let htmlParsed: string | null = $state(null);
let editor: EditorJS | null = $state(null);
let title: string = $state("");
let description: string = $state("");
let image: string | null = $state(null);
let fileUpload: File | null = $state(null);
let isAdmin: boolean = $state(false);

// Check if user is admin
user.subscribe(userData => {
    isAdmin = userData && userData.rol && userData.rol.role === 'admin';
    
    // If user is not admin and trying to edit, redirect to view mode
    if (edit && !isAdmin) {
        window.location.href = `/blog/${slug}`;
    }
});

async function getPost() {
    const { loading, data, error}: { loading: boolean, data: any, error: any} = await Query(POST_BY_SLUG_QUERY, { slug })
    
    post = data.post
  
    if (!data.post) {
    //   notFound()
    return null;
    }

    if (edit && post) {
        title = post.title || "";
        description = post.description || "";
        image = post.image || null;
    }

    const edjsParser = editorjsHtml();
    const html = edjsParser.parse(post?.content)
    htmlParsed = html
    return data.post
}

onMount(async () => {
    await getPost()
    if (edit && post?.content) {
        await initializeEditor()
    }
})

async function initializeEditor() {
    if (!post?.content) return;

    try {
        editor = new EditorJS({
            holder: 'editorjs',
            tools: {
                header: Header,
                list: List,
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: `${import.meta.env.PUBLIC_API_URL}/api/image`,
                        },
                    },
                },
                embed: Embed,
                code: {
                    class: CodeTool,
                    config: {
                        theme: 'prism-tomorrow',
                    },
                },
                table: Table,
            },
            data: post.content as EditorData,
            onChange: () => {
                console.log('El contenido ha cambiado');
            },
        });

        console.log('Editor initialized successfully')
    } catch (error) {
        console.error('Error initializing editor:', error)
    }
}

async function updatePost() {
    if (!editor) return;

    try {
        const outputData = await editor.save()
        const content = {
            slug,
            title,
            description,
            content: JSON.stringify(outputData),
            image: fileUpload || image
        }

        if (fileUpload) {
            const { data: imageData, error } = await uploadImage(content.image)
            if (error) return toast.error(error)
            content.image = imageData
        }

        const { loading, data, error: updateError }: { data: any, loading: boolean, error: any } = await Mutate(POST_UPDATE_MUTATION, content)

        if (updateError) return toast.error("Ha ocurrido un error al actualizar")
        toast.success("Publicación actualizada con éxito")
        window.location.href = `/blog/${data.updatePost.slug}`
    } catch (error) {
        console.error('Error saving post:', error)
        toast.error("Error al guardar el post")
    }
}

function OpenImage() {
    const file: HTMLElement | null = document.getElementById("file")
    file?.click()
}

async function setImage(e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
}) {
    const file: File | null = e.currentTarget.files ? e.currentTarget.files[0] : null;
    if (file) {
        fileUpload = file
        const imageUpload = await ReadImage(file);
        image = imageUpload;
    }
}

function sharePost() {
    if (navigator.share) {
        navigator.share({
            title: post?.title,
            text: post?.description,
            url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback para navegadores que no soportan la API de compartir
        navigator.clipboard.writeText(window.location.href)
            .then(() => toast.success("Link copiado al portapapeles"))
            .catch(() => toast.error("Error al copiar el link"));
    }
}

</script>

{#if post}
<div class="container max-w-4xl py-10 mt-20">
    <div class="mb-8">
        <Button variant="ghost" size="sm" class="mb-6">
            <a href="/blog" class="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to all posts
            </a>
        </Button>

        {#if edit}
            <div class="mb-4">
                <label for="title" class="font-bold">Título</label>
                <input id="title" type="text" bind:value={title} class="w-full p-2 border rounded" />
            </div>

            <div class="mb-4">
                <label for="description" class="font-bold">Descripción</label>
                <textarea id="description" bind:value={description} class="w-full p-2 border rounded h-32"></textarea>
            </div>

            <div class="mb-4">
                <label class="font-bold">Imagen</label>
                <div class="mt-2">
                    {#if image}
                        <img src={image} alt="post image" class="w-full h-[200px] object-cover rounded-md shadow-md mb-2"/>
                    {/if}
                    <input type="file" hidden id="file" onchange={(e) => setImage(e)}>
                    <Button variant="outline" onclick={OpenImage}>Cambiar Imagen</Button>
                </div>
            </div>

            <div id="editorjs" class="border border-gray-300 rounded-lg p-4 w-full mb-4 min-h-[400px]"></div>
            <Button variant="default" onclick={updatePost} class="flex items-center gap-2">
                <Save size={16} />
                Guardar Cambios
            </Button>
        {:else}
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-4xl font-bold tracking-tight">{post.title}</h1>
                {#if isAdmin}
                <Button variant="outline" size="sm" onclick={() => window.location.href = `/blog/${post?.slug}/edit`}>
                    <Edit size={16} class="mr-2" />
                    Editar
                </Button>
                {/if}
            </div>

            <div class="flex items-center gap-4 text-muted-foreground mb-8">
                <div class="flex items-center gap-2">
                    <User size={18} />
                    <span>{"Ariel Fajardo"}</span>
                </div>
                <div class="flex items-center gap-2">
                    <Calendar size={18} />
                    <time>
                        {post.content?.time ? convertDate(post.content.time) : ''}
                    </time>
                </div>
            </div>

            <div class="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                <img src={post.image} alt={post.title} class="object-cover w-full h-[400px]" />
            </div>

            <section class="max-w-none prose prose-lg break-words">
                {@html htmlParsed || ''}
            </section>

            <br>

            <div class="flex justify-between items-center">
                <Button variant="outline">
                    <a href="/blog" class="flex gap-2">
                        <ArrowLeft class="mr-2 h-4 w-4" />
                        Back to all posts
                    </a>
                </Button>

                <div class="flex items-center gap-4">
                    <Button variant="outline" size="sm" onclick={sharePost}>
                        <Share2 size={16} class="mr-2" />
                        Compartir
                    </Button>
                    <Button size="sm" variant="default" onclick={() => window.location.href = "/auth/login"}>Subscribe</Button>
                </div>
            </div>
        {/if}
    </div>
</div>
{/if}

<Toaster />

<style>
    p{
        display: flex !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        white-space: pre-wrap !important;
    }

    :global(.prose) {
        max-width: none;
    }

    :global(.prose img) {
        max-width: 100%;
        height: auto;
    }

    :global(.prose p) {
        word-break: break-word;
        overflow-wrap: break-word;
        white-space: pre-wrap;
    }

    :global(.prose h1),
    :global(.prose h2),
    :global(.prose h3),
    :global(.prose h4),
    :global(.prose h5),
    :global(.prose h6) {
        word-break: break-word;
    }

    :global(.prose pre) {
        white-space: pre-wrap;
        word-break: break-word;
    }

    :global(.prose code) {
        word-break: break-word;
    }
    :global(.ce-block__content) {
        margin: 0 !important;
    }
</style>

