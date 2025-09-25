import React, { useState } from 'react';
import { Activity, Heart, Thermometer, X, Maximize2 } from 'lucide-react';
import type { VitalSignsHistory } from '../types';

interface VitalSignsChartsProps {
  history: VitalSignsHistory;
}

interface LineChartProps {
  data: number[];
  timestamps: string[];
  color: string;
  title: string;
  unit: string;
  icon: React.ReactNode;
  minValue?: number;
  maxValue?: number;
  onClick: () => void;
  isExpanded?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  timestamps,
  color,
  title,
  unit,
  icon,
  minValue,
  maxValue,
  onClick,
  isExpanded = false
}) => {
  const width = isExpanded ? 600 : 280;
  const height = isExpanded ? 300 : 120;
  const padding = 20;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
        <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
      </div>
    );
  }

  // Calculate min/max for scaling - use provided bounds or data bounds
  const actualMin = Math.min(...data);
  const actualMax = Math.max(...data);
  const dataMin = minValue !== undefined ? Math.min(minValue, actualMin) : actualMin;
  const dataMax = maxValue !== undefined ? Math.max(maxValue, actualMax) : actualMax;
  const range = dataMax - dataMin || 1;

  // Create path string for smooth curve
  const createSmoothPath = (data: number[]) => {
    if (data.length < 2) return '';
    
    let path = '';
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + ((dataMax - data[i]) / range) * chartHeight;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    return path;
  };

  const pathString = createSmoothPath(data);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const lastValue = data.length > 0 ? data[data.length - 1] : 0;
  const formattedLastValue = title === 'Temperatura' ? lastValue.toFixed(1) : lastValue;

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-4 ${!isExpanded ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={!isExpanded ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <span className="text-lg font-bold" style={{ color }}>{formattedLastValue}</span>
            <span className="text-xs text-gray-500 ml-1">{unit}</span>
          </div>
          {!isExpanded && (
            <Maximize2 className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      
      <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        <defs>
          <pattern id={`grid-${title.replace(/\s+/g, '')}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${title.replace(/\s+/g, '')})`} />
        
        {/* Chart bounds for debugging */}
        <rect 
          x={padding} 
          y={padding} 
          width={chartWidth} 
          height={chartHeight} 
          fill="none" 
          stroke="#e5e7eb" 
          strokeWidth="1"
        />
        
        {/* Area under the curve */}
        <path
          d={`${pathString} L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
          fill={color}
          fillOpacity="0.1"
        />
        
        {/* Main line */}
        <path
          d={pathString}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = padding + ((dataMax - value) / range) * chartHeight;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              stroke="white"
              strokeWidth="1"
            >
              <title>{`${formatTime(timestamps[index])}: ${value}${unit}`}</title>
            </circle>
          );
        })}
      </svg>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{data.length > 0 ? formatTime(timestamps[0]) : ''}</span>
        <span>{data.length > 0 ? formatTime(timestamps[timestamps.length - 1]) : ''}</span>
      </div>
    </div>
  );
};

export const VitalSignsCharts: React.FC<VitalSignsChartsProps> = ({ history }) => {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  // Sort data by timestamp (oldest first for chronological chart)
  const sortedData = [...history.data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Extract data for each vital sign
  const heartRateData = sortedData.map(item => item.vitalSigns.heartRate);
  const oxygenData = sortedData.map(item => item.vitalSigns.oxygenSaturation);
  const temperatureData = sortedData.map(item => item.vitalSigns.temperature);
  const timestamps = sortedData.map(item => item.timestamp);

  const openChart = (chartType: string) => {
    setExpandedChart(chartType);
  };

  const closeChart = () => {
    setExpandedChart(null);
  };

  const chartConfigs = [
    {
      key: 'heartRate',
      data: heartRateData,
      color: '#a78bfa',
      title: 'Frequência Cardíaca',
      unit: ' BPM',
      icon: <Heart className="h-4 w-4" style={{ color: '#a78bfa' }} />,
      minValue: 40,
      maxValue: 120
    },
    {
      key: 'oxygen',
      data: oxygenData,
      color: '#3b82f6',
      title: 'Saturação de O₂',
      unit: '%',
      icon: <Activity className="h-4 w-4" style={{ color: '#3b82f6' }} />,
      minValue: 90,
      maxValue: 100
    },
    {
      key: 'temperature',
      data: temperatureData,
      color: '#ec4899',
      title: 'Temperatura',
      unit: '°C',
      icon: <Thermometer className="h-4 w-4" style={{ color: '#ec4899' }} />,
      minValue: 34,
      maxValue: 42
    }
  ];

  return (
    <>
      <div className="w-1/2 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Gráficos dos Sinais Vitais</h3>
        
        {chartConfigs.map(config => (
          <LineChart
            key={config.key}
            data={config.data}
            timestamps={timestamps}
            color={config.color}
            title={config.title}
            unit={config.unit}
            icon={config.icon}
            minValue={config.minValue}
            maxValue={config.maxValue}
            onClick={() => openChart(config.key)}
          />
        ))}
      </div>

      {/* Modal for expanded chart */}
      {expandedChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {chartConfigs.find(c => c.key === expandedChart)?.title}
              </h3>
              <button
                onClick={closeChart}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {chartConfigs
              .filter(config => config.key === expandedChart)
              .map(config => (
                <LineChart
                  key={config.key}
                  data={config.data}
                  timestamps={timestamps}
                  color={config.color}
                  title={config.title}
                  unit={config.unit}
                  icon={config.icon}
                  minValue={config.minValue}
                  maxValue={config.maxValue}
                  onClick={() => {}}
                  isExpanded={true}
                />
              ))
            }
          </div>
        </div>
      )}
    </>
  );
};