import api from './api';
import type { Patient, PatientFormData, VitalSignsHistory, PatientStats } from '../types';

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await api.get<{ data: Patient[] }>('/patients');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  },

  async getPatient(id: string): Promise<Patient> {
    try {
      const response = await api.get<{ data: Patient }>(`/patients/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient');
    }
  },

  async createPatient(patientData: PatientFormData): Promise<Patient> {
    try {
      const formData = new FormData();
      formData.append('name', patientData.name);
      formData.append('age', patientData.age.toString());
      formData.append('condition', patientData.condition);
      
      if (patientData.photo) {
        formData.append('photo', patientData.photo);
      }

      const response = await api.post<{ data: Patient }>('/patients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create patient');
    }
  },

  async updatePatient(id: string, patientData: Partial<PatientFormData>): Promise<Patient> {
    try {
      const response = await api.put<{ data: Patient }>(`/patients/${id}`, patientData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  },

  async deletePatient(id: string): Promise<void> {
    try {
      await api.delete(`/patients/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  },

  async getPatientHistory(id: string): Promise<VitalSignsHistory> {
    try {
      const response = await api.get<{ data: VitalSignsHistory }>(`/patients/${id}/history`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient history');
    }
  },

  async getPatientStats(id: string): Promise<PatientStats> {
    try {
      const response = await api.get<{ data: PatientStats }>(`/patients/${id}/stats`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient stats');
    }
  }
};
