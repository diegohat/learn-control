// src/components/ModeSelector.jsx
import React, { useState } from "react";

const ModeSelector = ({ setSamplingTime, setIsDigital }) => {
  const [mode, setMode] = useState("continuous");

  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    setIsDigital(selectedMode === "digital");
    if (selectedMode === "continuous") {
      setSamplingTime(0.001); // Tempo de amostragem pequeno
    }
  };

  const handleSamplingTimeChange = (event) => {
    setSamplingTime(parseFloat(event.target.value));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Selecionar Modo</h2>
      <div className="flex items-center">
        <label className="mr-2">
          <input
            type="radio"
            value="continuous"
            checked={mode === "continuous"}
            onChange={handleModeChange}
            className="mr-1"
          />
          Contínuo
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="digital"
            checked={mode === "digital"}
            onChange={handleModeChange}
            className="mr-1"
          />
          Digital
        </label>
      </div>
      {mode === "digital" && (
        <div className="mt-2">
          <label>
            Tempo de Amostragem (s):
            <input
              type="number"
              step="0.001"
              onChange={handleSamplingTimeChange}
              className="ml-2 p-1 border rounded bg-white text-black"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
