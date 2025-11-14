export interface Flight {
  id: number;              // Unique identifier
  flightNumber: string;    // Número de vuelo
  flightType: number;      // Tipo de vuelo
  city: string;            // Ciudad
  scheduledTime: string;   // Hora (could be Date if you prefer)
  flightStatus: string;    // Estado
}