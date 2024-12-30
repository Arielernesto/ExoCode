<script>
  export let text
</script>

<button class="button" data-text={text}>
    <span class="actual-text">&nbsp;{text}&nbsp;</span>
    <span aria-hidden="true" class="hover-text">&nbsp;{text}&nbsp;</span>
</button>

<style>
  /* === removing default button style ===*/
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  /* button styling */
  .button {
    --border-right: 6px;
    --text-stroke-color: #111827;
    --animation-color: #a855f7;
    text-decoration: none;
    position: relative;
    color: #111827;
  }
  /* this is the text, when you hover on button */
  .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    text-wrap: nowrap;
    overflow: hidden;
    transition: 0.8s;
  }
  /* hover */
  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color))
  }
</style>
