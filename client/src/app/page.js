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
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
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
                        <i className="fas fa-sign-in-alt me-2"></i>
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