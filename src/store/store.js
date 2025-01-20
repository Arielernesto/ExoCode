import { writable } from 'svelte/store'
export let user = writable(null);
export let usersList = writable([]);
export let selectedChat = writable(null);
export let messages = writable([]);
export let unreadcount = writable([]);
export let lastMessages = writable([]);
export let lastMessage = writable({});