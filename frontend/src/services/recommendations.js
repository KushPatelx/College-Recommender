export const requestRecommendations = async (baseUrl, formData) => {
  try {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization header nikal diya hai kyunki ab HTTP-Only cookie use ho rahi hai
      },
      credentials: "include", // 👈 Ye line browser ko cookie Express tak bhejne ki permission deti hai
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to fetch recommendations");
    }

    return data;
  } catch (error) {
    throw error;
  }
};