// src/components/ControlSystem.js
import React, { useEffect, useState } from 'react';

const ControlSystem = () => {
  const [pidValues, setPidValues] = useState({ kp: 0, ki: 0, kd: 0 });

  useEffect(() => {
    // Conectando ao WebSocket mockado
    const websocket = new WebSocket('ws://localhost:8080');

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

    // Cleanup on component unmount
    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div>
      <h1>Controle de Sistemas Dinâmicos</h1>
      <p>Kp: {pidValues.kp}</p>
      <p>Ki: {pidValues.ki}</p>
      <p>Kd: {pidValues.kd}</p>
    </div>
  );
};

export default ControlSystem;
