// Login.jsx
import React, { useState, useEffect } from 'react';
import { Page, Block } from 'framework7-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import useAuth from '../../useAuth';
import { jwtDecode } from 'jwt-decode';
function Login() {
    const navigate = useNavigate();
    const { setAuth, auth } = useAuth();
    const [credential, setCredential] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = jwtDecode(token);
            const role = decoded.role;

            if (role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else if (role === 'user') {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [navigate]);

    const handleInputChange = (field) => (e) => {
        setCredential({ ...credential, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (disabled) {
                return;
            }
            setDisabled(true)
            // Post login credentials to the API
            const response = await api.post('login', {
                email: credential.email,
                password: credential.password
            });
    
            const token = response.data.access_token;
            
            // Store token in localStorage
            localStorage.setItem('authToken', token);; 
    
            // Set authentication state
            setAuth({
                email: credential.email,
                token,
                role: ''
            });
    
            // Decode token to get role
            const decoded = jwtDecode(token);
            const role = decoded.role;
    
            // Navigate based on role
            if (role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else if (role === 'user') {
                navigate('/dashboard', { replace: true });
            } else {
                // Handle cases where the role is not recognized
                setErrorMessage('Login failed: Unrecognized role');
            }
        } catch (error) {
            // Handle errors during login
            setErrorMessage('Login failed: ' + (error.response?.data?.message || error.message));
            if (error.response.status === 401) {
                setErrorMessage('Email Atau Password Anda Salah')
            }
        } finally {
            setDisabled(false)
        }
    };
    
    return (
        <div className='h-screen place-content-center justify-items-center'>
            <div className='grid bg-slate-100 border pb-10 w-80 justify-content-center'>
            <p className='place-self-center font-bold text-2xl !mb-0'>Login</p>
                <form onSubmit={handleSubmit} className='align-items-center'>
                    <div className=''>
                        <p className=''>Email</p>
                        <div className='bg-white px-4 py-2 w-3xs border'>
                            <input 
                                type="email" 
                                className='text-lg w-full'
                                placeholder='Email'
                                value={credential.email}
                                onChange={handleInputChange('email')}
                                required
                            />
                        </div>
                    </div>
                    <div className=''>
                        <p className=''>Password</p>
                        <div className='bg-white px-4 py-2 border'>
                            <input 
                                type="password" 
                                placeholder='Password'
                                value={credential.password}
                                onChange={handleInputChange('password')}
                                className='text-lg w-full'
                                required
                            />
                        </div>
                    </div>
                    {errorMessage && (
                        <div className='my-2 text-red-500 text-sm text-center'>
                            {errorMessage}
                        </div>
                    )}
                    <div className="submit flex justify-center px-2 mt-6">
                        <button 
                            type='submit' 
                            disabled={disabled}
                            className='bg-gray-200 py-3 px-2'
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;



