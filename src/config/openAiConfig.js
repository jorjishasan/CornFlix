const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const openAiClient = {
  post: async (endpoint, data) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Request failed');
    }

    return responseData;
  },
};

export default openAiClient; 