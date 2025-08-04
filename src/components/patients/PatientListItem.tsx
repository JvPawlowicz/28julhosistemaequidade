import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<'patients'> & {
  guardians?: Pick<Tables<'guardians'>, 'full_name' | 'email' | 'phone'> | null;
  units?: Pick<Tables<'units'>, 'name'> | null;
};

interface PatientListItemProps {
  patient: Patient;
  onViewProfile: (patientId: string) => void;
}

export const PatientListItem: React.FC<PatientListItemProps> = ({ patient, onViewProfile }) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'ativo': return 'bg-success text-success-foreground';
      case 'triagem': return 'bg-warning text-warning-foreground';
      case 'pausado': return 'bg-destructive text-destructive-foreground';
      case 'alta': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 border border-medical-border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {patient.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h4 className="font-semibold text-lg">{patient.full_name}</h4>
            <p className="text-sm text-muted-foreground">
              {patient.birth_date ? `${new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} anos` : 'N/A'} • {patient.diagnosis}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {patient.guardians?.full_name || 'N/A'}
              </span>
              <Badge className={getStatusColor(patient.status)}>
                {patient.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">
            N/A
          </div>
          <p className="text-xs text-muted-foreground">Frequência</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground">Contato</p>
          <p className="font-medium flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {patient.phone}
          </p>
          <p className="font-medium flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {patient.guardians?.email || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Unidade</p>
          <p className="font-medium flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {patient.units?.name || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Criado em</p>
          <p className="font-medium">{new Date(patient.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Próxima Consulta</p>
          <p className="font-medium">
            N/A
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Equipe Terapêutica:</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            Não atribuído
          </Badge>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          size="sm" 
          variant="default" 
          className="gap-1"
          onClick={() => onViewProfile(patient.id)}
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
  );
};