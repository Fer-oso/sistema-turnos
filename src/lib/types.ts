export type AppointmentStatus = 'en espera' | 'en servicio' | 'finalizado'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  service: string
  date: Date
  status: AppointmentStatus
  notes?: string
}