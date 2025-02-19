import React from 'react'
import { Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/authContext';
import './App.css'
import { App } from 'framework7-react';
import Login from './login/Login'
import Dashboard from '../components/dashboard/dashboard'
import RequireAuth from '../auth/requireAuth'

function testApp() {
  const f7params = {
    name: 'project-test',
    theme: 'auto'
  };

  return (
    <React.StrictMode>
      <AuthProvider>
        <App {...f7params}>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login/>}/>
              <Route element={<RequireAuth allowedRoles={['admin', 'user']}/>}>
                <Route path='/dashboard' element={<Dashboard/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </App>
      </AuthProvider>
    </React.StrictMode>
  )
}

export default testApp
