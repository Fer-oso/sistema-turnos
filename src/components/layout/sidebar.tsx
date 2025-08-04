import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  CalendarDays, 
  ClipboardList, 
  Clock,
  UserCircle2,
  History,
  Home
} from 'lucide-react'

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href: string
}

const SidebarItem = ({ icon, title, href }: SidebarItemProps) => {
  const { pathname } = useLocation()
  const isActive = pathname === href
  
  return (
    <Link to={href} className="w-full block">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 mb-2 transition-all duration-200 shadow-sm",
          isActive 
            ? "bg-secondary font-medium text-secondary-foreground border-l-4 border-l-primary" 
            : "hover:bg-secondary/50 hover:translate-x-1"
        )}
      >
        <span className={cn("text-primary", isActive ? "text-primary" : "opacity-70")}>
          {icon}
        </span>
        <span>{title}</span>
      </Button>
    </Link>
  )
}

export function Sidebar() {
  return (
    <div className="h-full px-4 py-6 border-r bg-sidebar-background">
      <div className="flex items-center mb-8 px-2">
        <div className="p-2 rounded-full bg-primary/10">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-lg font-semibold ml-3 text-primary">Sistema de Turnos</h1>
      </div>
      <div className="space-y-1">
        <SidebarItem icon={<Home className="w-5 h-5" />} title="Inicio" href="/" />
        <SidebarItem 
          icon={<CalendarDays className="w-5 h-5" />} 
          title="Registro de Turnos" 
          href="/registro-turnos" 
        />
        <SidebarItem 
          icon={<ClipboardList className="w-5 h-5" />} 
          title="Lista de Turnos" 
          href="/lista-turnos" 
        />
        <SidebarItem 
          icon={<History className="w-5 h-5" />} 
          title="Historial de Clientes" 
          href="/historial-clientes" 
        />
        <SidebarItem 
          icon={<UserCircle2 className="w-5 h-5" />} 
          title="Clientes" 
          href="/clientes" 
        />
      </div>
    </div>
  )
}