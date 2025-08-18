import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Activity } from 'lucide-react';
import { patientService } from '../services';
import { useToast } from '../hooks/useToast';
import { Header, LoadingSpinner, Toast, VitalSignsCard } from '../components';
import type { Patient, PatientStats } from '../types';

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, removeToast, error: showError } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'averages' | 'history'>('current');

  useEffect(() => {
    if (!id) return;
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [patientData, statsData] = await Promise.all([
        patientService.getPatient(id),
        patientService.getPatientStats(id)
      ]);
      
      setPatient(patientData);
      setStats(statsData);
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar dados do paciente');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Paciente não encontrado</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 btn-primary"
            >
              Voltar ao Dashboard
            </button>
          </div>
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
          {/* Back button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Dashboard</span>
          </button>

          {/* Patient header */}
          <div className="card mb-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {patient.photoUrl ? (
                  <img
                    src={patient.photoUrl}
                    alt={patient.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl font-medium text-gray-500">
                      {patient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Idade:</span> {patient.age} anos
                  </div>
                  <div>
                    <span className="font-medium">Condição:</span> {patient.condition}
                  </div>
                  <div>
                    <span className="font-medium">Transmissões:</span> {patient.transmissionsCount}
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  <div>Última transmissão: {formatDate(patient.lastTransmission)}</div>
                  <div>Registrado em: {formatDate(patient.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('current')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'current'
                    ? 'border-medical-blue text-medical-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Sinais Atuais</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('averages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'averages'
                    ? 'border-medical-blue text-medical-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Médias</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTab === 'current' && (
              <VitalSignsCard
                vitalSigns={patient.currentVitalSigns}
                title="Sinais Vitais Atuais"
              />
            )}
            
            {activeTab === 'averages' && stats && (
              <>
                <VitalSignsCard
                  vitalSigns={stats.averages.last24h}
                  title="Média das Últimas 24h"
                />
                
                <VitalSignsCard
                  vitalSigns={stats.averages.last7days}
                  title="Média dos Últimos 7 Dias"
                />
                
                <VitalSignsCard
                  vitalSigns={stats.averages.lastMonth}
                  title="Média do Último Mês"
                />
              </>
            )}
          </div>

          {/* Additional info card */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600">Monitoramento Ativo</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Frequência de Transmissão:</span>
                <span className="ml-2 text-gray-900">A cada 5 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
