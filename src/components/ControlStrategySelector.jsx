// src/components/ControlStrategySelector.jsx
import React from "react";
import { FaCogs, FaCog, FaAdjust, FaTools } from "react-icons/fa"; // Importando ícones

const ControlStrategySelector = ({ setStrategy }) => {
  const handleStrategyChange = (event) => {
    setStrategy(event.target.value);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <FaCogs className="mr-2" />
        Selecionar Estratégia de Controle
      </h2>
      <select
        onChange={handleStrategyChange}
        className="p-2 border rounded w-full text-black bg-white"
      >
        <option value="P">
          <FaCog className="inline-block mr-2" />
          P
        </option>
        <option value="PI">
          <FaAdjust className="inline-block mr-2" />
          PI
        </option>
        <option value="PD">
          <FaTools className="inline-block mr-2" />
          PD
        </option>
        <option value="PID">
          <FaCogs className="inline-block mr-2" />
          PID
        </option>
      </select>
    </div>
  );
};

export default ControlStrategySelector;
