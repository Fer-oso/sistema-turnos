import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { Menu, X, Clock } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function MainLayout() {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 shadow-md">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <header className="md:hidden flex items-center border-b p-4 bg-white shadow-sm">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="hover:bg-primary/10 transition-colors duration-200">
                <Menu className="h-5 w-5 text-primary" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 shadow-xl border-r border-r-primary/10">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="flex items-center ml-4">
            <div className="p-1.5 rounded-full bg-primary/10 mr-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sistema de Turnos
            </h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}