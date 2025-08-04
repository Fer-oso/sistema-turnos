import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { Appointment, Client, AppointmentStatus } from './types'

interface AppointmentStore {
  clients: Client[]
  appointments: Appointment[]
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client
  getClient: (id: string) => Client | undefined
  updateClient: (id: string, client: Partial<Omit<Client, 'id'>>) => void
  deleteClient: (id: string) => void
  
  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment
  updateAppointment: (id: string, appointment: Partial<Omit<Appointment, 'id'>>) => void
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
  deleteAppointment: (id: string) => void
  getClientAppointments: (clientId: string) => Appointment[]
}

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      clients: [],
      appointments: [],
      
      // Client actions
      addClient: (clientData) => {
        const client: Client = {
          ...clientData,
          id: uuidv4(),
          createdAt: new Date(),
        }
        
        set((state) => ({
          clients: [...state.clients, client]
        }))
        
        return client
      },
      
      getClient: (id) => {
        return get().clients.find(client => client.id === id)
      },
      
      updateClient: (id, clientData) => {
        set((state) => ({
          clients: state.clients.map(client => 
            client.id === id ? { ...client, ...clientData } : client
          )
        }))
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter(client => client.id !== id),
          // Also remove all appointments for this client
          appointments: state.appointments.filter(appointment => appointment.clientId !== id)
        }))
      },
      
      // Appointment actions
      addAppointment: (appointmentData) => {
        const appointment: Appointment = {
          ...appointmentData,
          id: uuidv4(),
        }
        
        set((state) => ({
          appointments: [...state.appointments, appointment]
        }))
        
        return appointment
      },
      
      updateAppointment: (id, appointmentData) => {
        set((state) => ({
          appointments: state.appointments.map(appointment => 
            appointment.id === id ? { ...appointment, ...appointmentData } : appointment
          )
        }))
      },
      
      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map(appointment => 
            appointment.id === id ? { ...appointment, status } : appointment
          )
        }))
      },
      
      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter(appointment => appointment.id !== id)
        }))
      },
      
      getClientAppointments: (clientId) => {
        return get().appointments.filter(appointment => appointment.clientId === clientId)
      },
    }),
    {
      name: 'appointment-storage',
    }
  )
)