import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Controle de Sistemas Dinâmicos</h1>
        <img
          src="/assets/cefet.png"
          alt="Sistema Dinâmico"
          className="w-32 h-32 mx-auto mb-6"
        />
        <p className="text-lg text-gray-600 mb-8">
          Escolha o tipo de sistema que deseja controlar e visualize os gráficos
          com base nos valores de PID.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/digital"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Sistemas Digitais
          </Link>
          <Link
            to="/continuo"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Sistemas Contínuos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
