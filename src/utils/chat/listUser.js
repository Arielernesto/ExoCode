
const ListUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      },
    };
  
    try {
      const url = 'list-users-by-permission';
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/list/${url}`, {
        method: 'GET',
        headers: config.headers,
        credentials: 'include'
      });
  
      const listUser = await response.json();
      console.log(listUser)
      return listUser;
    } catch (error) {
      console.log(error.message || 'No se pudo obtener la respuesta');
      console.error("Error de login:", error);
    }
  }
  
  export default ListUser;
