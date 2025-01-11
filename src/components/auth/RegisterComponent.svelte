<script  lang="ts">
  import { validateUser } from "./register";
  import { Mutate } from "lib/apollo-client";
  import { REGISTER_MUTATION } from "queries/auth";
  import { Toaster } from "lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { type User } from "./register";
  let username: string = ""
  let lastname: string = ""
  let email: string = ""
  let password: string = ""
  let confirmPassword: string = ""
  let dataErrors : {
      [key: string]: string
  } = {}

  
  async function onSubmit(event: Event) {
    event.preventDefault()
    const { data, errors } = validateUser({username, lastname, email, password, confirmPassword})
    dataErrors = errors
    const variables = { username, lastname, password, email }
    const { loading, data: petData, error: petError}: { loading: boolean, data: any, error: any } = await Mutate(REGISTER_MUTATION, variables)
    if (petError) {
      if (petError?.cause.extensions.path == "email") return toast.error(petError.cause.message)
      return toast.error("Ha ocurrido un error")
    }

    toast.success("Usted se ha registrado con éxito")
    window.location.href = "/"
    
  }
</script>


<Toaster></Toaster>
<form class="form shadow-lg" on:submit={onSubmit}>
    <p class="title text-purple-500">Registrarse</p>
    <p class="message">Registrese en nuestra plataforma</p>
        <div class="flex">
        <label>
            <input bind:value={username} required  placeholder="" type="text" class="input" >
            <span>Nombre</span>
            <span class="text-red-500 text-sm font-bold">{dataErrors?.name}</span>
        </label>
        <label>
            <input bind:value={lastname} required placeholder="" type="text" class="input">
            <span>Apellido</span>
            <span class="text-red-500 text-sm font-bold">{dataErrors?.lastname}</span>
        </label>
    </div>  
            
    <label>
        <input bind:value={email} required placeholder="" type="email" class="input">
        <span>Email</span>
        <span class="text-red-500 text-sm font-bold">{dataErrors?.email}</span>
    </label> 
        
    <label>
        <input bind:value={password} required placeholder="" type="password" class="input">
        <span>Contraseña</span>
        <span class="text-red-500 text-sm font-bold">{dataErrors?.password}</span>
    </label>
    <label>
        <input bind:value={confirmPassword} required placeholder="" type="password" class="input">
        <span>Confirmar Contraseña</span>
        <span class="text-red-500 text-sm font-bold">{dataErrors?.confirmPassword}</span>
    </label>
    <button class="submit" type="submit">Crear Cuenta</button>
    <p class="signin">Ya tienes un cuenta? <a href="/auth/login">Inicia sesión</a> </p>
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    position: relative;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }

  .title::before,.title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #a855f7 ;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color: #a855f7;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .message, .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: #a855f7;
    text-decoration: none;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .input{
    background-color: #fff;
  }
  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,.form label .input:valid + span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .form label .input:valid + span {
    color: green;
  }

  .submit {
    border: none;
    outline: none;
    background-color: #a855f7;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    transition: .4s ease
  }

  .submit:hover {
    background-color: #5c1d96;
    transition: .4s ease
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
</style>
