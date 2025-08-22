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
  getClientByDni:(dni: string) => Client | undefined
  
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
      /*En estas seccion se carga el estado por defecto en el LS */
      clients: [{
        id: "c1",
        name: "Juan Pérez",
        dni:"12345678",
        email: "juan.perez@example.com",
        phone: "+54 9 11 2345 6789",
        createdAt: new Date("2024-08-10T10:30:00"),
      },
      {
        id: "c2",
        name: "María González",
        dni:"11223344",
        email: "maria.gonzalez@example.com",
        phone: "+54 9 11 9876 5432",
        createdAt: new Date("2024-09-05T14:45:00"),
      },
      {
        id: "c3",
        name: "Carlos López",
        dni:"55667788",
        email: "carlos.lopez@example.com",
        phone: "+54 9 11 4567 1234",
        createdAt: new Date("2024-10-01T09:15:00"),
      }],
      appointments: [ {
        id: "a1",
        clientId: "c1",
        clientName: "Juan Pérez",
        service: "Corte de cabello",
        date: new Date("2025-08-21T09:00:00"),
        status: "en espera",
        notes: "Quiere estilo moderno, degradado",
      },
      {
        id: "a2",
        clientId: "c2",
        clientName: "María González",
        service: "Coloración",
        date: new Date("2025-08-21T11:30:00"),
        status: "en servicio",
      },
      {
        id: "a3",
        clientId: "c3",
        clientName: "Carlos López",
        service: "Afeitado clásico",
        date: new Date("2025-08-20T16:00:00"),
        status: "finalizado",
        notes: "Cliente recurrente",
      },
      {
        id: "a4",
        clientId: "c1",
        clientName: "Juan Pérez",
        service: "Mascarilla capilar",
        date: new Date("2025-08-22T14:00:00"),
        status: "en espera",
      },],
      
      // Client actions
      addClient: (clientData) => {

        const existingClient = get().clients.find(
          client => client.dni === clientData.dni || client.phone === clientData.phone
        )
      
        if (existingClient) {
          // Ya existe, no lo duplicamos
          return null;
        }

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

      getClientByDni: (dni) => {
        return get().clients.find(client => client.dni === dni)
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