<script lang="ts">
    import { Motion, useAnimation, animate } from "svelte-motion";
     import {
        ChevronRightIcon,
    } from "lucide-svelte";
    import { cn } from "lib/utils";
    import { onMount } from "svelte";
    let element: HTMLDivElement | null = null;
    let isOpen = false;
    export let className = ""
    const handleClickOutside = (event) => {
        if (element && !element.contains(event.target)) {
            isOpen = false;
        }
    };

onMount(() => {
  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
});
    //  List Items
    export let items = []
    let svgControls = useAnimation();
  
    //  Ui List
    let list = {
      visible: {
        clipPath: "inset(0% 0% 0% 0% round 12px)",
        transition: {
          type: "spring",
          bounce: 0,
        },
      },
      hidden: {
        clipPath: "inset(10% 50% 90% 50% round 12px)",
        transition: {
          duration: 0.3,
          type: "spring",
          bounce: 0,
        },
      },
    };
    //  Li Items
    let variants = {
      visible: (i) => ({
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.3,
          delay: i * 0.15,
        },
      }),
      hidden: {
        opacity: 0,
        scale: 0.3,
        filter: "blur(20px)",
      },
    };
  </script>
  
  <div class={cn(`z-10002 ${className}`)}  bind:this={element} >
    <Motion
      whileTap={{
        scale: 0.97,
      }}
      let:motion
    >
      <button
        use:motion
        on:click={() => (isOpen = !isOpen)}
      >
            <slot/>
      </button>

    <Motion
          animate={isOpen ? "visible" : "hidden"}
        variants={list}
        initial="hidden"
        let:motion
      >
        <ul
          use:motion
          class={cn(
            "absolute z-[1] max-w-[200px] w-full space-y-3 p-2.5 bg-white border rounded-xl comp",
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          {#each items as item, i}
            <Motion
              custom={i + 1}
              {variants}
              initial="hidden"
              animate={isOpen ? "visible" : "hidden"}
              let:motion
            >
              <li use:motion>
                <a
                  href={item?.link}
                  class={cn(
                    "group flex items-center gap-2 rounded-md border border-transparent text-black hover:text-neutral-700 focus-visible:text-neutral-300 focus-visible:border-neutral-800 focus-visible:outline-none",
                    item?.customStyle
                  )}
                >
                <svelte:component
                this={item.icon}
                size={16}
                    strokeWidth={1.4}
                  />
                  <span class="flex items-center gap-1 text-sm font-medium">
                    {item.name}
                    <ChevronRightIcon
                      size={12}
                      class="-translate-x-1 scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all"
                    />
                  </span>
                </a>
              </li>
            </Motion>
          {/each}
        </ul>
    </Motion>
</Motion>
</div>
  
<style>
  
    @media screen and (max-width: 1200px) {
      .comp {
        right: 20px;
      }
    }
  </style>
