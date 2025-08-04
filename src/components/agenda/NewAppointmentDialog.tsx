import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface NewAppointmentData {
  patient_id: string;
  therapist_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  specialty: string;
  room_id: string;
  notes: string;
}

interface NewAppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentCreated: () => void;
  patients: Array<Pick<Tables<'patients'>, 'id' | 'full_name'>>;
  therapists: Array<Pick<Tables<'profiles'>, 'id' | 'full_name' | 'council_type'>>;
  rooms: Array<Pick<Tables<'rooms'>, 'id' | 'name'>>;
  currentUnitId: string | null;
}

export const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  isOpen,
  onOpenChange,
  onAppointmentCreated,
  patients,
  therapists,
  rooms,
  currentUnitId,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<NewAppointmentData>({
    patient_id: '',
    therapist_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    specialty: '',
    room_id: '',
    notes: '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof NewAppointmentData, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'therapist_id') {
      const selectedTherapist = therapists.find(t => t.id === value);
      if (selectedTherapist?.council_type) {
        setFormData(prev => ({ ...prev, specialty: selectedTherapist.council_type }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.patient_id || !formData.therapist_id || !formData.appointment_date || !formData.start_time || !formData.end_time || !formData.specialty || !formData.room_id || !currentUnitId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: formData.patient_id,
          therapist_id: formData.therapist_id,
          appointment_date: formData.appointment_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          specialty: formData.specialty as Tables<'appointments'>['specialty'],
          room_id: formData.room_id,
          notes: formData.notes,
          unit_id: currentUnitId,
          status: 'agendado',
        });

      if (error) throw error;

      toast({
        title: "Agendamento criado",
        description: "O novo agendamento foi salvo com sucesso.",
      });
      onAppointmentCreated();
      onOpenChange(false);
      setFormData({
        patient_id: '',
        therapist_id: '',
        appointment_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        specialty: '',
        room_id: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="patient_id">Paciente *</Label>
            <Select value={formData.patient_id} onValueChange={(value) => handleSelectChange('patient_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>{patient.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="therapist_id">Profissional *</Label>
            <Select value={formData.therapist_id} onValueChange={(value) => handleSelectChange('therapist_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {therapists.map(therapist => (
                  <SelectItem key={therapist.id} value={therapist.id}>{therapist.full_name} ({therapist.council_type})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointment_date">Data *</Label>
              <Input id="appointment_date" type="date" value={formData.appointment_date} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="specialty">Especialidade *</Label>
              <Input id="specialty" value={formData.specialty} onChange={handleInputChange} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Hora Início *</Label>
              <Input id="start_time" type="time" value={formData.start_time} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="end_time">Hora Fim *</Label>
              <Input id="end_time" type="time" value={formData.end_time} onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="room_id">Sala *</Label>
            <Select value={formData.room_id} onValueChange={(value) => handleSelectChange('room_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Input id="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notas sobre o agendamento" />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Agendando...' : 'Agendar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};