<script lang="ts">
  import { icons } from "../../lib/icons";

</script>

  <div class="carousel">
    <div class="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
    <div class="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
    <div class="group">
       
      {#each icons as icon, i (i)}

      <div class="p-4  w-[100px]">
        {@html icon.icon}
      </div>
           
      {/each}
    </div>
    <!-- Añade `aria-hidden` para ocultar las tarjetas duplicadas de los lectores de pantalla. -->
    <div aria-hidden={true} class="group">
        {#each icons as icon, i (i)}
          
      <div class="p-4 w-[100px]">
        {@html icon.icon}
      </div>
       
    {/each}
    </div>
  </div>
  
<!-- </div>
</div> -->


<style>
    .carousel {
    margin: 0 auto;
    position: relative;
    padding: 20px 0;
    max-width: 1250px;
    width: 100%;
    overflow: hidden;
    display: flex;
    > * {
      flex: 0 0  0 0 100% 0 0 0 0 0 100%;
    }

     &:hover .group {
      animation-play-state: paused;
    }
  }
  
  .group {
    display: flex;
    gap: 10px;
    will-change: transform; /* Deberíamos ser amables con el navegador: hazle saber qué vamos a animar. */
    animation: scrolling 30s linear infinite;
  }

  @keyframes scrolling {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .no-transition {
    transition: none !important;
  }
</style>

