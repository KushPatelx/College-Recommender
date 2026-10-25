export async function requestRecommendations(baseUrl, payloadData, token) {
  const response = await fetch(`${baseUrl}/api/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "true",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payloadData),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("401 Unauthorized");
  }

  if (!response.ok) {
    let message = "Failed to fetch recommendations from server.";
    try {
      const errorData = await response.json();
      message = errorData.detail || errorData.error || message;
    } catch {
      // Keep the fallback message when the server response isn't JSON.
    }
    throw new Error(message);
  }

  return response.json();
}
