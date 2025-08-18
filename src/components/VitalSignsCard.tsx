import React from 'react';
import type { VitalSigns } from '../types';

interface VitalSignsCardProps {
  vitalSigns: VitalSigns;
  title?: string;
  showLabels?: boolean;
}

export const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ 
  vitalSigns, 
  title = 'Sinais Vitais',
  showLabels = true 
}) => {
  const getHeartRateColor = (hr: number) => {
    if (hr < 60 || hr > 100) return 'text-medical-red';
    return 'text-medical-green';
  };

  const getOxygenColor = (o2: number) => {
    if (o2 < 95) return 'text-medical-red';
    if (o2 < 98) return 'text-medical-orange';
    return 'text-medical-green';
  };

  const getBloodPressureColor = (sys: number, dia: number) => {
    if (sys > 140 || dia > 90 || sys < 90 || dia < 60) return 'text-medical-red';
    if (sys > 120 || dia > 80) return 'text-medical-orange';
    return 'text-medical-green';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 36 || temp > 37.5) return 'text-medical-red';
    if (temp > 37.2) return 'text-medical-orange';
    return 'text-medical-green';
  };

  return (
    <div className="card">
      {showLabels && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getHeartRateColor(vitalSigns.heartRate)}`}>
            {vitalSigns.heartRate}
          </div>
          {showLabels && <div className="text-sm text-gray-500">BPM</div>}
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${getOxygenColor(vitalSigns.oxygenSaturation)}`}>
            {vitalSigns.oxygenSaturation}%
          </div>
          {showLabels && <div className="text-sm text-gray-500">SpO₂</div>}
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${getBloodPressureColor(vitalSigns.bloodPressure.systolic, vitalSigns.bloodPressure.diastolic)}`}>
            {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
          </div>
          {showLabels && <div className="text-sm text-gray-500">mmHg</div>}
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${getTemperatureColor(vitalSigns.temperature)}`}>
            {vitalSigns.temperature.toFixed(1)}°C
          </div>
          {showLabels && <div className="text-sm text-gray-500">Temp</div>}
        </div>
      </div>
    </div>
  );
};
