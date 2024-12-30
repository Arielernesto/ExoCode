

<div class="relative outline outline-1 outline-[#d9a1ff] box group rounded-md">
  <button class="font-semibold text-[1.5rem]  bg-transparent py-[calc(1rem/3)] px-[2rem] border-none cursor-pointer text-[#F6F4EB] text-shadow relative z-[100]">
    <slot></slot>
  </button>
  <div class="absolute  rounded-md space  bottom-0 w-full h-full gap-[1.5rem] transition-opacity duration-500 opacity-0 overflow-hidden flex bg-gradient-to-r from-[#120e1e] to-[#271950] group-hover:opacity-100 ">
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 31;"></span>
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 12;"></span>
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 57;"></span>
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 93;"></span>
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 23;"></span>
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 70;"></span>
    <span class="h-[4rem] w-[0.3rem] transition-all duration-500 rounded-full clip-path-star relative bg-[#E9F8F9] animation-star" style="--i: 6;"></span>
  </div>
</div>

<style>
  .text-shadow {
    text-shadow: 2px 0px #d9a1ff, 0px 2px #d9a1ff, -2px 0px #d9a1ff, 0px -2px #d9a1ff;
  }
  .clip-path-star {
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  }

  .box:hover .space {
  opacity: 1 !important;
  }

  @keyframes space-animation {
    0% {
      transform: rotate(-30deg) translateY(calc(-52% * var(--i)));
    }
    100% {
      transform: rotate(-30deg) translateY(calc(52% * var(--i)));
    }
  }
  .animation-star {
    animation: space-animation calc(0.1s * var(--i)) linear infinite;
  }
</style>
