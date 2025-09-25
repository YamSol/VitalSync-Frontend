import React from 'react';
import { Clock } from 'lucide-react';
import { VitalSignsCard } from './VitalSignsCard';
import type { VitalSignsHistory } from '../types';

interface VitalSignsHistoryProps {
  history: VitalSignsHistory;
}

export const VitalSignsHistoryComponent: React.FC<VitalSignsHistoryProps> = ({ history }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group transmissions by date for better organization
  const groupedByDate = history.data.reduce((groups, transmission) => {
    const date = new Date(transmission.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transmission);
    return groups;
  }, {} as Record<string, typeof history.data>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (!history.data || history.data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Histórico de Sinais Vitais</h3>
        <p className="text-gray-500 text-center py-8">Nenhuma transmissão encontrada</p>
      </div>
    );
  }

  return (
    <div className="w-1/2">
      <h3 className="text-lg font-semibold mb-4">Histórico de Sinais Vitais</h3>
      
      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {sortedDates.map(dateKey => {
          const dateTransmissions = groupedByDate[dateKey].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          return (
            <div key={dateKey} className="space-y-3">
              <div className="sticky top-0 bg-gray-50 border-b border-gray-200 py-2 mb-3">
                <h4 className="text-md font-medium text-gray-700">
                  {new Date(dateKey).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
              </div>
              
              {dateTransmissions.map((transmission, index) => (
                <div key={`${transmission.timestamp}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {formatTime(transmission.timestamp)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Transmissão {dateTransmissions.length - index}
                    </span>
                  </div>
                  
                  <VitalSignsCard 
                    vitalSigns={transmission.vitalSigns}
                    showLabels={false}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};