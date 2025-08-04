import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppointmentStore } from "@/lib/store"
import { Appointment, AppointmentStatus } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Check, Clock, Play, Search, UserCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AppointmentList() {
  const { appointments, updateAppointmentStatus, deleteAppointment } = useAppointmentStore()
  const [filter, setFilter] = useState<AppointmentStatus | "todos">("todos")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Sort appointments: first by status, then by date
  const sortedAppointments = [...appointments]
    .sort((a, b) => {
      // Status priority: "en espera" > "en servicio" > "finalizado"
      const statusPriority: Record<AppointmentStatus, number> = {
        "en espera": 0,
        "en servicio": 1,
        "finalizado": 2
      }
      
      const statusDiff = statusPriority[a.status] - statusPriority[b.status]
      
      if (statusDiff !== 0) return statusDiff
      
      // Then sort by date
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  
  const filteredAppointments = sortedAppointments
    .filter(appointment => 
      (filter === "todos" || appointment.status === filter) && 
      (searchTerm === "" || 
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    updateAppointmentStatus(id, status)
    toast.success(`Estado actualizado a "${status}"`)
  }
  
  const handleDelete = (id: string) => {
    deleteAppointment(id)
    toast.success("Turno eliminado correctamente")
  }
  
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "en espera":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shadow-sm border border-amber-200 transition-all hover:bg-amber-200">
            <Clock className="w-3 h-3 mr-1.5" />
            En espera
          </div>
        )
      case "en servicio":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm border border-blue-200 transition-all hover:bg-blue-200">
            <Play className="w-3 h-3 mr-1.5" />
            En servicio
          </div>
        )
      case "finalizado":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm border border-green-200 transition-all hover:bg-green-200">
            <Check className="w-3 h-3 mr-1.5" />
            Finalizado
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Lista de Turnos
          </h1>
          <p className="text-muted-foreground mt-1">Gestione los turnos de forma eficiente</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[280px] bg-white shadow-sm transition-all focus-visible:ring-primary"
          />
        </div>
        
        <Select value={filter} onValueChange={(value) => setFilter(value as AppointmentStatus | "todos")}>
          <SelectTrigger className="w-full sm:w-[180px] shadow-sm transition-all hover:border-primary/50">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="en espera">En espera</SelectItem>
            <SelectItem value="en servicio">En servicio</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="shadow-md border border-border/50 overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="bg-primary/5 border-b border-border/40">
          <CardTitle className="flex items-center text-primary">
            <UserCircle2 className="mr-2 h-5 w-5" />
            Turnos {filter !== "todos" ? `(${filter})` : ""}
          </CardTitle>
          <CardDescription>
            Gestione los turnos de sus clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">No hay turnos disponibles</p>
            </div>
          ) : (
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-medium">Cliente</TableHead>
                    <TableHead className="font-medium">Servicio</TableHead>
                    <TableHead className="font-medium">Fecha y Hora</TableHead>
                    <TableHead className="font-medium">Estado</TableHead>
                    <TableHead className="w-[80px] font-medium">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="transition-colors hover:bg-secondary/50">
                      <TableCell className="font-medium">{appointment.clientName}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="rounded-full h-8 w-8 transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 shadow-lg border-border/50">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, "en espera")}
                              disabled={appointment.status === "en espera"}
                              className="cursor-pointer transition-colors hover:text-amber-600"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Marcar en espera
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, "en servicio")}
                              disabled={appointment.status === "en servicio"}
                              className="cursor-pointer transition-colors hover:text-blue-600"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Marcar en servicio
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, "finalizado")}
                              disabled={appointment.status === "finalizado"}
                              className="cursor-pointer transition-colors hover:text-green-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Marcar finalizado
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(appointment.id)}
                              className="text-red-600 focus:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}