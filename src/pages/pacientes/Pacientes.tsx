import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UnitDataIndicator from "@/components/UnitDataIndicator";
import { ImportPatientModal } from "@/components/ImportPatientModal";
import WaitingListModal from "@/components/WaitingListModal";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { usePermissions } from "@/contexts/usePermissions";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Pacientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUnit } = useMultiTenant();
  const { isAdmin, getUserRole } = usePermissions();

  const [pacientes] = useState([
    {
      id: 1,
      nome: "João Silva Santos",
      idade: 12,
      dataNascimento: "2011-03-15",
      responsavel: "Maria Silva",
      telefone: "(11) 99999-1111",
      email: "maria.silva@email.com",
      diagnostico: "TEA - Transtorno do Espectro Autista",
      unidade: "Centro",
      status: "ativo",
      ultimaConsulta: "2024-01-12",
      proximaConsulta: "2024-01-18",
      terapeutas: ["Dra. Ana Costa", "TO. Carlos Lima"],
      faltas: 1,
      frequencia: 95
    },
    {
      id: 2,
      nome: "Maria Oliveira Santos", 
      idade: 8,
      dataNascimento: "2015-07-22",
      responsavel: "José Oliveira",
      telefone: "(11) 99999-2222",
      email: "jose.oliveira@email.com",
      diagnostico: "TDAH - Transtorno do Déficit de Atenção",
      unidade: "Norte",
      status: "ativo",
      ultimaConsulta: "2024-01-14",
      proximaConsulta: "2024-01-19",
      terapeutas: ["Fga. Paula Silva"],
      faltas: 0,
      frequencia: 100
    },
    {
      id: 3,
      nome: "Pedro Costa Mendes",
      idade: 15,
      dataNascimento: "2008-11-08",
      responsavel: "Carla Costa",
      telefone: "(11) 99999-3333", 
      email: "carla.costa@email.com",
      diagnostico: "Síndrome de Down",
      unidade: "Sul",
      status: "ativo",
      ultimaConsulta: "2024-01-10",
      proximaConsulta: "2024-01-20",
      terapeutas: ["TO. Carlos Lima", "Ft. Roberto Silva"],
      faltas: 2,
      frequencia: 88
    },
    {
      id: 4,
      nome: "Ana Beatriz Lima",
      idade: 9,
      dataNascimento: "2014-05-12",
      responsavel: "Roberto Lima",
      telefone: "(11) 99999-4444",
      email: "roberto.lima@email.com", 
      diagnostico: "Atraso no Desenvolvimento",
      unidade: "Centro",
      status: "triagem",
      ultimaConsulta: "2024-01-08",
      proximaConsulta: "2024-01-22",
      terapeutas: ["Dra. Ana Costa"],
      faltas: 0,
      frequencia: 100
    },
    {
      id: 5,
      nome: "Carlos Eduardo Mendes",
      idade: 7,
      dataNascimento: "2016-09-30",
      responsavel: "Sandra Mendes",
      telefone: "(11) 99999-5555",
      email: "sandra.mendes@email.com",
      diagnostico: "Deficiência Intelectual Leve",
      unidade: "Norte", 
      status: "pausado",
      ultimaConsulta: "2023-12-15",
      proximaConsulta: null,
      terapeutas: ["TO. Carlos Lima", "Fga. Paula Silva"],
      faltas: 5,
      frequencia: 65
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success text-success-foreground';
      case 'triagem': return 'bg-warning text-warning-foreground';
      case 'pausado': return 'bg-destructive text-destructive-foreground';
      case 'alta': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFrequenciaColor = (frequencia: number) => {
    if (frequencia >= 90) return 'text-success';
    if (frequencia >= 70) return 'text-warning';
    return 'text-destructive';
  };

  // Simular filtro por unidade - Admin vê todos, outros apenas da sua unidade
  const getAllPacientes = () => pacientes;
  
  const getPacientesByUnit = () => {
    if (isAdmin() && currentUnit) {
      // Admin filtra pela unidade selecionada
      return pacientes.filter(p => p.unidade === currentUnit.name);
    } else if (getUserRole() === 'terapeuta' || getUserRole() === 'estagiario') {
      // Terapeuta vê apenas seus pacientes (simulado)
      return pacientes.filter(p => p.terapeutas.some(t => t.includes('Ana')));
    } else {
      // Outros roles veem todos da unidade Centro (padrão)
      return pacientes.filter(p => p.unidade === 'Centro');
    }
  };

  const displayedPacientes = getPacientesByUnit();
  
  const filteredPacientes = displayedPacientes.filter(paciente => {
    const matchesSearch = paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.diagnostico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || paciente.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: getAllPacientes().length,
    displayed: displayedPacientes.length,
    ativos: displayedPacientes.filter(p => p.status === 'ativo').length,
    triagem: displayedPacientes.filter(p => p.status === 'triagem').length,
    pausados: displayedPacientes.filter(p => p.status === 'pausado').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Pacientes</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie pacientes e seus prontuários
          </p>
        </div>

        <div className="flex gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Paciente
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo *</label>
                  <Input placeholder="Nome do paciente" />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Nascimento *</label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Responsável *</label>
                  <Input placeholder="Nome completo do responsável" />
                </div>
                <div>
                  <label className="text-sm font-medium">Parentesco</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="avo">Avó/Avô</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Telefone *</label>
                  <Input placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="email@exemplo.com" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Diagnóstico/Suspeita Clínica</label>
                <Input placeholder="Ex: TEA, TDAH, Síndrome de Down..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Unidade de Atendimento</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="norte">Norte</SelectItem>
                      <SelectItem value="sul">Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status Inicial</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triagem">Triagem</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cadastrar Paciente
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <ImportPatientModal onImportComplete={() => toast({ title: "Pacientes importados com sucesso!" })} />
        <WaitingListModal />
        </div>
      </div>

      {/* Indicador de dados filtrados */}
      <UnitDataIndicator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.displayed}</p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin() && currentUnit ? `${currentUnit.name}` : 'Meus Pacientes'}
                </p>
              </div>
            </div>
            {isAdmin() && (
              <div className="mt-2 text-xs text-muted-foreground">
                Total sistema: {stats.total} • Nesta unidade: {stats.displayed}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.ativos}</p>
                <p className="text-sm text-muted-foreground">Em Atendimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.triagem}</p>
                <p className="text-sm text-muted-foreground">Em Triagem</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{stats.pausados}</p>
                <p className="text-sm text-muted-foreground">Pausados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, responsável ou diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="triagem">Triagem</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes ({filteredPacientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPacientes.map((paciente) => (
              <div key={paciente.id} className="p-4 border border-medical-border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {paciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{paciente.nome}</h4>
                      <p className="text-sm text-muted-foreground">{paciente.idade} anos • {paciente.diagnostico}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {paciente.responsavel}
                        </span>
                        <Badge className={getStatusColor(paciente.status)}>
                          {paciente.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getFrequenciaColor(paciente.frequencia)}`}>
                      {paciente.frequencia}%
                    </div>
                    <p className="text-xs text-muted-foreground">Frequência</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contato</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {paciente.telefone}
                    </p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {paciente.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unidade</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {paciente.unidade}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última Consulta</p>
                    <p className="font-medium">{new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Próxima Consulta</p>
                    <p className="font-medium">
                      {paciente.proximaConsulta ? new Date(paciente.proximaConsulta).toLocaleDateString('pt-BR') : 'Não agendada'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Equipe Terapêutica:</p>
                  <div className="flex gap-2 flex-wrap">
                    {paciente.terapeutas.map((terapeuta, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {terapeuta}
                      </Badge>
                    ))}
                  </div>
                </div>

                {paciente.faltas > 0 && (
                  <div className="mb-4 p-2 bg-warning/10 border border-warning/20 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="font-medium">{paciente.faltas} falta(s) no mês</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="gap-1"
                    onClick={() => navigate(`/app/pacientes/${paciente.id}`)}
                  >
                    <FileText className="h-3 w-3" />
                    Ver Perfil
                  </Button>
                  <Button size="sm" variant="medical" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    Agendar
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-1">
                    <Phone className="h-3 w-3" />
                    Contatar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pacientes;