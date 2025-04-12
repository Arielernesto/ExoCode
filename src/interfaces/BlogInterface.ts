import { type OutputData } from "@editorjs/editorjs"
export interface PostRequest {
    title: string
    description: string
    image: File | null | string
    content: OutputData
    categories?: string[]
}

export interface Author {
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface PostContent {
  time: number | string;
  html?: string;
  markdown?: string;
}

export interface Post {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  image: string;
  content?: PostContent;
  author?: Author;
  categories?: string[];
  tags?: string[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}