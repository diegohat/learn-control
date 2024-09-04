import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import HelpButton from '../components/HelpButton';
import plantaContinuo from '../images/planta_continuo.jpeg'; // Importa a imagem

const Continuous = () => {
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

  const fetchControlData = async (controlType, tau) => {
    try {
      const response = await fetch(`http://localhost:8000/continuo/${controlType}?tau=${tau}`);
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
    let websocket;

    const connectWebSocket = () => {
      websocket = new WebSocket('ws://localhost:8000/ws');

      websocket.onopen = () => {
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setPidValues((prevValues) => ({
          ...prevValues,
          ...data,
        }));

        if (data.plot) {
          fetchControlData(data.control_type, data.tau);
        }
      };

      websocket.onclose = () => {
        setTimeout(connectWebSocket, 1000);
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
      <Link
        to="/"
        className="fixed top-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sistema Contínuo</h2>
        {/* Adicionar imagem com borda arredondada */}
        <div className="flex justify-center">
          <img
            src={plantaContinuo}
            alt="Planta Contínuo"
            className="shadow-md max-w-full h-auto"
          />
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Valores de Controle PID</h3>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold text-center">Parâmetro</th>
                <th className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold text-center">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-center">Kp</td>
                <td className="py-2 px-4 border-b text-center">{pidValues.kp}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">Ki</td>
                <td className="py-2 px-4 border-b text-center">{pidValues.ki}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">Kd</td>
                <td className="py-2 px-4 border-b text-center">{pidValues.kd}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">Tau</td>
                <td className="py-2 px-4 border-b text-center">{pidValues.tau}</td>
              </tr>
            </tbody>
          </table>
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

      <HelpButton bgColor="bg-green-500" hoverColor="hover:bg-green-700" textColor="text-white" />
    </div>
  );
};

export default Continuous;
