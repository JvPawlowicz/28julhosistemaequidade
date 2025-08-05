import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Users } from "lucide-react";
import UnitDataIndicator from "@/components/UnitDataIndicator";
import { ImportPatientModal } from "@/components/ImportPatientModal";
import WaitingListModal from "@/components/WaitingListModal";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { usePermissions } from "@/contexts/usePermissions";
import { showSuccess, showError } from '@/utils/notifications';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/EmptyState";

import { PatientStatsCards } from "@/components/patients/PatientStatsCards";
import { PatientSearchAndFilter } from "@/components/patients/PatientSearchAndFilter";
import { PatientListItem } from "@/components/patients/PatientListItem";
import { NewPatientDialog } from "@/components/patients/NewPatientDialog";

type Patient = Tables<'patients'> & {
  guardians?: Pick<Tables<'guardians'>, 'full_name' | 'email' | 'phone'> | null;
  units?: Pick<Tables<'units'>, 'name'> | null;
};

const Pacientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUnit, availableUnits } = useMultiTenant();
  const { hasPermission, isAdmin } = usePermissions();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatientData, setNewPatientData] = useState({
    full_name: "",
    birth_date: "",
    primary_guardian_name: "",
    guardian_cpf: "",
    guardian_birth_date: "",
    relationship: "",
    phone: "",
    email: "",
    diagnosis: "",
    unit_id: "",
    status: ""
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
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      showError("Erro ao carregar pacientes", "Não foi possível carregar os dados dos pacientes.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentUnit]);

  useEffect(() => {
    if (hasPermission('pacientes', 'view')) {
      fetchPatients();
    }
  }, [fetchPatients, hasPermission]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.guardians?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: patients.length,
    displayed: filteredPatients.length,
    ativos: filteredPatients.filter(p => p.status === 'ativo').length,
    triagem: filteredPatients.filter(p => p.status === 'triagem').length,
    pausados: filteredPatients.filter(p => p.status === 'pausado').length
  };

  const handleCreatePatient = async () => {
    if (!newPatientData.full_name || !newPatientData.birth_date || !newPatientData.primary_guardian_name || !newPatientData.phone || !newPatientData.unit_id || !newPatientData.status || !newPatientData.guardian_cpf || !newPatientData.guardian_birth_date) {
      showError("Campos obrigatórios", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const { data: guardianData, error: guardianError } = await supabase
        .from('guardians')
        .insert({
          full_name: newPatientData.primary_guardian_name,
          birth_date: newPatientData.guardian_birth_date,
          cpf: newPatientData.guardian_cpf.replace(/\D/g, ''),
          phone: newPatientData.phone,
          email: newPatientData.email,
          relationship: newPatientData.relationship,
        })
        .select()
        .single();

      if (guardianError) throw guardianError;

      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert({
          full_name: newPatientData.full_name,
          birth_date: newPatientData.birth_date,
          phone: newPatientData.phone,
          diagnosis: newPatientData.diagnosis,
          unit_id: newPatientData.unit_id,
          status: newPatientData.status, 
          primary_guardian_id: guardianData.id,
        })
        .select(`
          *,
          guardians(full_name, email, phone),
          units(name)
        `)
        .single();

      if (patientError) throw patientError;

      setPatients(prev => [...prev, patientData]);
      setNewPatientData({
        full_name: "", birth_date: "", primary_guardian_name: "", guardian_cpf: "", guardian_birth_date: "", relationship: "",
        phone: "", email: "", diagnosis: "", unit_id: "", status: ""
      });
      setIsNewPatientDialogOpen(false);
      
      showSuccess("Paciente cadastrado", `${patientData.full_name} foi adicionado com sucesso.`);
    } catch (error) {
      console.error('Error creating patient:', error);
      showError("Erro ao cadastrar paciente", "Não foi possível cadastrar o paciente.");
    }
  };

  const handleViewProfile = (patientId: string) => {
    navigate(`/app/pacientes/${patientId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Pacientes</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie pacientes e seus prontuários
          </p>
        </div>

        <div className="flex gap-3">
          <Button className="gap-2" onClick={() => setIsNewPatientDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Paciente
          </Button>
          <ImportPatientModal onImportComplete={() => showSuccess("Pacientes importados com sucesso!")} />
          <WaitingListModal />
        </div>
      </div>

      <NewPatientDialog
        isOpen={isNewPatientDialogOpen}
        onOpenChange={setIsNewPatientDialogOpen}
        newPatient={newPatientData}
        setNewPatient={setNewPatientData}
        onCreatePatient={handleCreatePatient}
        availableUnits={availableUnits}
        isAdmin={isAdmin()}
      />

      <UnitDataIndicator />
      <PatientStatsCards stats={stats} isAdmin={isAdmin()} />
      <PatientSearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando pacientes...
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum paciente encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <PatientListItem
                  key={patient.id}
                  patient={patient}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pacientes;