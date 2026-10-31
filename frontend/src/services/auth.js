import { API_BASE_URL } from '../data/config';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const registerUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });

  // Logout endpoint may return an empty response.
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }

  return true;
};