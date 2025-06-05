import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Cores para gráficos
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#87d068', '#ffc069', '#ff9f43', '#ee5a52'
];

// Componente para gráfico de linha
export const GraficoLinha = ({ dados, xKey, yKeys, titulo, altura = 300 }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">{titulo}</h3>
      <ResponsiveContainer width="100%" height={altura}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }} 
          />
          <Legend />
          {yKeys.map((key, index) => (
            <Line 
              key={key.key} 
              type="monotone" 
              dataKey={key.key} 
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={key.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente para gráfico de área
export const GraficoArea = ({ dados, xKey, yKeys, titulo, altura = 300 }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">{titulo}</h3>
      <ResponsiveContainer width="100%" height={altura}>
        <AreaChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }} 
          />
          <Legend />
          {yKeys.map((key, index) => (
            <Area 
              key={key.key}
              type="monotone" 
              dataKey={key.key} 
              stackId="1"
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
              name={key.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente para gráfico de barras
export const GraficoBarra = ({ dados, xKey, yKeys, titulo, altura = 300, horizontal = false }) => {
  const Chart = horizontal ? BarChart : BarChart;
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">{titulo}</h3>
      <ResponsiveContainer width="100%" height={altura}>
        <Chart data={dados} layout={horizontal ? 'horizontal' : 'vertical'}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey={xKey} type="category" stroke="#9CA3AF" width={100} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
            </>
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }} 
          />
          <Legend />
          {yKeys.map((key, index) => (
            <Bar 
              key={key.key}
              dataKey={key.key} 
              fill={COLORS[index % COLORS.length]}
              name={key.name}
            />
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente para gráfico de pizza
export const GraficoPizza = ({ dados, dataKey, nameKey, titulo, altura = 300 }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">{titulo}</h3>
      <ResponsiveContainer width="100%" height={altura}>
        <PieChart>
          <Pie
            data={dados}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
