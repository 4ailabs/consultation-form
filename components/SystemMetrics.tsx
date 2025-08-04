import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface SystemMetricsProps {
  onClose?: () => void;
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Pacientes Activos',
      value: 156,
      change: 12.5,
      icon: Users,
      color: 'blue',
      description: 'Pacientes con consultas en los últimos 30 días'
    },
    {
      title: 'Consultas Hoy',
      value: 8,
      change: 25.0,
      icon: Calendar,
      color: 'green',
      description: 'Consultas programadas para hoy'
    },
    {
      title: 'Grabaciones Procesadas',
      value: 89,
      change: 45.2,
      icon: FileText,
      color: 'purple',
      description: 'Sesiones grabadas y transcritas'
    },
    {
      title: 'Tiempo Promedio',
      value: '18 min',
      change: -8.3,
      icon: Clock,
      color: 'orange',
      description: 'Tiempo promedio por consulta'
    },
    {
      title: 'Eficiencia IA',
      value: '94%',
      change: 5.7,
      icon: Brain,
      color: 'indigo',
      description: 'Precisión en análisis automático'
    },
    {
      title: 'Satisfacción',
      value: '4.8/5',
      change: 2.1,
      icon: Award,
      color: 'yellow',
      description: 'Calificación promedio de pacientes'
    }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métricas del Sistema</h2>
          <p className="text-gray-600">Análisis de rendimiento y eficiencia</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
          </select>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${getColorClasses(metric.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-sm font-medium ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
              <div className="mb-2">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
              </div>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Velocidad de Respuesta</div>
                <div className="text-xs text-gray-500">Tiempo promedio</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">1.2s</div>
            <div className="text-xs text-green-600 mt-1">+15% más rápido</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Precisión IA</div>
                <div className="text-xs text-gray-500">Análisis automático</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <div className="text-xs text-green-600 mt-1">+2.1% mejora</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Uptime</div>
                <div className="text-xs text-gray-500">Disponibilidad</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">99.8%</div>
            <div className="text-xs text-green-600 mt-1">+0.3% mejora</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Insights del Sistema</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>La eficiencia de las consultas ha mejorado un 25% con el flujo optimizado</span>
          </div>
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>El análisis automático con IA reduce el tiempo de documentación en un 60%</span>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>La satisfacción del paciente aumentó un 15% con el nuevo sistema</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics; 