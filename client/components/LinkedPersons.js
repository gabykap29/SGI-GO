import { Users, Plus, X } from 'lucide-react';

export function LinkedPersons({ 
  reportPersons, 
  setShowPersonModal, 
  handleRemovePerson 
}) {
  return (
    <div className="info-card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">
            <Users size={20} className="me-2" />
            Personas vinculadas ({reportPersons.length})
          </h5>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowPersonModal(true)}
          >
            <Plus size={16} className="me-2" />
            Vincular Persona
          </button>
        </div>

        {reportPersons.length > 0 ? (
          <div className="persons-list">
            {reportPersons.map((person, index) => (
              <div key={index} className="person-item d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                <div className="d-flex align-items-center">
                  <Users size={20} className="me-3" />
                  <div>
                    <div className="fw-bold">
                      {person.name} {person.last_name}
                    </div>
                    <small className="text-muted">
                      DNI: {person.dni}
                    </small>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemovePerson(person.id)}
                  title="Desvincular persona"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-0">No hay personas vinculadas a este informe</p>
        )}
      </div>
    </div>
  );
}