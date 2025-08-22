export type AppointmentStatus = 'en espera' | 'en servicio' | 'finalizado'

export const servicesValues = ['Corte de cabello' , 'Manicura' , 'Pedicura' , 'Tratamiento facial' , 'Masaje' , 'Depilación' , 'Maquillaje',  'Otro']

export interface Client {
  id: string
  name: string
  dni: string
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