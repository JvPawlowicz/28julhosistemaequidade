import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  UserCheck,
  FileText,
  Shield,
  ArrowRight
} from "lucide-react";
import EvolutionNotifications from '@/components/EvolutionNotifications';
import SupervisionFlow from '@/components/SupervisionFlow';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUnit } = useMultiTenant();
  const [stats, setStats] = useState({
    pacientesAtivos: 0,
    atendimentosMes: 0,
    taxaPresenca: 0,
    novosPacientes: 0,
    terapeutasAtivos: 0,
    evolucoesPendentes: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    // Mock data for demonstration. In a real scenario, these would be Supabase queries.
    setStats({
      pacientesAtivos: 156,
      atendimentosMes: 482,
      taxaPresenca: 94,
      novosPacientes: 12,
      terapeutasAtivos: 24,
      evolucoesPendentes: 5,
    });
  }, [currentUnit]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const quickActions = [
    { label: "Gerenciar Pacientes", path: "/app/pacientes", icon: Users },
    { label: "Ver Agenda Global", path: "/app/agenda", icon: Calendar },
    { label: "Gerenciar Usuários", path: "/app/usuarios", icon: UserCheck },
    { label: "Ver Relatórios", path: "/app/relatorios", icon: BarChart3 },
    { label: "Configurações", path: "/app/configuracoes", icon: Settings },
    { label: "Supervisão", path: "/app/evolucoes", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard do Administrador</h1>
        <p className="text-muted-foreground">
          Visão geral e centro de controle da clínica.
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.pacientesAtivos}</p>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{stats.atendimentosMes}</p>
                <p className="text-sm text-muted-foreground">Atendimentos no Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.taxaPresenca}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Presença</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.terapeutasAtivos}</p>
                <p className="text-sm text-muted-foreground">Terapeutas Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações Rápidas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map(action => (
              <Button
                key={action.path}
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Alertas e Supervisão */}
        <div className="lg:col-span-2 space-y-6">
          <EvolutionNotifications />
          <SupervisionFlow />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;