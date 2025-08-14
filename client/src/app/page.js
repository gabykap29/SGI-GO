"use client"
import { useState } from 'react';
import { loginUser } from '../../hooks/auth';
import { handleError, handleSuccess } from '../../hooks/toaster';
import { Toaster } from 'sonner';
import Image from 'next/image';
export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const data = await loginUser(formData);
      if (data.error){
        handleError("Credenciales invalidas!");
      } else {
        handleSuccess("Seccion iniciada correctamente!");
        setTimeout(() => {
          window.location.href = "/home";
        }, 3000);
      }
    } catch(error){
      console.error(error.message);
      handleError(error.message);
    }
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-sm-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h4 className="card-title fw-bold mb-3">SISTEMA DE GESTIÓN DE INFORMES</h4>
                    <div className="mb-3">
                      <Image
                        src="/icon.png"
                        alt="Logo SGI"
                        width={120}
                        height={80}
                        className="img-fluid"
                      />
                    </div>
                    <p className="text-muted">Inicia sesión con tu usuario para continuar</p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label fw-medium">
                        Usuario
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-2"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Usuario"
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-medium">
                        Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-lg border-2"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu contraseña"
                          required
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Recordarme
                        </label>
                      </div>
                      <a href="#" className="text-decoration-none text-muted small">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    {/* Login Button */}
                    <div className="d-grid mb-3">
                      <button
                        type="submit"
                        className="btn btn-dark btn-lg fw-medium py-3"
                      >
                        Iniciar Sesión
                      </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <p className="text-muted mb-0 small">
                        ¿Problemas para acceder?{' '}
                        <a href="#" className="text-decoration-none fw-medium">
                          Contacta al administrador
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster 
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />  
      </div>
    </>
  );
}