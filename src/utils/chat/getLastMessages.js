const getLastMessages = async () => {
  try {
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/list/last-messages`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lastMessages = await response.json();
    return lastMessages;
  } catch (error) {
    console.error('Error fetching last messages:', error);
    return [];
  }
};

export default getLastMessages;