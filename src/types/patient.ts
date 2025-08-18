export interface VitalSigns {
  heartRate: number; // BPM
  oxygenSaturation: number; // %
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number; // Celsius
}

export interface Patient {
  id: string;
  name: string;
  photoUrl?: string;
  age: number;
  condition: string;
  currentVitalSigns: VitalSigns;
  transmissionsCount: number;
  lastTransmission: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PatientFormData {
  name: string;
  age: number;
  condition: string;
  photo?: File;
}

export interface VitalSignsHistory {
  patientId: string;
  data: {
    timestamp: string;
    vitalSigns: VitalSigns;
  }[];
}

export interface PatientStats {
  averages: {
    last24h: VitalSigns;
    last7days: VitalSigns;
    lastMonth: VitalSigns;
  };
}
