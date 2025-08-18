import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { patientService } from '../services';
import { useToast } from '../hooks/useToast';
import { Header, LoadingSpinner, Toast, VitalSignsCard } from '../components';
import type { Patient } from '../types';

export const DashboardPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toasts, removeToast, error: showError, success: showSuccess } = useToast();

  const loadPatients = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const patientsData = await patientService.getAllPatients();
      setPatients(patientsData);
      
      if (isRefresh) {
        showSuccess('Lista de pacientes atualizada');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadPatients(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patientId: string) => {
    navigate(`/paciente/${patientId}`);
  };

  const handleRefresh = () => {
    loadPatients(true);
  };

  const getTimeSinceLastTransmission = (lastTransmission: string) => {
    const now = new Date();
    const last = new Date(lastTransmission);
    const diffMinutes = Math.floor((now.getTime() - last.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Agora';
    if (diffMinutes < 60) return `${diffMinutes}m atrás`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitoramento de pacientes em tempo real
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
              
              <button
                onClick={() => navigate('/registrar-paciente')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Registrar Paciente</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Patients grid */}
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente registrado'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/registrar-paciente')}
                  className="mt-4 btn-primary"
                >
                  Registrar Primeiro Paciente
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="card cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      {patient.photoUrl ? (
                        <img
                          src={patient.photoUrl}
                          alt={patient.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl font-medium text-gray-500">
                            {patient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {patient.age} anos • {patient.condition}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Última transmissão: {getTimeSinceLastTransmission(patient.lastTransmission)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Total de transmissões: {patient.transmissionsCount}
                      </p>
                    </div>
                  </div>

                  <VitalSignsCard 
                    vitalSigns={patient.currentVitalSigns} 
                    showLabels={false}
                    title=""
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
