import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  ClipboardList,
  Shield
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import MedicalRecordTabs from "@/components/MedicalRecordTabs";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/contexts/usePermissions";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/EmptyState";

type Patient = Tables<'patients'> & {
  guardians?: Tables<'guardians'>;
  units?: Tables<'units'>;
};

const Prontuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<Patient | null>(null);
  const [isEvolucaoOpen, setIsEvolucaoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { hasPermission, isAdmin } = usePermissions();
  const { currentUnit } = useMultiTenant();

  const [pacientes, setPacientes] = useState<Patient[]>([]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('patients')
        .select(`
          *,
          guardians(full_name),
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
    if (hasPermission('prontuarios', 'view')) {
      fetchPatients();
    }
  }, [fetchPatients, hasPermission]);

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.guardians?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPaciente = (paciente: Patient) => {
    setSelectedPaciente(paciente);
  };

  const handleNovaEvolucao = () => {
    toast({
      title: "Evolução registrada",
      description: "Nova evolução clínica foi salva com sucesso."
    });
    setIsEvolucaoOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  if (!hasPermission('prontuarios', 'view')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar prontuários.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Pacientes ({filteredPacientes.length})
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
            
            {filteredPacientes.length === 0 ? (
              <EmptyState
                icon={User}
                title="Nenhum paciente"
                description="Nenhum paciente encontrado com este filtro."
                className="p-4"
              />
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
                    <h4 className="font-medium text-sm">{paciente.full_name}</h4>
                    <p className="text-xs opacity-90">{paciente.birth_date ? `${new Date().getFullYear() - new Date(paciente.birth_date).getFullYear()} anos` : 'N/A'}</p>
                    <p className="text-xs opacity-75 truncate">{paciente.diagnosis || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
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
                        {selectedPaciente.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      {selectedPaciente.full_name}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {selectedPaciente.birth_date ? `${new Date().getFullYear() - new Date(selectedPaciente.birth_date).getFullYear()} anos` : 'N/A'} • {selectedPaciente.diagnosis || 'N/A'}
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
                <MedicalRecordTabs patientId={selectedPaciente.id} />
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