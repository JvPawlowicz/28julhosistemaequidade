import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Brain, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  Route, 
  Star,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Plus,
  Zap
} from "lucide-react";
import { showSuccess, showError } from '@/utils/notifications'; // Import new notification utility

interface SmartSchedulerProps {
  patientId?: number;
  patientName?: string;
}

interface TherapySession {
  type: string;
  therapist: string;
  duration: number;
  room: string;
  equipment?: string[];
  priority: 'high' | 'medium' | 'low';
}

interface ScheduleSuggestion {
  id: string;
  date: string;
  sessions: {
    startTime: string;
    endTime: string;
    type: string;
    therapist: string;
    room: string;
    sequencePosition: number;
  }[];
  benefits: string[];
  optimizationScore: number;
  travelTime: number;
  waitTime: number;
}

export const SmartScheduler = ({ patientId, patientName }: SmartSchedulerProps) => {
  const [selectedTherapies, setSelectedTherapies] = useState<TherapySession[]>([]);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [preferredTimes, setPreferredTimes] = useState({ start: "09:00", end: "17:00" });
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Terapias disponíveis
  const availableTherapies = [
    {
      type: "Psicologia Individual",
      therapists: ["Dra. Ana Costa", "Dr. João Silva"],
      duration: 50,
      room: "Sala 1, Sala 2, Sala 3",
      equipment: ["Mesa infantil", "Brinquedos terapêuticos"],
      priority: "high" as const
    },
    {
      type: "Terapia Ocupacional",
      therapists: ["TO. Carlos Lima", "TO. Maria Santos"],
      duration: 60,
      room: "Sala TO, Sala Sensorial",
      equipment: ["Mesa de atividades", "Materiais sensoriais", "Espelhos"],
      priority: "high" as const
    },
    {
      type: "Fonoaudiologia",
      therapists: ["Fga. Paula Silva", "Fga. Ana Rodrigues"],
      duration: 45,
      room: "Sala Fono 1, Sala Fono 2",
      equipment: ["Espelho articulatório", "Computador com softwares"],
      priority: "medium" as const
    },
    {
      type: "Grupo de Habilidades Sociais",
      therapists: ["Dra. Ana Costa + TO. Carlos Lima"],
      duration: 90,
      room: "Sala Grande",
      equipment: ["Espaço amplo", "Materiais de grupo"],
      priority: "medium" as const
    },
    {
      type: "Fisioterapia",
      therapists: ["Ft. Roberto Costa", "Ft. Luciana Alves"],
      duration: 50,
      room: "Sala de Fisioterapia",
      equipment: ["Tatame", "Bolas terapêuticas", "Colchonetes"],
      priority: "low" as const
    }
  ];

  const weekDays = [
    { value: "monday", label: "Segunda-feira" },
    { value: "tuesday", label: "Terça-feira" },
    { value: "wednesday", label: "Quarta-feira" },
    { value: "thursday", label: "Quinta-feira" },
    { value: "friday", label: "Sexta-feira" }
  ];

  // Simular algoritmo de otimização
  const generateOptimalSchedule = async () => {
    if (selectedTherapies.length === 0) {
      showError("Erro", "Selecione pelo menos uma terapia.");
      return;
    }

    setIsAnalyzing(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Gerar sugestões baseadas nas terapias selecionadas
    const mockSuggestions: ScheduleSuggestion[] = [
      {
        id: "1",
        date: "Terça-feira, 23 de Janeiro",
        sessions: [
          {
            startTime: "09:00",
            endTime: "10:00",
            type: "Terapia Ocupacional",
            therapist: "TO. Carlos Lima",
            room: "Sala TO",
            sequencePosition: 1
          },
          {
            startTime: "10:15",
            endTime: "11:05",
            type: "Psicologia Individual",
            therapist: "Dra. Ana Costa",
            room: "Sala 1",
            sequencePosition: 2
          },
          {
            startTime: "11:15",
            endTime: "12:00",
            type: "Fonoaudiologia",
            therapist: "Fga. Paula Silva",
            room: "Sala Fono 1",
            sequencePosition: 3
          }
        ],
        benefits: [
          "TO → Psicologia: Melhora na coordenação pode potencializar atividades cognitivas",
          "Sequência matinal aproveita melhor disposição da criança",
          "Tempo de deslocamento mínimo entre salas",
          "Todos os recursos necessários disponíveis"
        ],
        optimizationScore: 95,
        travelTime: 10,
        waitTime: 10
      },
      {
        id: "2", 
        date: "Quinta-feira, 25 de Janeiro",
        sessions: [
          {
            startTime: "14:00",
            endTime: "14:50",
            type: "Psicologia Individual",
            therapist: "Dr. João Silva",
            room: "Sala 2",
            sequencePosition: 1
          },
          {
            startTime: "15:00",
            endTime: "16:00",
            type: "Terapia Ocupacional",
            therapist: "TO. Maria Santos",
            room: "Sala Sensorial",
            sequencePosition: 2
          }
        ],
        benefits: [
          "Psicologia → TO: Relaxamento mental antes de atividades motoras",
          "Período vespertino adequado para atividades mais tranquilas",
          "Salas próximas, sem necessidade de deslocamento"
        ],
        optimizationScore: 88,
        travelTime: 5,
        waitTime: 0
      },
      {
        id: "3",
        date: "Sexta-feira, 26 de Janeiro",
        sessions: [
          {
            startTime: "10:30",
            endTime: "12:00",
            type: "Grupo de Habilidades Sociais",
            therapist: "Dra. Ana Costa + TO. Carlos Lima",
            room: "Sala Grande",
            sequencePosition: 1
          }
        ],
        benefits: [
          "Sessão única de grupo com foco em habilidades sociais",
          "Horário adequado para interação com outras crianças",
          "Abordagem interdisciplinar com psicólogo e TO"
        ],
        optimizationScore: 82,
        travelTime: 0,
        waitTime: 0
      }
    ];

    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);

    showSuccess("Análise concluída", `${mockSuggestions.length} sugestões otimizadas geradas.`);
  };

  const addTherapy = (therapy: any) => {
    const newTherapy: TherapySession = {
      type: therapy.type,
      therapist: therapy.therapists[0],
      duration: therapy.duration,
      room: therapy.room.split(',')[0],
      equipment: therapy.equipment,
      priority: therapy.priority
    };
    setSelectedTherapies([...selectedTherapies, newTherapy]);
  };

  const removeTherapy = (index: number) => {
    setSelectedTherapies(selectedTherapies.filter((_, i) => i !== index));
  };

  const getOptimizationColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-muted-foreground";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agendamento Inteligente
            {patientName && <span className="text-muted-foreground">- {patientName}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O algoritmo analisa as terapias selecionadas e gera sugestões otimizadas considerando:
            sinergias entre terapias, disponibilidade de recursos, preferências da família e melhor aproveitamento do tempo.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração */}
        <div className="space-y-6">
          {/* Seleção de Terapias */}
          <Card>
            <CardHeader>
              <CardTitle>Terapias Desejadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Terapias selecionadas */}
                {selectedTherapies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Selecionadas:</h4>
                    {selectedTherapies.map((therapy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getPriorityColor(therapy.priority)}>
                            {therapy.priority}
                          </Badge>
                          <div>
                            <p className="font-medium">{therapy.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {therapy.duration}min • {therapy.therapist}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTherapy(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Terapias disponíveis */}
                <div className="space-y-2">
                  <h4 className="font-medium">Disponíveis:</h4>
                  {availableTherapies
                    .filter(therapy => !selectedTherapies.some(selected => selected.type === therapy.type))
                    .map((therapy, index) => (
                    <div key={index} className="p-3 border border-medical-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getPriorityColor(therapy.priority)}>
                            {therapy.priority}
                          </Badge>
                          <div>
                            <p className="font-medium">{therapy.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {therapy.duration}min • {therapy.therapists.join(" ou ")}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addTherapy(therapy)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Dias Preferenciais</label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day.value}
                        size="sm"
                        variant={preferredDays.includes(day.value) ? "default" : "outline"}
                        onClick={() => {
                          if (preferredDays.includes(day.value)) {
                            setPreferredDays(preferredDays.filter(d => d !== day.value));
                          } else {
                            setPreferredDays([...preferredDays, day.value]);
                          }
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Horário Início</label>
                    <Input
                      type="time"
                      value={preferredTimes.start}
                      onChange={(e) => setPreferredTimes(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Horário Fim</label>
                    <Input
                      type="time"
                      value={preferredTimes.end}
                      onChange={(e) => setPreferredTimes(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão Analisar */}
          <Button 
            onClick={generateOptimalSchedule} 
            disabled={isAnalyzing}
            className="w-full gap-2"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analisando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Gerar Sugestões Otimizadas
              </>
            )}
          </Button>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          {suggestions.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Sugestões Otimizadas
                  </CardTitle>
                </CardHeader>
              </Card>

              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suggestion.date}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Star className={`h-4 w-4 ${getOptimizationColor(suggestion.optimizationScore)}`} />
                        <span className={`font-bold ${getOptimizationColor(suggestion.optimizationScore)}`}>
                          {suggestion.optimizationScore}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Timeline das sessões */}
                      <div className="space-y-3">
                        {suggestion.sessions.map((session, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                {session.sequencePosition}
                              </div>
                              <div className="text-sm font-mono">
                                {session.startTime} - {session.endTime}
                              </div>
                            </div>
                            {index < suggestion.sessions.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{session.type}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {session.therapist}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {session.room}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-accent rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Deslocamento</p>
                          <p className="font-bold">{suggestion.travelTime}min</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Espera</p>
                          <p className="font-bold">{suggestion.waitTime}min</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Otimização</p>
                          <p className={`font-bold ${getOptimizationColor(suggestion.optimizationScore)}`}>
                            {suggestion.optimizationScore}%
                          </p>
                        </div>
                      </div>

                      {/* Benefícios */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Benefícios da Sequência:
                        </h4>
                        <ul className="space-y-1">
                          {suggestion.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="w-1 h-1 bg-success rounded-full mt-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          Agendar Esta Sequência
                        </Button>
                        <Button variant="outline">
                          Personalizar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {suggestions.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aguardando Configuração</h3>
                <p className="text-muted-foreground">
                  Selecione as terapias desejadas e clique em "Gerar Sugestões" para ver as opções otimizadas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};