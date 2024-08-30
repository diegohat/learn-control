import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Button from '../components/Button';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Digital = () => {
  const [samplingTime, setSamplingTime] = useState('');
  const [activeStrategy, setActiveStrategy] = useState('');
  const [pidValues, setPidValues] = useState({ kp: 0, ki: 0, kd: 0 });

  const strategies = ['P', 'PI', 'PD', 'PID'];

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080'); // Alterar para o URL do seu servidor WebSocket

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPidValues(data);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Permitir apenas números e ponto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setSamplingTime(value);
    }
  };

  // Configuração dos dados dos gráficos
  const kpData = {
    labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
    datasets: [
      {
        label: 'Kp',
        data: [pidValues.kp, pidValues.kp * 1.1, pidValues.kp * 1.2, pidValues.kp * 1.3, pidValues.kp * 1.4, pidValues.kp * 1.5],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const kiData = {
    labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
    datasets: [
      {
        label: 'Ki',
        data: [pidValues.ki, pidValues.ki * 1.1, pidValues.ki * 1.2, pidValues.ki * 1.3, pidValues.ki * 1.4, pidValues.ki * 1.5],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const kdData = {
    labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
    datasets: [
      {
        label: 'Kd',
        data: [pidValues.kd, pidValues.kd * 1.1, pidValues.kd * 1.2, pidValues.kd * 1.3, pidValues.kd * 1.4, pidValues.kd * 1.5],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex flex-row justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sistema Digital</h2>

        <div className="mb-8">
          <label htmlFor="samplingTime" className="block text-lg font-medium text-gray-700 mb-2">
            Tempo de Amostragem (em segundos):
          </label>
          <input
            type="text"
            id="samplingTime"
            value={samplingTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Insira o tempo de amostragem"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Escolha a Estratégia de Controle:</h3>
          <div className="flex justify-center space-x-4">
            {strategies.map((strategy) => (
              <button
                key={strategy}
                onClick={() => setActiveStrategy(strategy)}
                className={`py-2 px-4 rounded-lg transition duration-300 ${
                  activeStrategy === strategy
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {strategy}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Valores de Controle PID:</h3>
          <p className="text-gray-800">Kp: {pidValues.kp}</p>
          <p className="text-gray-800">Ki: {pidValues.ki}</p>
          <p className="text-gray-800">Kd: {pidValues.kd}</p>
        </div>

        <div className="flex justify-center">
          <Button to="/">Voltar para a Página Inicial</Button>
        </div>
      </div>

      <div className="flex flex-col space-y-6 ml-6">
        <div className="bg-white rounded-lg shadow-lg p-4 w-80">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Gráfico Kp</h3>
          <Line data={kpData} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 w-80">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Gráfico Ki</h3>
          <Line data={kiData} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 w-80">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Gráfico Kd</h3>
          <Line data={kdData} />
        </div>
      </div>
    </div>
  );
};

export default Digital;
