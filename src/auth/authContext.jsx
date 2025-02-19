import React, { useState, useEffect, useContext, createContext } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('authToken');
        return token ? { token } : null;
    });

    const getRoleFromToken = (token) => {
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            return decoded.role;
        } catch (error) {
            return null;
        }
    };

    const getFromToken = (key, token) => {
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            return decoded[key];
        } catch (error) {
            localStorage.removeItem('authToken')
            return null;
        }
    };


    const token = localStorage.getItem('authToken');
    const role = getRoleFromToken(token);    
    const name = getFromToken('user',token)
    const email = getFromToken('email',token)


    useEffect(() => {
        // Update localStorage whenever auth changes
        if (auth?.token) {
            localStorage.setItem('authToken', auth.token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [auth]);

    const logout = () => {
        setAuth(null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('AcessToken')
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, role, name, email }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export {AuthContext}