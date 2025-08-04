import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save, Send, X } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import type { Evolution } from "@/types/Evolution";

interface NewEvolutionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patients: Array<{ id: string; full_name: string }>;
  realizedAppointments: Array<{ id: string; patient_id: string; appointment_date: string; status: string }>;
  currentUserRequiresSupervision: boolean;
  formData: {
    patient_id: string;
    appointment_id: string;
    inappropriate_behavior: boolean;
    behavior_description: string;
    session_report: string;
    linked_pti_objectives: string[];
    attachments: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<NewEvolutionDialogProps['formData']>>;
  onCreateEvolution: (isDraft: boolean) => Promise<void>;
}

export const NewEvolutionDialog: React.FC<NewEvolutionDialogProps> = ({
  isOpen,
  onOpenChange,
  patients,
  realizedAppointments,
  currentUserRequiresSupervision,
  formData,
  setFormData,
  onCreateEvolution,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Evolução Clínica</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Paciente *</Label>
              <Select value={formData.patient_id} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, patient_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Agendamento Realizado *</Label>
              <Select value={formData.appointment_id} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, appointment_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o agendamento" />
                </SelectTrigger>
                <SelectContent>
                  {realizedAppointments
                    .filter(apt => apt.patient_id === formData.patient_id)
                    .map(appointment => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.inappropriate_behavior}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, inappropriate_behavior: !!checked }))
              }
            />
            <Label>Comportamento inadequado foi observado?</Label>
          </div>
          
          {formData.inappropriate_behavior && (
            <div>
              <Label>Descrição do comportamento inadequado *</Label>
              <Textarea
                value={formData.behavior_description}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  behavior_description: e.target.value 
                }))}
                placeholder="Descreva detalhadamente o comportamento inadequado observado..."
                rows={3}
              />
            </div>
          )}
          
          <div>
            <Label>Breve relatório da sessão *</Label>
            <Textarea
              value={formData.session_report}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                session_report: e.target.value 
              }))}
              placeholder="Descreva as atividades realizadas, comportamento do paciente, estratégias utilizadas e observações relevantes..."
              rows={5}
            />
          </div>
          
          <div>
            <Label>Anexos</Label>
            <FileUpload
              onFilesUploaded={(urls) => setFormData(prev => ({ 
                ...prev, 
                attachments: [...prev.attachments, ...urls] 
              }))}
              maxFiles={5}
              maxSize={10}
              bucketName="patient-documents"
              folderPath="evolutions"
            />
            {formData.attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Arquivos anexados:</p>
                {formData.attachments.map((url, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                    <span className="truncate">{url.split('/').pop()}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter((_, i) => i !== index)
                      }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onCreateEvolution(true)}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar como Rascunho
            </Button>
            <Button 
              onClick={() => onCreateEvolution(false)}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {currentUserRequiresSupervision ? 'Enviar para Supervisão' : 'Assinar e Finalizar'}
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