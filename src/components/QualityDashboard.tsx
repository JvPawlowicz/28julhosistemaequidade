import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/notifications";
import { supabase } from "@/integrations/supabase/client";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { usePermissions } from "@/contexts/usePermissions";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Users,
  Calendar,
  Target,
  Download,
  Filter
} from "lucide-react";

interface QualityReport {
  patient_name: string;
  therapist_name: string;
  specialty: string;
  attendance_rate: number;
  goal_achievement_rate: number;
  total_sessions: number;
}

export const QualityDashboard = () => {
  const { currentUnit } = useMultiTenant();
  const { hasPermission } = usePermissions();
  const [qualityData, setQualityData] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30');
  const [specialty, setSpecialty] = useState('all');

  const fetchQualityData = async () => {
    setLoading(true);
    try {
      const mockData: QualityReport[] = [
        {
          patient_name: 'João Silva',
          therapist_name: 'Dr. Ana Costa',
          specialty: 'psicologia',
          attendance_rate: 92.5,
          goal_achievement_rate: 85.0,
          total_sessions: 12
        },
        {
          patient_name: 'Maria Santos',
          therapist_name: 'Dr. Carlos Lima',
          specialty: 'fonoaudiologia',
          attendance_rate: 78.3,
          goal_achievement_rate: 72.1,
          total_sessions: 10
        },
        {
          patient_name: 'Pedro Oliveira',
          therapist_name: 'Dr. Lucia Ferreira',
          specialty: 'terapia_ocupacional',
          attendance_rate: 95.0,
          goal_achievement_rate: 90.5,
          total_sessions: 15
        }
      ];
      setQualityData(mockData);
    } catch (error) {
      showError("Erro ao carregar métricas de qualidade");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hasPermission('relatorios', 'read')) {
      fetchQualityData();
    }
  }, [period, currentUnit, hasPermission]);

  const filteredData = qualityData.filter(item => 
    specialty === 'all' || item.specialty.toLowerCase() === specialty
  );

  const stats = {
    totalPatients: filteredData.length,
    avgAttendance: filteredData.length > 0 
      ? filteredData.reduce((acc, item) => acc + item.attendance_rate, 0) / filteredData.length 
      : 0,
    avgGoalAchievement: filteredData.length > 0
      ? filteredData.reduce((acc, item) => acc + item.goal_achievement_rate, 0) / filteredData.length
      : 0,
    totalSessions: filteredData.reduce((acc, item) => acc + item.total_sessions, 0),
    highPerformers: filteredData.filter(item => item.attendance_rate >= 90 && item.goal_achievement_rate >= 80).length,
    needsAttention: filteredData.filter(item => item.attendance_rate < 70 || item.goal_achievement_rate < 50).length
  };

  const exportData = () => {
    const csvContent = [
      ['Paciente', 'Terapeuta', 'Especialidade', 'Taxa de Presença (%)', 'Taxa de Objetivos (%)', 'Total de Sessões'],
      ...filteredData.map(item => [
        item.patient_name,
        item.therapist_name,
        item.specialty,
        item.attendance_rate,
        item.goal_achievement_rate,
        item.total_sessions
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_qualidade_${period}dias.csv`;
    link.click();
  };

  if (!hasPermission('relatorios', 'read')) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Dashboard de Qualidade</h2>
          <p className="text-muted-foreground">Métricas de desempenho e evolução dos pacientes</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="180">Últimos 6 meses</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Especialidades</SelectItem>
              <SelectItem value="psicologia">Psicologia</SelectItem>
              <SelectItem value="fonoaudiologia">Fonoaudiologia</SelectItem>
              <SelectItem value="terapia_ocupacional">Terapia Ocupacional</SelectItem>
              <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportData} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.avgAttendance.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Presença</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {stats.avgAttendance >= 85 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className={stats.avgAttendance >= 85 ? 'text-success' : 'text-destructive'}>
                Meta: 85%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{stats.avgGoalAchievement.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Objetivos Atingidos</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {stats.avgGoalAchievement >= 70 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className={stats.avgGoalAchievement >= 70 ? 'text-success' : 'text-destructive'}>
                Meta: 70%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Total de Sessões</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              Alto Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success mb-2">{stats.highPerformers}</div>
            <p className="text-sm text-muted-foreground">
              Pacientes com presença ≥90% e objetivos ≥80%
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <TrendingDown className="h-5 w-5" />
              Necessita Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive mb-2">{stats.needsAttention}</div>
            <p className="text-sm text-muted-foreground">
              Pacientes com presença &lt;70% ou objetivos &lt;50%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando dados...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum dado encontrado para o período selecionado
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((item, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{item.patient_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.specialty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        Terapeuta: {item.therapist_name}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Presença: </span>
                          <span className={`font-medium ${
                            item.attendance_rate >= 90 ? 'text-success' : 
                            item.attendance_rate >= 70 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {item.attendance_rate.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Objetivos: </span>
                          <span className={`font-medium ${
                            item.goal_achievement_rate >= 80 ? 'text-success' : 
                            item.goal_achievement_rate >= 50 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {item.goal_achievement_rate.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Sessões: </span>
                          <span className="font-medium">{item.total_sessions}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {item.attendance_rate >= 90 && item.goal_achievement_rate >= 80 && (
                        <Badge className="bg-success text-success-foreground">
                          Excelente
                        </Badge>
                      )}
                      {(item.attendance_rate < 70 || item.goal_achievement_rate < 50) && (
                        <Badge variant="destructive">
                          Atenção
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};