import { useState, useEffect } from 'react';
import { Search, User, Plus, X, Check, AlertCircle } from 'lucide-react';
import { getPersonByDni, createPerson } from "../hooks/handlePersons"
import { handleError, handleSuccess } from "../hooks/toaster"

export function AddPersonModal({ isOpen, onClose, onPersonAdded, isDark = false }) {
  const [dni, setDni] = useState('');
  const [personFound, setPersonFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [noDni, setNoDni] = useState(false);
  const [newPersonData, setNewPersonData] = useState({
    name: '',
    last_name: '',
    dni: '',
    phone: '',
    address: '',
    locality: '',
    province: '',
    description: ''
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setDni('');
      setPersonFound(null);
      setShowCreateForm(false);
      setNoDni(false);
      setNewPersonData({
        name: '',
        last_name: '',
        dni: '',
        phone: '',
        address: '',
        locality: '',
        province: '',
        description: ''
      });
    }
  }, [isOpen]);

  const handleSearchByDni = async () => {
    if (!dni.trim()) {
      handleError('Por favor ingrese un DNI válido');
      return;
    }

    setIsSearching(true);
    try {
      const person = await getPersonByDni(dni.trim());
      if (person) {
        setPersonFound(person);
        setShowCreateForm(false);
        handleSuccess('Persona encontrada');
      } else {
        setPersonFound(null);
        setShowCreateForm(true);
        setNewPersonData(prev => ({ ...prev, dni: dni.trim() }));
        handleError('Persona no encontrada. Complete los datos para crear una nueva.');
      }
    } catch (error) {
      handleError('Error al buscar la persona');
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNoDniChange = (e) => {
    const checked = e.target.checked;
    setNoDni(checked);
    if (checked) {
      setShowCreateForm(true);
      setPersonFound(null);
      setDni('');
      setNewPersonData(prev => ({ ...prev, dni: '' }));
    } else {
      setShowCreateForm(false);
    }
  };

  const handleCreatePerson = async () => {
    // Validate required fields
    // Si noDni es true, no validamos dni
    if (!newPersonData.name || !newPersonData.last_name || (!noDni && !newPersonData.dni) ||
      !newPersonData.address || !newPersonData.locality || !newPersonData.province) {
      handleError('Por favor complete todos los campos obligatorios');
      return;
    }

    setIsCreating(true);
    try {
      // Si es sin dni, aseguramos que vaya vacío o como prefiera el backend (el backend pone "Sin Datos" si va vacío)
      const createdPerson = await createPerson(newPersonData);
      setPersonFound(createdPerson);
      setShowCreateForm(false);
      handleSuccess('Persona creada exitosamente');
    } catch (error) {
      handleError('Error al crear la persona');
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddPersonToReport = () => {
    if (personFound) {
      onPersonAdded(personFound);
      onClose();
      handleSuccess('Persona agregada al informe');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPersonData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
        }
        
        .modal-content {
          background-color: ${isDark ? '#2d2d2d' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#000000'};
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        
        .modal-header {
          background-color: ${isDark ? '#1a1a1a' : '#f8f9fa'};
          border-bottom: 1px solid ${isDark ? '#444' : '#dee2e6'};
          border-radius: 12px 12px 0 0;
          padding: 20px;
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .modal-footer {
          background-color: ${isDark ? '#1a1a1a' : '#f8f9fa'};
          border-top: 1px solid ${isDark ? '#444' : '#dee2e6'};
          border-radius: 0 0 12px 12px;
          padding: 20px;
        }
        
        .form-control-dark {
          background-color: ${isDark ? '#404040' : '#ffffff'};
          border: 1px solid ${isDark ? '#555' : '#ced4da'};
          color: ${isDark ? '#ffffff' : '#000000'};
        }
        
        .form-control-dark:focus {
          background-color: ${isDark ? '#404040' : '#ffffff'};
          border-color: ${isDark ? '#0d6efd' : '#86b7fe'};
          color: ${isDark ? '#ffffff' : '#000000'};
          box-shadow: 0 0 0 0.25rem ${isDark ? 'rgba(13, 110, 253, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
        }
        
        .person-card {
          background-color: ${isDark ? '#404040' : '#f8f9fa'};
          border: 1px solid ${isDark ? '#555' : '#dee2e6'};
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        
        .btn-close-custom {
          background: none;
          border: none;
          color: ${isDark ? '#ffffff' : '#000000'};
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }
        
        .btn-close-custom:hover {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }
        
        @media (max-width: 768px) {
          .modal-content {
            margin: 10px;
            max-width: calc(100% - 20px);
          }
          
          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 15px;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <User className="me-2" size={24} />
                Agregar Persona al Informe
              </h5>
              <button className="btn-close-custom" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* DNI Search */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <Search className="me-2" size={16} />
                Buscar por DNI *
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                  placeholder="Ingrese el DNI de la persona"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !noDni && handleSearchByDni()}
                  disabled={noDni}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSearchByDni}
                  disabled={isSearching || noDni}
                >
                  {isSearching ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Buscando...</span>
                    </div>
                  ) : (
                    <Search size={16} />
                  )}
                </button>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="noDniCheck"
                  checked={noDni}
                  onChange={handleNoDniChange}
                />
                <label className="form-check-label" htmlFor="noDniCheck">
                  Persona sin DNI / No recuerdo el DNI
                </label>
              </div>
            </div>

            {/* Person Found */}
            {personFound && (
              <div className="person-card">
                <div className="d-flex align-items-center mb-3">
                  <Check className="text-success me-2" size={20} />
                  <h6 className="mb-0 text-success">Persona Encontrada</h6>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nombre:</strong> {personFound.name}</p>
                    <p><strong>Apellido:</strong> {personFound.last_name}</p>
                    <p><strong>DNI:</strong> {personFound.dni}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Dirección:</strong> {personFound.address}</p>
                    <p><strong>Localidad:</strong> {personFound.locality}</p>
                    <p><strong>Provincia:</strong> {personFound.province}</p>
                  </div>
                </div>
                {personFound.description && (
                  <p><strong>Descripción:</strong> {personFound.description}</p>
                )}
              </div>
            )}

            {/* Create New Person Form */}
            {showCreateForm && (
              <div className="person-card">
                <div className="d-flex align-items-center mb-3">
                  <AlertCircle className="text-warning me-2" size={20} />
                  <h6 className="mb-0 text-warning">Crear Nueva Persona</h6>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="name"
                      value={newPersonData.name}
                      onChange={handleInputChange}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Apellido *</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="last_name"
                      value={newPersonData.last_name}
                      onChange={handleInputChange}
                      placeholder="Apellido"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">DNI {noDni ? '(Opcional)' : '*'}</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="dni"
                      value={newPersonData.dni}
                      onChange={handleInputChange}
                      placeholder={noDni ? "Sin DNI" : "DNI"}
                      readOnly={!noDni}
                      disabled={noDni}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="phone"
                      value={newPersonData.phone}
                      onChange={handleInputChange}
                      placeholder="Teléfono"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Dirección *</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="address"
                      value={newPersonData.address}
                      onChange={handleInputChange}
                      placeholder="Dirección"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Localidad *</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="locality"
                      value={newPersonData.locality}
                      onChange={handleInputChange}
                      placeholder="Localidad"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Provincia *</label>
                    <input
                      type="text"
                      className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                      name="province"
                      value={newPersonData.province}
                      onChange={handleInputChange}
                      placeholder="Provincia"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className={`form-control ${isDark ? 'form-control-dark' : ''}`}
                    name="description"
                    value={newPersonData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción adicional (opcional)"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              {showCreateForm && (
                <button
                  className="btn btn-success"
                  onClick={handleCreatePerson}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Creando...</span>
                      </div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="me-2" size={16} />
                      Crear Persona
                    </>
                  )}
                </button>
              )}

              {personFound && (
                <button
                  className="btn btn-primary"
                  onClick={handleAddPersonToReport}
                >
                  <Check className="me-2" size={16} />
                  Agregar al Informe
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}