<a href="#">
    <div class="buuton">
        <slot></slot>
    </div>
    <div class="back"></div>
</a>
  
  <style>
    a {
      color: white;
      position: relative;
    }
    .buuton {
      font-weight: 600;
      border-radius: 2em;
      padding: 0.75rem 1.5rem;
      background-color: rgba(255, 255, 255, 0.253);
      backdrop-filter: blur(10px);
      transform: scale(1.1);
      transition: 0.2s ease-in-out;
    }
    .back {
      position: absolute;
      background: linear-gradient(20deg, rgb(6, 174, 216) 0%, rgb(85, 31, 200));
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1;
      border-radius: 2em;
      box-shadow: -5px 0 10px rgb(140, 12, 147), 5px 0 10px rgb(85, 31, 200);
      transform: translateY(10px);
    }
    .buuton:hover {
      transform: translateY(10px);
      box-shadow: -10px 0 50px rgba(241, 0, 108, 0.352),
        10px 0 50px rgb(85, 31, 200);
    }
  </style>
  