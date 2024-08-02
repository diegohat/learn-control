// src/App.jsx
import React, { useState } from "react";
import ModeSelector from "./components/ModeSelector";
import ControlStrategySelector from "./components/ControlStrategySelector";
import ParameterInput from "./components/ParameterInput";
import PotentiometerControl from "./components/PotentiometerControl";
import GraphDisplay from "./components/GraphDisplay";
import { toPng } from "html-to-image";
import { FaDownload, FaChartBar } from "react-icons/fa"; // Importando ícones
import {
  calculateStepResponse,
  calculateFrequencyResponse,
  calculateRootLocus,
} from "./utils/systemUtils";

const App = () => {
  const [samplingTime, setSamplingTime] = useState(0.001);
  const [strategy, setStrategy] = useState("P");
  const [parameters, setParameters] = useState({ tau: 1, qsi: 0.5 });
  const [controllerConstants, setControllerConstants] = useState({
    kp: 1,
    ki: 0,
    kd: 0,
  });

  const [responseData, setResponseData] = useState({
    time: [],
    stepResponse: [],
    frequency: [],
    magnitude: [],
    phase: [],
    real: [],
    imaginary: [],
  });

  const [isDigital, setIsDigital] = useState(false); // Define se o modo é digital

  const generateGraphs = () => {
    const stepResponse = calculateStepResponse(parameters, controllerConstants, samplingTime, isDigital);
    const frequencyResponse = calculateFrequencyResponse(parameters, controllerConstants);
    const rootLocus = calculateRootLocus(parameters, controllerConstants);

    setResponseData({
      time: stepResponse.time,
      stepResponse: stepResponse.response,
      frequency: frequencyResponse.frequency,
      magnitude: frequencyResponse.magnitude,
      phase: frequencyResponse.phase,
      real: rootLocus.real,
      imaginary: rootLocus.imaginary,
    });
  };

  const downloadImage = () => {
    const node = document.getElementById("graph-container");
    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "graficos.png";
        link.click();
      })
      .catch((error) => {
        console.error("Erro ao gerar a imagem:", error);
      });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Simulador de Controle de Sistemas</h1>
      <ModeSelector setSamplingTime={setSamplingTime} setIsDigital={setIsDigital} />
      <ControlStrategySelector setStrategy={setStrategy} />
      <ParameterInput setParameters={setParameters} />
      <PotentiometerControl setControllerConstants={setControllerConstants} />
      <button
        onClick={generateGraphs}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
      >
        <FaChartBar className="mr-2" />
        Gerar Gráficos
      </button>
      <GraphDisplay responseData={responseData} />
      <button
        onClick={downloadImage}
        className="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded flex items-center"
      >
        <FaDownload className="mr-2" />
        Baixar Gráficos
      </button>
    </div>
  );
};

export default App;
