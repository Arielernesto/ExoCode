<div class="main">
  <aside class="fluid">
    <div class="border">
      <div class="trail"></div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </aside>
</div>

<style>
  :root {
    --accent: purple;
    --canvas: color-mix(in lch, canvas, canvasText 1%);
    --border-r: color-mix(in lch, canvas, canvasText 10%);
    --text: color-mix(in lch, canvasText, canvas 25%);
    --border-radius: 24;
    --border-width: 3;
    --trail-size: 25;
  }
  aside {
    --font-level: 1;
    line-height: 1.5;
    container-type: inline-size;
    position: relative;
  }

  .border {
    position: absolute;
    inset: 0;
    clip-path: inset(0 0 0 0 round calc(var(--border-radius) * 1px));
    border-radius: calc(var(--border-radius) * 1px);
    background: var(--border-r);
    z-index: -1;
    border: 0;
    container-type: inline-size;
  }

  .trail {
    width: calc(var(--trail-size) * 1cqmin);
    aspect-ratio: 2 / 1;
    position: absolute;
    background: radial-gradient(
      100% 100% at right,
      var(--accent, red),
      transparent 50%
    );
    offset-path: border-box;
    offset-anchor: 100% 50%;
    animation: journey var(--speed, 6s) infinite linear;
  }
  
  @container(width > 600px) {
    .trail {
      --speed: 12s;    
    }
  }

  @keyframes journey {
    to {
      offset-distance: 100%;
    }
  }

  aside p {
    font-weight: 300;
    text-align: center;
    margin: 0;
    color: var(--text);
  }

  .content {
    background: linear-gradient(var(--canvas), var(--canvas)) padding-box,
      transparent;
    border: calc(var(--border-width) * 1px) solid transparent;
    border-radius: calc(var(--border-radius) * 1px);
    padding: clamp(1rem, 3vmin + 1rem, 6rem);
    display: grid;
    justify-content: center;
    gap: clamp(1rem, 3vmin + 1rem, 4rem);
  }

  aside footer {
    --font-level: 0.5;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    gap: 0.5rem 1rem;
  }

  footer span:nth-of-type(2) {
    color: color-mix(in lch, canvasText, canvas 70%);
  }

  aside img {
    width: 2.5rem;
    aspect-ratio: 1;
    border-radius: 50%;
  }

  /* 3D stuff */
  [data-explode='true'] aside {
    transform: scale(0.75) rotateX(-24deg) rotateY(30deg);
  }

  :root {
    --t: 1s;
    --d: 1s;
  }
  [data-explode='true'] aside {
    transition: transform var(--t);
  }

  [data-explode='true'] .border {
    transition: clip-path var(--t) calc(var(--d) * 2);
  }
  [data-explode='true'] .border {
    clip-path: inset(
      -100% -100% -100% -100% round calc(var(--border-radius) * 1px)
    );
  }
  body {
    background: radial-gradient(
        80% 80% at 75% 25%,
        hsl(280 100% 98% / 0.1),
        transparent
      ),
      radial-gradient(80% 80% at 50% 100%, hsl(180 100% 98% / 0.1), transparent),
      radial-gradient(circle at 0 0, hsl(10 100% 98% / 0.1), transparent);
    background-blend-mode: lighten;
  }

  .main * {
    transform-style: preserve-3d;
  }

  [data-explode='true'] .content {
    transition: transform var(--t) calc(var(--d) * 1),
      opacity calc(var(--t) * 0.5) calc(var(--d) * 1.5);
  }

  [data-explode='true'] .content {
    transform: translate3d(0, 0, 400px);
    opacity: 0;
  }

  .border {
    transition: clip-path var(--t);
  }

  aside {
    transition: transform var(--t) calc(var(--d) * 2);
  }

  .content {
    transition: transform var(--t) calc(var(--d) * 1),
      opacity calc(var(--t) * 0.5) calc(var(--d) * 0.5);
      width: 100%;
  }

</style>
