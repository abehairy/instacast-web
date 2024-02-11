import React, { createContext, useState, useEffect } from 'react';

// Define the shape of your context state and functions
export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => { },
  logout: () => { },
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    loading: true, // Initialized as true to indicate loading state
  });

  // Simulated login function
  const login = (credentials) => {
    const fakeToken = 'fake-jwt-token'; // Simulated token
    const fakeUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Persist user's authentication in local storage
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));

    // Update state with user info
    setAuthState({ token: fakeToken, user: fakeUser, loading: false });
  };

  // Simulated logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({ token: null, user: null, loading: false });
  };

  // Effect for rehydrating auth state from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserJson = localStorage.getItem('user');
    const savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;

    setAuthState({
      token: savedToken,
      user: savedUser,
      loading: false, // Set loading to false after rehydration
    });
  }, []);

  // Pass the auth state and auth functions via context
  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
