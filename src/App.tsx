import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/main-layout';

// Pages
import HomePage from './pages/Index';
import NotFound from './pages/NotFound';
import AppointmentRegister from './pages/AppointmentRegister';
import AppointmentList from './pages/AppointmentList';
import ClientHistory from './pages/ClientHistory';
import ClientsPage from './pages/Clients';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/registro-turnos" element={<AppointmentRegister />} />
            <Route path="/lista-turnos" element={<AppointmentList />} />
            <Route path="/historial-clientes" element={<ClientHistory />} />
            <Route path="/clientes" element={<ClientsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;