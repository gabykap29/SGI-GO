import { Users, Plus, User, X, Info } from 'lucide-react';

export const PersonsLinkedCard = ({
    persons,
    onAddPerson,
    onRemovePerson,
    onShowDetails,
    isDark
}) => {
    return (
        <div className={`card shadow-sm mb-4 ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white'
            }`}>
            <div className="card-header border-0 pb-0">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                    <h6 className="mb-0 fw-bold">
                        <Users size={16} className="me-2 text-primary" />
                        <span className="d-none d-sm-inline">Personas Involucradas</span>
                        <span className="d-sm-none">Personas</span>
                        <span className="ms-1">({persons.length})</span>
                    </h6>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={onAddPerson}
                    >
                        <Plus size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Agregar</span>
                        <span className="d-sm-none">+</span>
                    </button>
                </div>
            </div>
            <div className="card-body">
                {persons.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                        {persons.map((person, index) => (
                            <PersonCard
                                key={index}
                                person={person}
                                onRemove={() => onRemovePerson(person.id)}
                                onShowDetails={() => onShowDetails(person)}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

const PersonCard = ({ person, onRemove, onShowDetails, isDark }) => {
    return (
        <div className={`p-3 rounded-2 person-card d-flex justify-content-between align-items-center ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'
            }`}>
            <div className="d-flex align-items-center flex-grow-1">
                <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDark ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'
                    }`} style={{ width: '40px', height: '40px' }}>
                    <User size={18} className="text-primary" />
                </div>
                <div className="flex-grow-1">
                    <div className="fw-semibold">{person.name} {person.last_name}</div>
                    <div className="d-flex flex-column flex-sm-row gap-1">
                        <small className="text-muted">DNI: {person.dni}</small>
                        {person.locality && (
                            <small className="text-muted d-none d-sm-inline">• {person.locality}</small>
                        )}
                    </div>
                </div>
            </div>
            <div className="d-flex gap-1">
                <button
                    className="btn btn-outline-info btn-sm"
                    onClick={onShowDetails}
                    title="Ver detalles"
                >
                    <Info size={14} />
                </button>
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={onRemove}
                    title="Desvincular persona"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

const EmptyState = () => {
    return (
        <div className="text-center py-3">
            <Users size={32} className="text-muted mb-2" />
            <p className="text-muted mb-0 small">No hay personas vinculadas</p>
        </div>
    );
};
