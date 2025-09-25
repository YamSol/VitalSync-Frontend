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
  // Check if this is showing averages based on title
  const isAverageData = title?.toLowerCase().includes('média');
  
  const getHeartRateColor = (hr: number) => {
    if (hr < 60 || hr > 100) return 'text-medical-red';
    return 'text-medical-green';
  };

  const getOxygenColor = (o2: number) => {
    if (o2 < 95) return 'text-medical-red';
    if (o2 < 96) return 'text-medical-orange';
    return 'text-medical-green';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 36 || temp > 37.5) return 'text-medical-red';
    if (temp > 37.2) return 'text-medical-orange';
    return 'text-medical-green';
  };

  // Format numbers based on whether it's average data or not
  const formatValue = (value: number, isInteger = false) => {
    if (isAverageData) {
      return isInteger ? Math.round(value) : Number(value.toFixed(3));
    }
    return isInteger ? Math.round(value) : value;
  };

  return (
    <div className="card">
      {showLabels && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className={`text-lg font-bold ${getHeartRateColor(vitalSigns.heartRate)}`}>
            {formatValue(vitalSigns.heartRate, true)}
          </div>
          {showLabels && <div className="text-xs text-gray-500">BPM</div>}
        </div>

        <div className="text-center">
          <div className={`text-lg font-bold ${getOxygenColor(vitalSigns.oxygenSaturation)}`}>
            {isAverageData ? formatValue(vitalSigns.oxygenSaturation) : vitalSigns.oxygenSaturation.toFixed(1)}%
          </div>
          {showLabels && <div className="text-xs text-gray-500">SpO₂</div>}
        </div>

        <div className="text-center">
          <div className={`text-lg font-bold ${getTemperatureColor(vitalSigns.temperature)}`}>
            {isAverageData ? formatValue(vitalSigns.temperature) : vitalSigns.temperature.toFixed(1)}°C
          </div>
          {showLabels && <div className="text-xs text-gray-500">Temp</div>}
        </div>
      </div>
    </div>
  );
};
