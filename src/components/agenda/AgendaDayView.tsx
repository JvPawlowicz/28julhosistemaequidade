import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<'appointments'> & {
  patients?: Pick<Tables<'patients'>, 'full_name' | 'phone'> | null;
  profiles?: Pick<Tables<'profiles'>, 'full_name'> | null;
  rooms?: Pick<Tables<'rooms'>, 'name'> | null;
};

interface AgendaDayViewProps {
  appointments: Appointment[];
  currentDate: Date;
  getStatusColor: (status: string) => string;
  getSpecialtyColor: (specialty: string) => string;
}

export const AgendaDayView: React.FC<AgendaDayViewProps> = ({
  appointments,
  currentDate,
  getStatusColor,
  getSpecialtyColor,
}) => {
  const formattedDate = currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const appointmentsForDay = appointments.filter(apt => 
    new Date(apt.appointment_date).toDateString() === currentDate.toDateString()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Hoje - {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointmentsForDay.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum agendamento"
            description="Não há agendamentos para o dia selecionado."
          />
        ) : (
          <div className="space-y-3">
            {appointmentsForDay.map((appointment) => (
              <div key={appointment.id} className={`p-4 rounded-lg bg-medical-gray ${getSpecialtyColor(appointment.specialty)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono text-primary">
                      {appointment.start_time} - {appointment.end_time}
                    </div>
                    <Badge className={getStatusColor(appointment.status || 'agendado')}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <Badge variant="outline">{appointment.specialty}</Badge>
                </div>
                
                <h4 className="font-medium mb-1">{appointment.patients?.full_name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {appointment.profiles?.full_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {appointment.rooms?.name}
                  </span>
                  <span>Individual</span> {/* Assuming type is individual for now */}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};