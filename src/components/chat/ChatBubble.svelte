<script lang="ts">
    import { Check, CheckCheck } from 'lucide-svelte';
  
    export let message: string;
    export let isOwnMessage: boolean = false;
    export let timestamp: string;
    export let status: 'sent' | 'delivered' | 'read' = 'sent';
    export let replyTo: { author: string; content: string } | null = null;
  
    function getStatusIcon(status: string) {
      switch (status) {
        case 'delivered':
          return Check;
        case 'read':
          return CheckCheck;
        default:
          return null;
      }
    }
  
    const StatusIcon = getStatusIcon(status);
  </script>
  
  <div class="chat-bubble {isOwnMessage ? 'own-message' : 'other-message'}">
    {#if replyTo}
      <div class="reply-content">
        <div class="reply-author">{replyTo.author}</div>
        <div class="reply-text">{replyTo.content}</div>
      </div>
    {/if}
    <div class="message-content">
      {message}
    </div>
    <div class="message-meta">
      <span class="timestamp">{timestamp}</span>
      {#if isOwnMessage && StatusIcon}
        <span class="status-icon" aria-label={`Message ${status}`}>
          <StatusIcon size={16} />
        </span>
      {/if}
    </div>
  </div>
  
  <style lang="postcss">
    .chat-bubble {
      @apply max-w-[70%] rounded-lg p-2 mb-2 relative;
    }
  
    .own-message {
      @apply bg-purple-500 text-white ml-auto;
      border-radius: 15px 15px 0 15px;
    }
  
    .other-message {
      @apply bg-gray-200 text-gray-800;
      border-radius: 15px 15px 15px 0;
    }
  
    .reply-content {
      @apply bg-opacity-50 bg-gray-700 p-2 rounded mb-1 text-sm;
    }
  
    .reply-author {
      @apply font-semibold mb-1;
    }
  
    .reply-text {
      @apply truncate;
    }
  
    .message-content {
      @apply mb-1;
    }
  
    .message-meta {
      @apply flex justify-end items-center text-xs;
    }
  
    .timestamp {
      @apply mr-1;
    }
  
    .status-icon {
      @apply flex items-center;
    }
  
    .own-message .timestamp,
    .own-message .status-icon {
      @apply text-purple-200;
    }
  
    .other-message .timestamp {
      @apply text-gray-500;
    }
  </style>
  
  