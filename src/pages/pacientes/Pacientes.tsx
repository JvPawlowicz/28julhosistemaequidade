import { useState, useEffect, useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<'patients'> & {
  guardians?: Tables<'guardians'>; // Assuming primary_guardian_id can be joined
  units?: Tables<'units'>; // Assuming unit_id can be joined
};

const Pacientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUnit, isAdmin } = useMultiTenant();
  const { hasPermission, getUserRole } = usePermissions();

  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState({
    full_name: "",
    birth_date: "",
    primary_guardian_name: "", // Not directly in DB, would need to create guardian first
    relationship: "",
    phone: "",
    email: "",
    diagnosis: "",
    unit_id: "",
    status: "" // Initial status
  });

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('patients')
        .select(`
          *,
          guardians(full_name, email, phone),
          units(name)
        `)
        .order('full_name', { ascending: true });

      if (!isAdmin() && currentUnit) {
        query = query.eq('unit_id', currentUnit.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPacientes(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Erro ao carregar pacientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentUnit, toast]);

  useEffect(() => {
    if (hasPermission('pacientes', 'view')) {
      fetchPatients();
    }
  }, [fetchPatients, hasPermission]);

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

  const displayedPacientes = pacientes; // Now directly using fetched patients

  const filteredPacientes = displayedPacientes.filter(paciente => {
    const matchesSearch = paciente.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.guardians?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || paciente.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: pacientes.length, // Total fetched
    displayed: filteredPacientes.length,
    ativos: filteredPacientes.filter(p => p.status === 'ativo').length,
    triagem: filteredPacientes.filter(p => p.status === 'triagem').length,
    pausados: filteredPacientes.filter(p => p.status === 'pausado').length
  };

  const handleCreatePatient = async () => {
    if (!newPatient.full_name || !newPatient.birth_date || !newPatient.primary_guardian_name || !newPatient.phone || !newPatient.unit_id || !newPatient.status) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, create the guardian
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .insert({
          full_name: newPatient.primary_guardian_name,
          birth_date: '2000-01-01', // Placeholder, consider adding to form
          cpf: '00000000000', // Placeholder, consider adding to form
          phone: newPatient.phone,
          email: newPatient.email,
          relationship: newPatient.relationship,
        })
        .select()
        .single();

      if (guardianError) throw guardianError;

      // Then, create the patient linking to the new guardian
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert({
          full_name: newPatient.full_name,
          birth_date: newPatient.birth_date,
          phone: newPatient.phone,
          diagnosis: newPatient.diagnosis,
          unit_id: newPatient.unit_id,
          status: newPatient.status,
          primary_guardian_id: guardianData.id,
        })
        .select(`
          *,
          guardians(full_name, email, phone),
          units(name)
        `)
        .single();

      if (patientError) throw patientError;

      setPacientes(prev => [...prev, patientData]);
      setNewPatient({
        full_name: "", birth_date: "", primary_guardian_name: "", relationship: "",
        phone: "", email: "", diagnosis: "", unit_id: "", status: ""
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Paciente cadastrado",
        description: `${patientData.full_name} foi adicionado com sucesso.`
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Erro ao cadastrar paciente",
        description: "Não foi possível cadastrar o paciente.",
        variant: "destructive"
      });
    }
  };

  if (!hasPermission('pacientes', 'view')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar pacientes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <Input 
                    placeholder="Nome do paciente" 
                    value={newPatient.full_name}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Nascimento *</label>
                  <Input 
                    type="date" 
                    value={newPatient.birth_date}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, birth_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Responsável *</label>
                  <Input 
                    placeholder="Nome completo do responsável" 
                    value={newPatient.primary_guardian_name}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, primary_guardian_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Parentesco</label>
                  <Select onValueChange={(value) => setNewPatient(prev => ({ ...prev, relationship: value }))}>
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
                  <Input 
                    placeholder="(11) 99999-9999" 
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={newPatient.email}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Diagnóstico/Suspeita Clínica</label>
                <Input 
                  placeholder="Ex: TEA, TDAH, Síndrome de Down..." 
                  value={newPatient.diagnosis}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, diagnosis: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Unidade de Atendimento *</label>
                  <Select onValueChange={(value) => setNewPatient(prev => ({ ...prev, unit_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUnit && <SelectItem value={currentUnit.id}>{currentUnit.name}</SelectItem>}
                      {/* Add other available units if admin */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status Inicial *</label>
                  <Select onValueChange={(value) => setNewPatient(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triagem">Triagem</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreatePatient} className="flex-1">
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando pacientes...
            </div>
          ) : filteredPacientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum paciente encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPacientes.map((paciente) => (
                <div key={paciente.id} className="p-4 border border-medical-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {paciente.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{paciente.full_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {paciente.birth_date ? `${new Date().getFullYear() - new Date(paciente.birth_date).getFullYear()} anos` : 'N/A'} • {paciente.diagnosis}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {paciente.guardians?.full_name || 'N/A'}
                          </span>
                          <Badge className={getStatusColor(paciente.status || 'default')}>
                            {paciente.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {/* Frequência and Faltas are mock data, not directly from DB */}
                      <div className={`text-2xl font-bold ${getFrequenciaColor(95)}`}>
                        95%
                      </div>
                      <p className="text-xs text-muted-foreground">Frequência</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Contato</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {paciente.phone}
                      </p>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {paciente.guardians?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unidade</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {paciente.units?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Criado em</p>
                      <p className="font-medium">{new Date(paciente.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Próxima Consulta</p>
                      <p className="font-medium">
                        {/* This would need to be fetched from appointments */}
                        Não agendada
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Equipe Terapêutica:</p>
                    <div className="flex gap-2 flex-wrap">
                      {/* This would need to be fetched from a patient_therapists or similar table */}
                      <Badge variant="outline" className="text-xs">
                        Não atribuído
                      </Badge>
                    </div>
                  </div>

                  {/* Faltas is mock data */}
                  {false && (
                    <div className="mb-4 p-2 bg-warning/10 border border-warning/20 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <span className="font-medium">1 falta(s) no mês</span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pacientes;