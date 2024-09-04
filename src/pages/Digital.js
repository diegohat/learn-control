import React, { useState, useEffect } from 'react';
import Button from '../components/Button';

const Digital = () => {
  const [pidValues, setPidValues] = useState({
    control_type: '',
    kp: 0,
    ki: 0,
    kd: 0,
    tau: 0,
    ts: 0,
    plot: false
  });
  const [stepResponse, setStepResponse] = useState('');
  const [bode, setBode] = useState('');
  const [rootLocus, setRootLocus] = useState('');

  // Função para buscar dados de controle da API para o controle digital
  const fetchControlData = async (controlType, tau, ts) => {
    try {
      console.log(controlType);

      const response = await fetch(`http://localhost:8000/digital/${controlType}?tau=${tau}&sample_time=${ts}`);
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

  // Efeito para conectar ao WebSocket
  useEffect(() => {
    let websocket;

    const connectWebSocket = () => {
      websocket = new WebSocket('ws://localhost:8000/ws');

      websocket.onopen = () => {
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data);

        // Atualiza os valores do estado com os dados recebidos
        setPidValues((prevValues) => ({
          ...prevValues,
          ...data,
        }));

        // Verifica se precisa buscar novos dados de controle digital
        if (data.plot) {
          fetchControlData(data.control_type, data.tau, data.ts);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 1000); // Tentar reconectar após 1 segundo
      };
    };

    connectWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-row justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sistema Digital</h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Valores de Controle PID:</h3>
          <p className="text-gray-800">Kp: {pidValues.kp}</p>
          <p className="text-gray-800">Ki: {pidValues.ki}</p>
          <p className="text-gray-800">Kd: {pidValues.kd}</p>
          <p className="text-gray-800">Tau: {pidValues.tau}</p>
          <p className="text-gray-800">Ts: {pidValues.ts}</p>
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

export default Digital;