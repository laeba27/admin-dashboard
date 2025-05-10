
export async function authenticate(username, password) {
  //delay the response
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Demo credentials
  if (username === 'admin' && password === 'admin123') {
    return true;
  }
  
  return false;
}

// Check if user is authenticated (client-side)
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem('isAuthenticated') === 'true';
}

// Get current user
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Logout
export function logout() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
}