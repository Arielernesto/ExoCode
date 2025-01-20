<script lang="ts">
  import { CheckPlusCircleSolid } from 'flowbite-svelte-icons';
    import { Check, CheckCheck, CheckCheckIcon, CheckCircle, CheckCircle2, CheckCircleIcon } from 'lucide-svelte';
  import { formatTime } from 'utils/chat/chat';
  
    export let message: string;
    export let isOwnMessage: boolean = false;
    export let timestamp: Date;
    export let status: 'sent' | 'delivered' | 'read' = 'sent';
    export let replyTo: { author: string; content: string;} | null = null;
  
   function getStatusIcon(status: string) {
    switch (status) {
      case 'sent':
        return Check ;
      case 'delivered':
        return CheckCheck;
      case 'read':
        return CheckCircleIcon;
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
      <span class="timestamp">{formatTime(timestamp)}</span>
      {#if isOwnMessage && StatusIcon}
      <span class="status-icon" aria-label={`Message ${status}`}>
        <StatusIcon size={16} class="icon-style {status === 'read' ? 'status-read' : status === 'delivered' ? 'status-delivered' : 'status-sent'}" />
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

    .reply-timestamp {
    @apply text-xs text-gray-400;
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
    
  .status-sent {
    @apply text-red-600;
  }

  .status-delivered {
    @apply text-red-600;
  }

  .status-read {
    @apply text-red-500;
  }
  
    .own-message .timestamp,
    .own-message .status-icon {
      @apply text-purple-200;
    }
  
    .other-message .timestamp {
      @apply text-gray-500;
    }
    
  </style>
  
  