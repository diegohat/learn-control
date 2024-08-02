// src/components/PotentiometerControl.jsx
import React from "react";

const PotentiometerControl = ({ setControllerConstants }) => {
  const handleConstantChange = (event) => {
    const { name, value } = event.target;
    setControllerConstants((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Constantes de Controle</h2>
      <div className="flex flex-col">
        <label className="mb-2">
          Kp:
          <input
            type="number"
            step="0.1"
            name="kp"
            onChange={handleConstantChange}
            className="ml-2 p-1 border rounded bg-white text-black"
          />
        </label>
        <label className="mb-2">
          Ki:
          <input
            type="number"
            step="0.1"
            name="ki"
            onChange={handleConstantChange}
            className="ml-2 p-1 border rounded bg-white text-black"
          />
        </label>
        <label className="mb-2">
          Kd:
          <input
            type="number"
            step="0.1"
            name="kd"
            onChange={handleConstantChange}
            className="ml-2 p-1 border rounded bg-white text-black"
          />
        </label>
      </div>
    </div>
  );
};

export default PotentiometerControl;
