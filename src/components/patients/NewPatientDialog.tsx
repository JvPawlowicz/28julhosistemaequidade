import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import type { Unit } from "@/contexts/MultiTenantContext";
import { Tables } from "@/integrations/supabase/types";
import { showSuccess, showError } from '@/utils/notifications';

interface NewPatientData {
  full_name: string;
  birth_date: string;
  primary_guardian_name: string;
  guardian_cpf: string;
  guardian_birth_date: string;
  relationship: string;
  phone: string;
  email: string;
  diagnosis: string;
  unit_id: string;
  status: string;
}

interface NewPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPatient: NewPatientData;
  setNewPatient: React.Dispatch<React.SetStateAction<NewPatientData>>;
  onCreatePatient: () => void;
  availableUnits: Unit[];
  isAdmin: boolean;
}

export const NewPatientDialog: React.FC<NewPatientDialogProps> = ({
  isOpen,
  onOpenChange,
  newPatient,
  setNewPatient,
  onCreatePatient,
  availableUnits,
  isAdmin,
}) => {
  const { currentUnit } = useMultiTenant();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <label className="text-sm font-medium">CPF do Responsável *</label>
              <Input 
                placeholder="000.000.000-00" 
                value={newPatient.guardian_cpf}
                onChange={(e) => setNewPatient(prev => ({ ...prev, guardian_cpf: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Data de Nasc. do Responsável *</label>
              <Input 
                type="date" 
                value={newPatient.guardian_birth_date}
                onChange={(e) => setNewPatient(prev => ({ ...prev, guardian_birth_date: e.target.value }))}
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
                  {isAdmin ? (
                    availableUnits.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))
                  ) : (
                    currentUnit && <SelectItem value={currentUnit.id}>{currentUnit.name}</SelectItem>
                  )}
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
            <Button onClick={onCreatePatient} className="flex-1">
              Cadastrar Paciente
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};