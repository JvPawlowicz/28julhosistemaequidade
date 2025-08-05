import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  TrendingUp,
  Heart,
  Target,
  Clock,
  User
} from "lucide-react";
import { FamilyReports } from "@/components/FamilyReports";
import { FamilyMessaging } from "@/components/FamilyMessaging";

const ResponsavelDashboard = () => {
  const dadosPaciente = {
    nome: "João Silva",
    idade: 8,
    condicao: "Transtorno do Espectro Autista",
    progresso_geral: 72,
  };

  const proximosAgendamentos = [
    {
      id: 1,
      especialidade: "Terapia Ocupacional",
      profissional: "Marina Santos",
      data: "2024-07-26T14:00:00Z",
    },
    {
      id: 2,
      especialidade: "Fonoaudiologia",
      profissional: "Paula Silva",
      data: "2024-07-27T15:30:00Z",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Heart className="h-8 w-8" />
          Portal das Famílias
        </h1>
        <p className="text-muted-foreground">
          Acompanhamento completo do desenvolvimento de {dadosPaciente.nome}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Módulos principais */}
          <FamilyReports />
          <FamilyMessaging />
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Resumo do Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Resumo de {dadosPaciente.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso Geral</span>
                  <span className="font-semibold">{dadosPaciente.progresso_geral}%</span>
                </div>
                <Progress value={dadosPaciente.progresso_geral} className="h-2" />
              </div>
              <div className="text-sm">
                <p><span className="font-semibold">Idade:</span> {dadosPaciente.idade} anos</p>
                <p><span className="font-semibold">Condição:</span> {dadosPaciente.condicao}</p>
              </div>
              <Button variant="outline" className="w-full">Ver Plano Terapêutico</Button>
            </CardContent>
          </Card>

          {/* Próximos Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximosAgendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{agendamento.especialidade}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(agendamento.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResponsavelDashboard;