import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Continuous = () => {
  const [tau, setTau] = useState('');
  const [activeStrategy, setActiveStrategy] = useState('');
  const [pidValues, setPidValues] = useState({ kp: 0, ki: 0, kd: 0 });
  const [stepResponse, setStepResponse] = useState('');
  const [bode, setBode] = useState('');
  const [rootLocus, setRootLocus] = useState('');

  const strategies = ['P', 'PI', 'PD', 'PID'];

  const fetchControlData = async (controlType) => {
    try {
      const response = await fetch(`http://localhost:8000/continuo/${controlType.toLowerCase()}?tau=${tau}`);
      if (!response.ok) {
        throw new Error('Failed to fetch control data');
      }
      const data = await response.json();
      if (data.step_response) {
        setStepResponse(data.step_response);
      }
      if (data.bode_plot) {
        setBode(data.bode_plot);
      }
      if (data.root_locus) {
        setRootLocus(data.root_locus);
      }
    } catch (error) {
      console.error('Error fetching control data:', error);
    }
  };

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');

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

  const handleStrategyClick = (strategy) => {
    setActiveStrategy(strategy);
    fetchControlData(strategy);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Permitir apenas números e ponto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setTau(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-row justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sistema Contínuo</h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Escolha a Estratégia de Controle:</h3>
          <div className="flex justify-center space-x-4">
            {strategies.map((strategy) => (
              <button
                key={strategy}
                onClick={() => handleStrategyClick(strategy)}
                className={`py-2 px-4 rounded-lg transition duration-300 ${activeStrategy === strategy
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-700'
                  }`}
              >
                {strategy}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="tau" className="block text-lg font-medium text-gray-700 mb-2">
            Tau:
          </label>
          <input
            type="text"
            id="tau"
            value={tau}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Insira o valor de tau"
          />
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
        <div className="bg-white rounded-lg shadow-lg p-4 w-[500px]">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Gráfico Lugar das Raízes</h3>
          {rootLocus ? (
            <img src={`data:image/png;base64,${rootLocus}`} alt="Root Locus Plot" />
          ) : (
            <p>Aguardando a seleção do método de controle...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 w-[500px]">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Gráfico Step Response</h3>
          {stepResponse ? (
            <img src={`data:image/png;base64,${stepResponse}`} alt="Step Response Plot" />
          ) : (
            <p>Aguardando a seleção do método de controle...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 w-[500px]">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Diagrama de Bode</h3>
          {bode ? (
            <img src={`data:image/png;base64,${bode}`} alt="Bode Plot" />
          ) : (
            <p>Aguardando a seleção do método de controle...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Continuous;
