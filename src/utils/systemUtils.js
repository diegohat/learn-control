// src/utils/systemUtils.js
import { multiply, add, exp, subtract, sqrt, pow, atan2, log10, abs, atan, cos, sin, PI } from "mathjs";

// Função para calcular a resposta ao degrau de um sistema de segunda ordem
export const calculateStepResponse = (parameters, constants, samplingTime, isDigital) => {
  const { tau, qsi } = parameters;
  const { kp, ki, kd } = constants;

  const totalTime = 10; // Segundos
  const steps = Math.floor(totalTime / samplingTime);
  const time = Array.from({ length: steps }, (_, i) => i * samplingTime);

  if (isDigital) {
    // Sistema discreto usando transformação bilinear
    const omega_n = 1 / tau;
    const zeta = qsi;
    const a = exp(-omega_n * zeta * samplingTime);
    const b = omega_n * sqrt(1 - pow(zeta, 2));

    const response = [];
    let prev1 = 0, prev2 = 0; // Valores anteriores

    time.forEach((_, k) => {
      const step = k > 0 ? 1 : 0; // Sinal de entrada degrau
      const current =
        step +
        2 * a * cos(b * samplingTime) * prev1 -
        pow(a, 2) * prev2;
      response.push(current);
      prev2 = prev1;
      prev1 = current;
    });

    return { time, response };
  } else {
    // Sistema contínuo
    const omega_n = 1 / tau; // Frequência natural
    const damping_ratio = qsi; // Fator de amortecimento

    const response = time.map((t) => {
      if (damping_ratio < 1) {
        // Subamortecido
        const wd = omega_n * sqrt(1 - pow(damping_ratio, 2));
        return (
          1 -
          (1 / sqrt(1 - pow(damping_ratio, 2))) *
            exp(-damping_ratio * omega_n * t) *
            Math.sin(wd * t + atan2(sqrt(1 - pow(damping_ratio, 2)), damping_ratio))
        );
      } else if (damping_ratio === 1) {
        // Criticamente amortecido
        return 1 - (1 + omega_n * t) * exp(-omega_n * t);
      } else {
        // Superamortecido
        const alpha1 = -omega_n * (damping_ratio + sqrt(pow(damping_ratio, 2) - 1));
        const alpha2 = -omega_n * (damping_ratio - sqrt(pow(damping_ratio, 2) - 1));
        return (
          1 -
          ((exp(alpha1 * t) * alpha2 - exp(alpha2 * t) * alpha1) / (alpha2 - alpha1))
        );
      }
    });

    return { time, response };
  }
};

// Função para calcular a resposta em frequência (Bode)
export const calculateFrequencyResponse = (parameters, constants) => {
  const { tau, qsi } = parameters;
  const { kp, ki, kd } = constants;

  const frequency = Array.from({ length: 100 }, (_, i) => i * 0.1 + 0.1);

  const magnitude = frequency.map((w) => {
    const num = kp * pow(w, 2) + ki * w + kd;
    const denom =
      pow((1 / tau), 2) + pow((w * qsi / tau), 2) - 2 * (w * qsi / tau) + pow(w, 2);
    const magnitude = abs(num / denom);
    return 20 * log10(magnitude);
  });

  const phase = frequency.map((w) => {
    const phase = atan2(ki * w, kp - pow(w, 2));
    return (phase * 180) / Math.PI;
  });

  return { frequency, magnitude, phase };
};

// Função para calcular o lugar das raízes (LGR)
export const calculateRootLocus = (parameters, constants) => {
  const { tau, qsi } = parameters;

  const kValues = Array.from({ length: 100 }, (_, i) => i * 0.1); // Ganhos de 0 a 10
  const realParts = [];
  const imagParts = [];

  kValues.forEach((kp) => {
    // Calcula os polos do sistema de malha fechada
    const omega_n = 1 / tau;
    const characteristicEq = [
      1, // s^2
      2 * qsi * omega_n, // 2ζωn
      omega_n ** 2 + kp, // ωn² + Kp
    ];

    const delta = characteristicEq[1] ** 2 - 4 * characteristicEq[0] * characteristicEq[2];

    if (delta >= 0) {
      // Raízes reais
      const root1 = (-characteristicEq[1] + sqrt(delta)) / (2 * characteristicEq[0]);
      const root2 = (-characteristicEq[1] - sqrt(delta)) / (2 * characteristicEq[0]);
      realParts.push(root1, root2);
      imagParts.push(0, 0);
    } else {
      // Raízes complexas conjugadas
      const realPart = -characteristicEq[1] / (2 * characteristicEq[0]);
      const imagPart = sqrt(-delta) / (2 * characteristicEq[0]);
      realParts.push(realPart, realPart);
      imagParts.push(imagPart, -imagPart);
    }
  });

  return { real: realParts, imaginary: imagParts };
};
