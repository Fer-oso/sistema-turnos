import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppointmentStore } from "@/lib/store"
import { toast } from "sonner"
import { CalendarDays, CalendarClock, User, Mail, Phone, Scissors, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { servicesValues } from "@/lib/types"

const formSchema = z.object({
  clientName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  dni: z.string().min(8, {
    message: "El DNI debe tener al menos 8 dígitos.",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }),
  phone: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 dígitos.",
  }),
  service: z.string().min(1, {
    message: "Seleccione un servicio.",
  }),
  date: z.string().refine(value => !!value, {
    message: "Seleccione una fecha y hora.",
  }),
  notes: z.string().optional(),
})

export default function AppointmentRegister() {
  const { addClient, addAppointment } = useAppointmentStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      dni:"",
      email: "",
      phone: "",
      service: "",
      date: new Date().toISOString().slice(0, 16),
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    try {
      
      // Add client first
      const client = addClient({
        name: values.clientName,
        dni: values.dni,
        email: values.email,
        phone: values.phone,
      })

      // Create appointment
      addAppointment({
        clientId: client.id,
        clientName: client.name,
        service: values.service,
        date: new Date(values.date),
        status: "en espera",
        notes: values.notes,
      })

      toast.success("¡Turno registrado correctamente!")
      form.reset({
        clientName: "",
        email: "",
        phone: "",
        service: "",
        date: new Date().toISOString().slice(0, 16),
        notes: "",
      })
      
    } catch (error) {
      toast.error("Error al registrar el turno")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Registro de Turnos
        </h1>
        <p className="text-muted-foreground mt-1">Complete el formulario para agendar una nueva cita</p>
      </div>
      
      <Card className="shadow-md border border-border/40 overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="bg-primary/5 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <CalendarClock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Nuevo Turno</CardTitle>
              <CardDescription>
                Complete los datos para registrar un nuevo turno
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Información del Cliente</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Cliente</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej. Juan Pérez" 
                          {...field} 
                          className="transition-all focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          Dni
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej. 38128526" 
                            {...field} 
                            className="transition-all focus-visible:ring-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          Correo Electrónico
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej. cliente@ejemplo.com" 
                            {...field} 
                            className="transition-all focus-visible:ring-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          Teléfono
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej. 555-123-4567" 
                            {...field} 
                            className="transition-all focus-visible:ring-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex items-center space-x-2 mb-2 mt-4">
                  <Scissors className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Detalles del Servicio</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Servicio</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all focus:ring-primary hover:border-primary/50">
                            <SelectValue placeholder="Seleccione un servicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {servicesValues.map((service) => (
                            <SelectItem 
                              key={service} 
                              value={service}
                              className="cursor-pointer transition-colors hover:bg-primary/10"
                            >
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Fecha y Hora
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                          className="transition-all focus-visible:ring-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Notas (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ej. Cliente con preferencias específicas" 
                          {...field}
                          className="min-h-[100px] resize-none transition-all focus-visible:ring-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <CardFooter className="flex justify-end border-t border-border/20 pt-4 pb-0 px-0">
                <Button
                  type="submit" 
                  className="w-full sm:w-auto transition-all hover:shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Registrar Turno
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}