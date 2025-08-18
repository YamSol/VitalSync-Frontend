import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { patientService } from '../services';
import { useToast } from '../hooks/useToast';
import { Header, LoadingSpinner, Toast } from '../components';
import type { PatientFormData } from '../types';

const patientSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  age: yup
    .number()
    .required('Idade é obrigatória')
    .min(1, 'Idade deve ser maior que 0')
    .max(120, 'Idade deve ser menor que 120'),
  condition: yup
    .string()
    .required('Condição é obrigatória')
    .min(2, 'Condição deve ter pelo menos 2 caracteres')
});

export const RegisterPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, error: showError, success: showSuccess } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Omit<PatientFormData, 'photo'>>({
    resolver: yupResolver(patientSchema)
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Omit<PatientFormData, 'photo'>) => {
    try {
      const formData: PatientFormData = {
        ...data,
        photo: selectedPhoto || undefined
      };

      await patientService.createPatient(formData);
      showSuccess('Paciente registrado com sucesso!');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      showError(error.message || 'Erro ao registrar paciente');
    }
  };

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
      
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Back button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Dashboard</span>
          </button>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Registrar Paciente</h1>
            <p className="mt-2 text-sm text-gray-600">
              Preencha os dados do paciente para iniciar o monitoramento
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto do Paciente (Opcional)
                </label>
                
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="cursor-pointer btn-secondary flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Escolher Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className={`input-field ${
                    errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Digite o nome completo do paciente"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Age field */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Idade *
                </label>
                <input
                  {...register('age', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="120"
                  className={`input-field ${
                    errors.age ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Idade em anos"
                />
                {errors.age && (
                  <p className="mt-2 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              {/* Condition field */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condição/Diagnóstico *
                </label>
                <textarea
                  {...register('condition')}
                  rows={3}
                  className={`input-field ${
                    errors.condition ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Descreva a condição médica ou diagnóstico do paciente"
                />
                {errors.condition && (
                  <p className="mt-2 text-sm text-red-600">{errors.condition.message}</p>
                )}
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Registrar Paciente</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
