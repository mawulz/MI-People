// useAuth.jsx
import { useContext } from 'react';
import { AuthContext } from './auth/authContext';

// Custom hook to use the auth context
const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
