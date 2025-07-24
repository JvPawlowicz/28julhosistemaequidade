import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Calendar,
  User,
  Heart,
  Upload,
  Download,
  Edit,
  Plus,
  Target,
  TrendingUp,
  FileImage,
  ClipboardList
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import MedicalRecordTabs from "@/components/MedicalRecordTabs";

const Prontuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [isEvolucaoOpen, setIsEvolucaoOpen] = useState(false);
  const { toast } = useToast();

  const pacientes = [
    {
      id: 1,
      nome: "João Silva Santos",
      idade: 12,
      diagnostico: "TEA - Transtorno do Espectro Autista",
      responsavel: "Maria Silva",
      dataInicio: "2023-03-15",
      status: "ativo"
    },
    {
      id: 2, 
      nome: "Maria Oliveira Santos",
      idade: 8,
      diagnostico: "TDAH - Transtorno do Déficit de Atenção",
      responsavel: "José Oliveira", 
      dataInicio: "2023-05-22",
      status: "ativo"
    }
  ];

  const prontuarioData = {
    historico: [
      {
        data: "2024-01-15",
        terapeuta: "Dra. Ana Costa",
        tipo: "Sessão Individual",
        observacoes: "Paciente demonstrou boa evolução na comunicação verbal. Conseguiu expressar necessidades básicas com palavras simples. Trabalho focado em atenção compartilhada mostrou resultados positivos.",
        objetivos: ["Aumentar vocabulário funcional", "Melhorar contato visual"],
        progressos: ["Uso espontâneo de 5 palavras novas", "Mantém contato visual por 10 segundos"]
      },
      {
        data: "2024-01-12", 
        terapeuta: "TO. Carlos Lima",
        tipo: "Terapia Ocupacional",
        observacoes: "Sessão focada em coordenação motora fina. Atividades de encaixe e empilhamento. Paciente mostrou dificuldade inicial mas conseguiu completar tarefas com apoio.",
        objetivos: ["Desenvolver preensão em pinça", "Melhorar coordenação bilateral"],
        progressos: ["Conseguiu pegar objetos pequenos", "Empilhou 6 blocos consecutivos"]
      }
    ],
    planoTerapeutico: {
      objetivoGeral: "Desenvolver habilidades de comunicação, interação social e autonomia para atividades de vida diária",
      metasLongoPrazo: [
        "Comunicação funcional com frases de 3-4 palavras",
        "Interação social com pares de forma espontânea", 
        "Autonomia para atividades básicas (higiene, alimentação)"
      ],
      objetivosCurtoPrazo: [
        "Ampliar vocabulário para 50 palavras funcionais",
        "Manter atenção em atividade dirigida por 15 minutos",
        "Realizar sequência de 3 comandos simples"
      ],
      frequencia: "3x por semana - Psicologia e TO",
      revisao: "2024-04-15"
    },
    documentos: [
      { nome: "Laudo Inicial - Neuropediatra", data: "2023-03-10", tipo: "laudo" },
      { nome: "Avaliação Psicológica", data: "2023-03-20", tipo: "avaliacao" },
      { nome: "Relatório TO - 1º Trimestre", data: "2023-06-15", tipo: "relatorio" },
      { nome: "Fotos - Atividades Lúdicas", data: "2024-01-10", tipo: "imagem" }
    ],
    avaliacoes: [
      {
        nome: "CARS-2 (Escala de Avaliação do Autismo)",
        data: "2023-03-20",
        escore: "32 pontos",
        classificacao: "Autismo Leve a Moderado",
        observacoes: "Escores elevados em comunicação e interação social"
      },
      {
        nome: "Vineland-3 (Comportamento Adaptativo)", 
        data: "2023-06-15",
        escore: "75 pontos",
        classificacao: "Moderadamente Baixo",
        observacoes: "Déficits principalmente em socialização e comunicação"
      }
    ]
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPaciente = (paciente: any) => {
    setSelectedPaciente(paciente);
  };

  const handleNovaEvolucao = () => {
    toast({
      title: "Evolução registrada",
      description: "Nova evolução clínica foi salva com sucesso."
    });
    setIsEvolucaoOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Prontuários Eletrônicos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie prontuários completos dos pacientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lista de Pacientes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-3">
              {filteredPacientes.map((paciente) => (
                <div
                  key={paciente.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPaciente?.id === paciente.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-medical-gray hover:bg-medical-border'
                  }`}
                  onClick={() => handleSelectPaciente(paciente)}
                >
                  <h4 className="font-medium text-sm">{paciente.nome}</h4>
                  <p className="text-xs opacity-90">{paciente.idade} anos</p>
                  <p className="text-xs opacity-75 truncate">{paciente.diagnostico}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Prontuário */}
        <div className="lg:col-span-3">
          {selectedPaciente ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedPaciente.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      {selectedPaciente.nome}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {selectedPaciente.idade} anos • {selectedPaciente.diagnostico}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog open={isEvolucaoOpen} onOpenChange={setIsEvolucaoOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Nova Evolução
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Nova Evolução Clínica</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Data da Sessão</label>
                              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Tipo de Atendimento</label>
                              <Input placeholder="Ex: Sessão Individual" />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Observações da Sessão</label>
                            <Textarea 
                              placeholder="Descreva o que foi trabalhado, comportamento do paciente, evolução observada..."
                              rows={4}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Objetivos Trabalhados</label>
                            <Textarea 
                              placeholder="Liste os objetivos específicos trabalhados nesta sessão..."
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Progressos Observados</label>
                            <Textarea 
                              placeholder="Descreva os progressos e conquistas identificados..."
                              rows={2}
                            />
                          </div>
                          
                          <Button onClick={handleNovaEvolucao} className="w-full">
                            Salvar Evolução
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MedicalRecordTabs patient={selectedPaciente} />
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Selecione um Paciente</h3>
                  <p className="text-muted-foreground">
                    Escolha um paciente na lista ao lado para visualizar seu prontuário completo
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prontuarios;