import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Calculator, 
  FileText, 
  Clock, 
  AlertCircle, 
  Target, 
  TrendingUp,
  Calendar,
  Save,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/usePermissions";
import { ScaleCalculator } from "./ScaleCalculator";

interface AssessmentProtocolsProps {
  patientId: number;
  diagnosis: string;
  age: number;
}

interface Assessment {
  id: number;
  name: string;
  date: string;
  score: string;
  classification: string;
  appliedBy: string;
  nextDue?: string;
  status: 'completed' | 'pending' | 'overdue';
}

export const AssessmentProtocols = ({ patientId, diagnosis, age }: AssessmentProtocolsProps) => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const [selectedProtocol, setSelectedProtocol] = useState<string>("");
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);

  // Protocolos específicos por diagnóstico
  const protocolsByDiagnosis = {
    "TEA": [
      { name: "CARS-2", description: "Escala de Avaliação do Autismo", interval: 6, ageRange: [2, 18] },
      { name: "ADOS-2", description: "Cronograma de Observação Diagnóstica do Autismo", interval: 12, ageRange: [1, 30] },
      { name: "ADI-R", description: "Entrevista Diagnóstica do Autismo Revisada", interval: 12, ageRange: [2, 18] },
      { name: "Vineland-3", description: "Escala de Comportamento Adaptativo", interval: 6, ageRange: [0, 90] },
      { name: "PEP-3", description: "Perfil Psicoeducacional", interval: 6, ageRange: [2, 7] }
    ],
    "TDAH": [
      { name: "SNAP-IV", description: "Escala de Avaliação TDAH", interval: 3, ageRange: [6, 18] },
      { name: "CBCL", description: "Inventário de Comportamentos", interval: 6, ageRange: [1.5, 18] },
      { name: "Conners-3", description: "Escala de Conners", interval: 6, ageRange: [6, 18] },
      { name: "CPT-3", description: "Teste de Performance Contínua", interval: 12, ageRange: [8, 25] }
    ],
    "Síndrome de Down": [
      { name: "Bayley-4", description: "Escala de Desenvolvimento Infantil", interval: 6, ageRange: [1, 42] },
      { name: "Vineland-3", description: "Escala de Comportamento Adaptativo", interval: 6, ageRange: [0, 90] },
      { name: "WISC-V", description: "Escala de Inteligência Wechsler", interval: 12, ageRange: [6, 16] }
    ],
    "Deficiência Intelectual": [
      { name: "WISC-V", description: "Escala de Inteligência Wechsler", interval: 12, ageRange: [6, 16] },
      { name: "Vineland-3", description: "Escala de Comportamento Adaptativo", interval: 6, ageRange: [0, 90] },
      { name: "SIS", description: "Escala de Intensidade de Suporte", interval: 12, ageRange: [16, 64] }
    ]
  };

  // Mock data de avaliações existentes
  const existingAssessments: Assessment[] = [
    {
      id: 1,
      name: "CARS-2",
      date: "2024-01-15",
      score: "32 pontos",
      classification: "Autismo Leve a Moderado",
      appliedBy: "Dra. Ana Costa",
      nextDue: "2024-07-15",
      status: "completed"
    },
    {
      id: 2,
      name: "Vineland-3",
      date: "2023-12-10",
      score: "75 pontos",
      classification: "Moderadamente Baixo",
      appliedBy: "TO. Carlos Lima",
      nextDue: "2024-06-10",
      status: "completed"
    },
    {
      id: 3,
      name: "PEP-3",
      date: "2023-09-20",
      score: "Idade desenvolvimento: 5a2m",
      classification: "Moderado",
      appliedBy: "Dra. Ana Costa",
      nextDue: "2024-03-20",
      status: "overdue"
    }
  ];

  const availableProtocols = protocolsByDiagnosis[diagnosis as keyof typeof protocolsByDiagnosis] || [];
  const recommendedProtocols = availableProtocols.filter(p => age >= p.ageRange[0] && age <= p.ageRange[1]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleNewAssessment = () => {
    toast({
      title: "Avaliação registrada",
      description: "Nova avaliação foi salva com sucesso."
    });
    setIsNewAssessmentOpen(false);
    setSelectedProtocol("");
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!hasPermission('clinical_records', 'view')) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Você não tem permissão para visualizar protocolos de avaliação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{existingAssessments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Completas</p>
                <p className="text-2xl font-bold">{existingAssessments.filter(a => a.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{existingAssessments.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Atrasadas</p>
                <p className="text-2xl font-bold">{existingAssessments.filter(a => a.status === 'overdue').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocolos Recomendados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Protocolos Recomendados para {diagnosis}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedProtocols.map((protocol) => (
              <Card key={protocol.name} className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{protocol.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{protocol.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Idade: {protocol.ageRange[0]}-{protocol.ageRange[1]} anos</span>
                    <span>A cada {protocol.interval} meses</span>
                  </div>
                  {hasPermission('clinical_records', 'edit') && (
                    <Button size="sm" variant="outline" className="w-full">
                      Aplicar Avaliação
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="existing" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="existing">Avaliações Existentes</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora de Escalas</TabsTrigger>
          </TabsList>
          
          {hasPermission('clinical_records', 'edit') && (
            <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Avaliação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Avaliação - {diagnosis}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Protocolo de Avaliação</label>
                    <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o protocolo" />
                      </SelectTrigger>
                      <SelectContent>
                        {recommendedProtocols.map((protocol) => (
                          <SelectItem key={protocol.name} value={protocol.name}>
                            {protocol.name} - {protocol.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Data da Aplicação</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Próxima Reavaliação</label>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Escore Total</label>
                      <Input placeholder="Ex: 32 pontos" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Classificação</label>
                      <Input placeholder="Ex: Autismo Leve a Moderado" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Observações</label>
                    <Textarea placeholder="Observações importantes sobre a avaliação..." rows={3} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleNewAssessment} className="flex-1 gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Avaliação
                    </Button>
                    <Button variant="outline" onClick={() => setIsNewAssessmentOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <TabsContent value="existing">
          <div className="space-y-4">
            {existingAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Calculator className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-lg">{assessment.name}</h4>
                        <p className="text-sm text-muted-foreground">{assessment.appliedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status === 'completed' ? 'Completa' :
                         assessment.status === 'pending' ? 'Pendente' : 'Atrasada'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(assessment.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Escore</p>
                      <p className="font-medium">{assessment.score}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Classificação</p>
                      <p className="font-medium">{assessment.classification}</p>
                    </div>
                    {assessment.nextDue && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Próxima Reavaliação</p>
                        <p className="font-medium">
                          {new Date(assessment.nextDue).toLocaleDateString('pt-BR')}
                          {getDaysUntilDue(assessment.nextDue) < 0 && (
                            <span className="text-destructive ml-2">
                              ({Math.abs(getDaysUntilDue(assessment.nextDue))} dias atrasada)
                            </span>
                          )}
                          {getDaysUntilDue(assessment.nextDue) >= 0 && getDaysUntilDue(assessment.nextDue) <= 30 && (
                            <span className="text-warning ml-2">
                              (em {getDaysUntilDue(assessment.nextDue)} dias)
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <ScaleCalculator selectedScale={selectedProtocol} />
        </TabsContent>
      </Tabs>
    </div>
  );
};