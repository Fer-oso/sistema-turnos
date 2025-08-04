import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useAppointmentStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  CalendarDays, 
  ClipboardList, 
  UserCircle2, 
  Clock, 
  CheckCircle, 
  CalendarClock,
  ArrowRight,
  PlusCircle,
  Users,
  CheckCheck
} from "lucide-react"

export default function HomePage() {
  const { appointments, clients } = useAppointmentStore()

  // Count appointments by status
  const waitingAppointments = appointments.filter(a => a.status === "en espera").length
  const inServiceAppointments = appointments.filter(a => a.status === "en servicio").length
  const completedAppointments = appointments.filter(a => a.status === "finalizado").length
  
  // Get today's appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.date)
    appointmentDate.setHours(0, 0, 0, 0)
    return appointmentDate.getTime() === today.getTime()
  }).length
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Panel de Control
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestión de turnos y estadísticas generales
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/50 overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-amber-50">
            <CardTitle className="text-sm font-medium text-amber-800">
              En Espera
            </CardTitle>
            <div className="p-1 bg-amber-100 rounded-full">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-700">{waitingAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">turnos pendientes</p>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-blue-50">
            <CardTitle className="text-sm font-medium text-blue-800">
              En Servicio
            </CardTitle>
            <div className="p-1 bg-blue-100 rounded-full">
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-700">{inServiceAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">turnos activos</p>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-800">
              Finalizados
            </CardTitle>
            <div className="p-1 bg-green-100 rounded-full">
              <CheckCheck className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-700">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">turnos completados</p>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-primary/5">
            <CardTitle className="text-sm font-medium text-primary">
              Clientes
            </CardTitle>
            <div className="p-1 bg-primary/10 rounded-full">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{clients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">clientes registrados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="bg-primary/5 border-b border-border/40">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-primary/10 rounded-full">
                <PlusCircle className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </div>
            <CardDescription>
              Gestione rápidamente sus turnos y clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/registro-turnos" className="w-full">
                <Button className="w-full gap-2 transition-all hover:shadow-md">
                  <CalendarClock className="h-4 w-4" />
                  Nuevo Turno
                </Button>
              </Link>
              <Link to="/lista-turnos" className="w-full">
                <Button variant="outline" className="w-full gap-2 transition-all hover:bg-secondary hover:text-secondary-foreground">
                  <ClipboardList className="h-4 w-4" />
                  Ver Turnos
                </Button>
              </Link>
              <Link to="/clientes" className="w-full">
                <Button variant="outline" className="w-full gap-2 transition-all hover:bg-secondary hover:text-secondary-foreground">
                  <UserCircle2 className="h-4 w-4" />
                  Gestionar Clientes
                </Button>
              </Link>
              <Link to="/historial-clientes" className="w-full">
                <Button variant="outline" className="w-full gap-2 transition-all hover:bg-secondary hover:text-secondary-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Ver Historial
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="bg-primary/5 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Turnos Recientes</CardTitle>
              </div>
              <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                Hoy: {todayAppointments}
              </div>
            </div>
            <CardDescription>
              Últimos turnos registrados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-3 bg-primary/5 rounded-full mb-3">
                  <CalendarClock className="h-6 w-6 text-primary/70" />
                </div>
                <p className="text-sm text-muted-foreground">No hay turnos registrados</p>
                <Link to="/registro-turnos" className="mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Crear Primer Turno
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {appointments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full 
                          ${appointment.status === 'en espera' ? 'bg-amber-100' :
                            appointment.status === 'en servicio' ? 'bg-blue-100' :
                              'bg-green-100'
                          }`}>
                          {appointment.status === 'en espera' ? 
                            <Clock className="h-4 w-4 text-amber-600" /> :
                            appointment.status === 'en servicio' ? 
                              <ClipboardList className="h-4 w-4 text-blue-600" /> :
                              <CheckCircle className="h-4 w-4 text-green-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{appointment.clientName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(appointment.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${appointment.status === 'en espera' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            appointment.status === 'en servicio' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {appointments.length > 0 && (
              <CardFooter className="border-t border-border/40 p-4 flex justify-center">
                <Link to="/lista-turnos">
                  <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary">
                    Ver todos los turnos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}