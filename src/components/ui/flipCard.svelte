<script>
  export let className
</script>

<div class="flip-card {className}">
    <div class="flip-card-inner">
        <div class="flip-card-front">
           <slot name="flip-front"></slot>
        </div>
        <div class="flip-card-back">
          <slot name="flip-back"></slot>
        </div>
    </div>
</div>

<style>
  .flip-card {
    background-color: transparent;
    /* height: 254px; */
    perspective: 1000px;
    font-family: sans-serif;
  }

  .title {
    font-size: 1.5em;
    font-weight: 900;
    text-align: center;
    margin: 0;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  @media screen and (min-width: 600px){
    .flip-card:hover .flip-card-inner {
      transform: rotateY(180deg);
    }
  }

  .flip-card-front, .flip-card-back {
    /* box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2); */
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    /* border: 1px solid coral; */
    border-radius: 1rem;
  }
  @media screen and (min-width: 400px) and (max-width: 640px){
    .card-responsive-problem{
      margin-bottom: 8rem !important;
    }
  }

  .flip-card-front {
    /* background: linear-gradient(120deg, bisque 60%, rgb(255, 231, 222) 88%,
       rgb(255, 211, 195) 40%, rgba(255, 127, 80, 0.603) 48%);
    color: coral; */
    background-color: transparent;
  }

  .flip-card-back {
    /* background: linear-gradient(120deg, rgb(255, 174, 145) 30%, coral 88%,
       bisque 40%, rgb(255, 185, 160) 78%);
    color: white; */
    background-color: transparent;
    transform: rotateY(180deg);
  }
</style>
