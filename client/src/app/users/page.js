"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { Sidebar } from '../../../components/Sidebard';
import { Header } from '../../../components/Header';
import { handleError, handleSuccess } from '../../../hooks/toaster';
import { Toaster } from 'sonner';
import useTheme from '../../../hooks/useTheme';
import { getUsers, createUser, deleteUser, updateUser } from '../../../hooks/handleUser';
import { useAuthWithRole } from '../../../hooks/useAuth';

export default function GestionUsuarios() {
  const { isAuthenticated, hasAccess, isLoading } = useAuthWithRole(['admin', 'moderator']);
  const { theme, toggleTheme, isDark } = useTheme();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    last_name: '',
    username: '',
    pass: '',
    role: 'user'
  });
  const [creating, setCreating] = useState(false);


  // Redirigir si no tiene acceso
  useEffect(() => {
    if (!isLoading && !hasAccess) {
      handleError('No tienes permisos para acceder a esta sección');
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    }
  }, [isLoading, hasAccess, router]);

  // Función para formatear el nombre completo
  const getFullName = (user) => {
    return `${user.name} ${user.last_name}`;
  };

  // Función para determinar el estado del usuario basado en last_login
  const getUserStatus = (user) => {
    if (!user.last_login) return 'Nunca';
    const lastLogin = new Date(user.last_login);
    const now = new Date();
    const diffInDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Activo';
    if (diffInDays <= 7) return 'Reciente';
    if (diffInDays <= 30) return 'Inactivo';
    return 'Muy inactivo';
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Nunca';
    const date = new Date(lastLogin);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportsCount = (user) => {
    return user.reports ? user.reports.length : 0;
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        handleError('Error al cargar usuarios: ' + error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await createUser(newUser);
      // Recargar la lista de usuarios
      const usersData = await getUsers();
      setUsers(usersData);
      setShowCreateModal(false);
      setNewUser({ name: '', last_name: '', username: '', pass: '', role: 'user' });
      handleSuccess('Usuario creado exitosamente');
    } catch (error) {
      handleError('Error al crear usuario: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await deleteUser(userId);
        // Recargar la lista de usuarios
        const usersData = await getUsers();
        setUsers(usersData);
        handleSuccess('Usuario eliminado exitosamente');
      } catch (error) {
        handleError('Error al eliminar usuario: ' + error.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      username: user.username,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      // Crear objeto de datos para actualizar
      const updateData = {
        name: editingUser.name,
        last_name: editingUser.last_name,
        username: editingUser.username,
        role: editingUser.role
      };
      
      // Solo incluir la contraseña si se proporcionó una nueva
      if (editingUser.password && editingUser.password.trim() !== '') {
        updateData.pass = editingUser.password;
      }
      
      await updateUser(editingUser.id, updateData);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      setShowEditModal(false);
      setEditingUser(null);
      handleSuccess('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      handleError('Error al actualizar el usuario: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    getFullName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-danger text-white';
      case 'moderator':
        return 'bg-warning text-dark';
      case 'user':
        return 'bg-primary text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white';
      case 'inactive':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark';
    }
  };

  // Mostrar loading o mensaje de acceso denegado
  if (isLoading || !hasAccess) {
    return (
      <>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
          rel="stylesheet" 
        />
        
        <div className={`d-flex ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className={`flex-grow-1 min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <Header 
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
            
            <div className={`container-fluid py-4 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                  <div className="text-danger mb-3">
                    <i className="fas fa-exclamation-triangle fa-3x"></i>
                  </div>
                  <h5 className="text-muted">{isLoading ? 'Verificando permisos...' : 'Acceso Denegado'}</h5>
                  <p className="text-muted">{isLoading ? 'Validando credenciales...' : 'No tienes permisos para acceder a esta sección.'}</p>
                  {!isLoading && <p className="text-muted">Redirigiendo...</p>}
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
      </>
    );
  }

  if (loading) {
    return (
      <>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
          rel="stylesheet" 
        />
        
        <div className={`d-flex ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className={`flex-grow-1 min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <Header 
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
            
            <div className={`container-fluid py-4 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center loading-state fade-in">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="text-muted mb-0">Cargando usuarios...</p>
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
      </>
    );
  }

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
        rel="stylesheet" 
      />
      
      <style>
        {`
          /* Estilos para modo oscuro en modales */
          ${isDark ? `
            .modal-content {
              background-color: #1f1f1f !important;
              border: 1px solid #404040 !important;
            }
            .modal-header {
              background-color: #1f1f1f !important;
              border-bottom: 1px solid #404040 !important;
            }
            .modal-body {
              background-color: #1f1f1f !important;
            }
            .modal-footer {
              background-color: #1f1f1f !important;
              border-top: 1px solid #404040 !important;
            }
            .modal-title {
              color: #f5f5f5 !important;
            }
            .form-label {
              color: #f5f5f5 !important;
            }
            .form-control {
              background-color: #262626 !important;
              border: 1px solid #404040 !important;
              color: #f5f5f5 !important;
            }
            .form-control:focus {
              background-color: #262626 !important;
              border-color: #2563eb !important;
              color: #f5f5f5 !important;
              box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25) !important;
            }
            .form-select {
              background-color: #262626 !important;
              border: 1px solid #404040 !important;
              color: #f5f5f5 !important;
            }
            .form-select:focus {
              background-color: #262626 !important;
              border-color: #2563eb !important;
              color: #f5f5f5 !important;
              box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25) !important;
            }
            .btn-close {
              filter: invert(1) grayscale(100%) brightness(200%);
            }
          ` : ''}
        `}
      </style>
      
      <div className={`d-flex ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`flex-grow-1 min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
          <Header 
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
          
          <div className={`container-fluid py-4 ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            {/* Title Card */}
            <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-light border-secondary' : 'bg-white text-dark'}`}>
              <div className={`card-body ${isDark ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="h3 mb-1">Gestión de Usuarios</h1>
                    <p className="text-muted mb-0">Administra los usuarios del sistema</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-users fa-2x text-primary me-3"></i>
                    <button 
                      className="btn btn-primary d-flex align-items-center"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Nuevo Usuario
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-light border-secondary' : 'bg-white text-dark'}`}>
              <div className={`card-body ${isDark ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-end">
                      <span className="badge bg-info fs-6">
                        {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className={`card shadow-sm ${isDark ? 'bg-dark text-light border-secondary' : 'bg-white text-dark'}`}>
              <div className={`card-body p-0 ${isDark ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-5 empty-state fade-in">
                    <Users size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No se encontraron usuarios</h5>
                    <p className="text-muted mb-0">No hay usuarios que coincidan con los criterios de búsqueda</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className={`table table-hover users-table mb-0 ${isDark ? 'table-dark' : ''}`}>
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Username</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Último login</th>
                          <th>Reportes</th>
                          <th>Fecha de Registro</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => {
                          const userStatus = getUserStatus(user);
                          return (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle me-3">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-medium">{getFullName(user)}</div>
                                  <small className="text-muted">ID: {user.id}</small>
                                </div>
                              </div>
                            </td>
                            <td>{user.username}</td>
                            <td>
                              <span className={`badge ${getRoleBadgeClass(user.role)} px-2 py-1`}>
                                {user.role === 'admin' ? 'Administrador' : 
                                 user.role === 'moderator' ? 'Moderador' : 'Usuario'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(userStatus)} px-2 py-1`}>
                                {userStatus === 'active' ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>{formatLastLogin(user.last_login)}</td>
                            <td>
                              <span className="badge bg-info">
                                {getReportsCount(user)}
                              </span>
                            </td>
                            <td>
                              {new Date(user.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-1">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleEditUser(user)}
                                  title="Editar usuario"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  title="Eliminar usuario"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

     {/* Modal para editar usuario */}
        {showEditModal && editingUser && (
          <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Usuario</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                    }}
                  ></button>
                </div>
                <form onSubmit={handleUpdateUser}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="edit_name" className="form-label">Nombre</label>
                      <input 
                        type="text"
                        className="form-control"
                        id="edit_name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                        required
                        minLength="3"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit_last_name" className="form-label">Apellido</label>
                      <input 
                        type="text"
                        className="form-control"
                        id="edit_last_name"
                        value={editingUser.last_name}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, last_name: e.target.value }))}
                        required
                        minLength="3"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit_username" className="form-label">Username</label>
                      <input 
                        type="text"
                        className="form-control"
                        id="edit_username"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, username: e.target.value }))}
                        required
                        minLength="3"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit_password" className="form-label">Nueva Contraseña</label>
                      <input 
                        type="password"
                        className="form-control"
                        id="edit_password"
                        value={editingUser.password || ''}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Dejar vacío para mantener la contraseña actual"
                        minLength="3"
                        maxLength="100"
                      />
                      <div className="form-text">Dejar vacío si no desea cambiar la contraseña</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit_role" className="form-label">Rol</label>
                      <select 
                        className="form-select"
                        id="edit_role"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                        required
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="moderator">Moderador</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingUser(null);
                      }}
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-1"></i>
                      Actualizar Usuario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para crear nuevo usuario */}
        {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Plus size={20} className="me-2" />
                  Crear Nuevo Usuario
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input 
                      type="text"
                      className="form-control"
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      required
                      minLength="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Apellido</label>
                    <input 
                      type="text"
                      className="form-control"
                      id="last_name"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                      minLength="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                      type="text"
                      className="form-control"
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      required
                      minLength="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="pass" className="form-label">Contraseña</label>
                    <input 
                      type="password"
                      className="form-control"
                      id="pass"
                      value={newUser.pass}
                      onChange={(e) => setNewUser(prev => ({ ...prev, pass: e.target.value }))}
                      required
                      minLength="3"
                      maxLength="100"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Rol</label>
                    <select 
                      className="form-select"
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      required
                    >
                      <option value="user">Usuario</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-1"></i>
                        Crear Usuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />  
    </>
  );
}