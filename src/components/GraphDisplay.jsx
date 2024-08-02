// src/components/GraphDisplay.jsx
import React from "react";
import Plot from "react-plotly.js";

const GraphDisplay = ({ responseData }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Gráficos de Resposta</h2>
      <div id="graph-container" className="grid grid-cols-1 gap-4">
        <Plot
          data={[
            {
              x: responseData.time,
              y: responseData.stepResponse,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
            },
          ]}
          layout={{ title: "Resposta ao Degrau", xaxis: { title: 'Tempo (s)' }, yaxis: { title: 'Amplitude' } }}
        />
        <Plot
          data={[
            {
              x: responseData.frequency,
              y: responseData.magnitude,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "green" },
              name: "Magnitude (dB)",
            },
            {
              x: responseData.frequency,
              y: responseData.phase,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "orange" },
              yaxis: 'y2',
              name: "Fase (graus)",
            },
          ]}
          layout={{
            title: "Diagrama de Bode",
            xaxis: { title: 'Frequência (rad/s)', type: 'log' },
            yaxis: { title: 'Magnitude (dB)' },
            yaxis2: {
              title: 'Fase (graus)',
              overlaying: 'y',
              side: 'right',
            },
          }}
        />
        <Plot
          data={[
            {
              x: responseData.real,
              y: responseData.imaginary,
              type: "scatter",
              mode: "markers",
              marker: { color: "red" },
            },
          ]}
          layout={{ 
            title: "Lugar das Raízes", 
            xaxis: { title: 'Real', zeroline: true }, 
            yaxis: { title: 'Imaginário', zeroline: true } 
          }}
        />
      </div>
    </div>
  );
};

export default GraphDisplay;
