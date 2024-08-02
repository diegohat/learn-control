// src/components/ParameterInput.jsx
import React from "react";

const ParameterInput = ({ setParameters }) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setParameters((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Parâmetros do Sistema</h2>
      <div className="flex flex-col">
        <label className="mb-2">
          Tau:
          <input
            type="number"
            step="0.1"
            name="tau"
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <label className="mb-2">
          Qsi:
          <input
            type="number"
            step="0.1"
            name="qsi"
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        </label>
      </div>
    </div>
  );
};

export default ParameterInput;
