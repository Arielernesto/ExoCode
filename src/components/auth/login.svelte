<script  lang="ts">
  import { validateUserLogin } from "./login";
  import { Mutate } from "lib/apollo-client";
  import { LOGIN_MUTATION } from "queries/auth";
  import { Toaster } from "lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  
  let email: string = ""
  let password: string = ""
  let dataErrors : {
      [key: string]: string | boolean
  } = {}

  async function onSubmit(event: Event) {
    event.preventDefault()
    const { data, errors } = validateUserLogin({email, password})
    dataErrors = errors
    if (dataErrors.status) return
    const variables = { password, email }
    const { loading, data: petData, error: petError}: { loading: boolean, data: any, error: any} = await Mutate(LOGIN_MUTATION, variables)
    if (petError) {
      console.log(petError)
      return toast.error("Ha ocurrido un error")
    }
    
    toast.success("Usuario logueado con éxito")
    
    return window.location.href = "/"
  }
</script>

<Toaster></Toaster>
<form class="form shadow-lg" on:submit={onSubmit}>
    <p class="title text-purple-500">Iniciar Sesión</p>
    <p class="message">Inicie sesión en nuestra plataforma</p>
      
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

    <button class="submit" type="submit">Iniciar Sesión</button>
    <p class="signin">No tienes una cuenta? <a href="/auth/register">Registrarse</a> </p>
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 450px;
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

  .input{
    background-color: #fff !important;
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
dssd