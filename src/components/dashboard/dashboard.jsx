import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import '../dashboard/dashboard.css'
import ProfileIcon from '../../assets/person-circle.svg'
import Swal from 'sweetalert2'
import Navbar from '../kit/customNavbar'
import { replace, useNavigate } from 'react-router-dom';
import useAuth from '../../useAuth'

function userDashboard() {
    const [user, setUser] = useState({});
    const [userInput, setInputUser] = useState({
        name: '',
        email: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [error, setError] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const { role } = useAuth();
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);
    
    const token = localStorage.getItem('authToken');

    
    const fetchUser = async () => {
        try {
            const response = await api.get('user/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data.data;
            setInputUser({
                name: data.name,
                email: data.email,
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            setUser(data);
        } catch (error) {
        } finally {
            setTimeout(() => setContentVisible(true), 50);
        }
    };
    const handleInputChange = (field) => (e) => {
        setInputUser({ ...userInput, [field]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        
        const result = await Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Apakah anda yakin ingin merubah profile anda?',
            html: `Jika Iya, Password Harap Dicatat : <strong>${userInput.confirm_password}</strong><br/>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Iya, Simpan!',
            cancelButtonText: 'Tidak, Batalkan!',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        })
        if(result.isConfirmed){
            try {
                if (disabled) {
                    return;
                }
                if (userInput.new_password !== userInput.confirm_password) {
                    setError({
                        general: 'Konfirmasi password baru tidak cocok.'
                    });
                    fetchUser();
                    return;
                }
                if (userInput.new_password.length < 8 && userInput.current_password) {
                    setError({
                        general: 'Password Baru Minimal 8 Karakter.'
                    });
                    fetchUser();
                    return;
                }
                setDisabled(true);
                const response = await api.put('user/profile', {
                    name: userInput.name,
                    email: userInput.email,
                    current_password: userInput.current_password,
                    new_password: userInput.new_password,
                    confirm_password: userInput.confirm_password
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile updated successfully',
                });
                fetchUser();
            } catch (error) {
                const errorData = error.response?.data;
                if (errorData?.status === 400) {
                    setError({ general: 'Password saat ini tidak valid.' });
                } else if (errorData?.code === 'EMAIL_ALREADY_EXISTS') {
                    setError({ email: 'Email sudah digunakan oleh pengguna lain.' });
                } else if (errorData?.code === 'PASSWORDS_DO_NOT_MATCH') {
                    setError({
                        confirm_password: 'Konfirmasi password baru tidak cocok.'
                    });
                } else if (errorData?.msg === 'Current password is incorrect') {
                    setError({ current_password: 'Current Password Salah' });
                } else {
                    setError({ general: 'Terjadi kesalahan. Silakan coba lagi.' });
                }
                if (errorData?.msg?.email[0] === 'The email has already been taken.') {
                    setError({ email: 'Email Sudah Diambil' });
                }
            } finally {
                setDisabled(false);
            }
        } else {
            Swal.fire({
                title: 'Dibatalkan',
                text: 'Tidak ada perubahan yang terjadi di Profile',
                icon: 'warning',
            });
        }
    };

    return (
        <>
        <Navbar title={'Dashboard'}/>
        <div className="m-12 Ygrid grid-cols-6 grid-rows-3">
            <div className="col-span-2 col-start-2 place-items-center">
                <div className="flex bg-slate-200 gap-4 justify-content-center py-4 px-2 border w-80">
                    <img src={ProfileIcon} alt="" style={{ minWidth: '55px' }}/>
                    <div className='grid'>
                        <h2 className="capitalize font-bold">{user.name || 'N/A'}</h2>
                        <h5 className="">{user.role || 'N/A'}</h5>
                        <h5 className="capitalize">Department {user.department && user.department.name || 'N/A'}</h5>
                        <h5 className="capitalize">Divisi {user.department && user.department.divisi?.name || 'N/A'}</h5>
                    </div>
                </div>
            </div>
            <div className='col-start-2 col-span-2 row-start-2 justify-self-center w-80'>
                {/* <p>Welcome back!</p>
                <p>{user.name}</p> */}
                {
                    role == 'admin' &&
                    <button className="py-3 border" onClick={() => navigate('/list-department')}>
                        <span>Department</span>
                    </button>
                }
            
            </div>
            <div className="col-span-3 row-span-3 col-start-4 ml-2">
                {/* <p className='font-bold text-2xl'>Edit Profile</p> */}
                <div className="w-120 p-3 border">
                    <form onSubmit={handleSubmit} className=''>
                        <div className="my-3">
                            <label htmlFor="username" className="label-input">Username</label>
                            <div className='border px-2 py-1 bg-slate-50 w-auto'>
                                <input
                                    className='w-full'
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={userInput.name}
                                    onChange={handleInputChange('name')}
                                />
                            </div>
                        </div>
                        <div className="my-3">
                            <label htmlFor="email" className="label-input">Email</label>
                            <div className='border px-2 py-1 bg-slate-50'>
                                <input
                                    className='w-full'
                                    id="email"
                                    type="text"
                                    placeholder="Email"
                                    value={userInput.email}
                                    onChange={handleInputChange('email')}
                                    required
                                />
                            </div>
                        </div>
                        <div className="my-3">
                            <label htmlFor="oldPassword" className="label-input">Old Password</label>
                            <div className="border px-2 py-1  bg-slate-50">
                                <input
                                    className="w-full"
                                    id="oldPassword"
                                    type={oldPasswordVisible ? "text" : "password"}
                                    placeholder="Input current password"
                                    value={userInput.current_password}
                                    onChange={handleInputChange('current_password')}
                                />
                            </div>
                        </div>
                        <div className="my-3">
                            <label htmlFor="newPassword" className="label-input">New Password</label>
                            <div className="border px-2 py-1 bg-slate-50">
                                <input
                                    className="w-full"
                                    id="newPassword"
                                    type={newPasswordVisible ? "text" : "password"}
                                    placeholder="Input new password"
                                    value={userInput.new_password}
                                    onChange={handleInputChange('new_password')}
                                />
                            </div>
                        </div>
                        <div className="confirmInput edit-input">
                            <label htmlFor="confirmPassword" className="label-input">Confirm Password</label>
                            <div className="border px-2 py-1 bg-slate-50">
                                <input
                                    className="w-full"
                                    id="confirmPassword"
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={userInput.confirm_password}
                                    onChange={handleInputChange('confirm_password')}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-amber-500">Password harap dicatat!</p>
                        {/* Display error messages */}
                        {error.general && <p className="error">{error.general}</p>}
                        {/* BUTTON SUBMIT */}
                        <div className="">
                            <div className="border">
                                <button className="py-3" disabled={disabled}>
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default userDashboard;