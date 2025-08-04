import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { useAppointmentStore } from "@/lib/store"
import { Check, Clock, Play, Search } from "lucide-react"

export default function ClientHistory() {
  const { clients, appointments } = useAppointmentStore()
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Get appointments for a specific client
  const getClientAppointments = (clientId: string) => {
    return appointments
      .filter(appointment => appointment.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en espera":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En espera
          </div>
        )
      case "en servicio":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Play className="w-3 h-3 mr-1" />
            En servicio
          </div>
        )
      case "finalizado":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Finalizado
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Historial de Clientes</h1>
        <p className="text-muted-foreground">
          Consulte el historial de turnos de cada cliente
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, correo o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-8">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No se encontraron clientes</p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map(client => {
            const clientAppointments = getClientAppointments(client.id)
            
            return (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle>{client.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <div>Email: {client.email}</div>
                      <div>Teléfono: {client.phone}</div>
                      <div>Cliente desde: {new Date(client.createdAt).toLocaleDateString()}</div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {clientAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Este cliente no tiene turnos registrados
                    </p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Servicio</TableHead>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Notas</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-medium">{appointment.service}</TableCell>
                              <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                              <TableCell>{appointment.notes || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}