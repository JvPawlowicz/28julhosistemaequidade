import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { Tables } from "@/integrations/supabase/types";
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Appointment = Tables<'appointments'> & {
  patients?: Pick<Tables<'patients'>, 'full_name' | 'phone'> | null;
  profiles?: Pick<Tables<'profiles'>, 'full_name'> | null;
  rooms?: Pick<Tables<'rooms'>, 'name'> | null;
};

interface AgendaWeekViewProps {
  appointments: Appointment[];
  currentDate: Date;
  getStatusColor: (status: string) => string;
  getSpecialtyColor: (specialty: string) => string;
}

export const AgendaWeekView: React.FC<AgendaWeekViewProps> = ({
  appointments,
  currentDate,
  getStatusColor,
  getSpecialtyColor,
}) => {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday as start of week
  const daysOfWeek = Array.from({ length: 5 }).map((_, i) => addDays(startOfCurrentWeek, i)); // Monday to Friday

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30"
  ];

  const appointmentsByDayAndTime: { [key: string]: { [key: string]: Appointment | undefined } } = {};
  daysOfWeek.forEach(day => {
    const dayKey = format(day, 'yyyy-MM-dd');
    appointmentsByDayAndTime[dayKey] = {};
    appointments.forEach(apt => {
      if (format(new Date(apt.appointment_date), 'yyyy-MM-dd') === dayKey) {
        appointmentsByDayAndTime[dayKey][apt.start_time] = apt;
      }
    });
  });

  const hasAppointmentsInWeek = appointments.some(apt => {
    const aptDate = new Date(apt.appointment_date);
    return aptDate >= startOfCurrentWeek && aptDate <= addDays(startOfCurrentWeek, 4);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Semanal - {format(startOfCurrentWeek, 'dd/MM', { locale: ptBR })} a {format(addDays(startOfCurrentWeek, 4), 'dd/MM', { locale: ptBR })}</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAppointmentsInWeek ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum agendamento"
            description="Não há agendamentos para a semana selecionada."
          />
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {/* Time column */}
            <div className="space-y-2">
              <div className="h-12 flex items-center justify-center font-medium text-sm">
                Horário
              </div>
              {timeSlots.map((time) => (
                <div key={time} className="h-16 flex items-center justify-center text-sm text-muted-foreground">
                  {time}
                </div>
              ))}
            </div>
            
            {/* Days columns */}
            {daysOfWeek.map((day) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              return (
                <div key={dayKey} className="space-y-2">
                  <div className="h-12 flex items-center justify-center bg-medical-gray rounded-lg">
                    <div className="text-center">
                      <div className="font-medium">{format(day, 'EEE', { locale: ptBR })}</div>
                      <div className="text-sm text-muted-foreground">{format(day, 'dd/MM', { locale: ptBR })}</div>
                    </div>
                  </div>
                  
                  {timeSlots.map((time) => {
                    const appointment = appointmentsByDayAndTime[dayKey]?.[time];
                    
                    return (
                      <div key={time} className="h-16 border border-medical-border rounded relative">
                        {appointment && (
                          <div className={`absolute inset-1 p-1 rounded text-xs ${getSpecialtyColor(appointment.specialty)} bg-white`}>
                            <div className="font-medium truncate">{appointment.patients?.full_name}</div>
                            <div className="text-muted-foreground truncate">{appointment.profiles?.full_name}</div>
                            <Badge className={`${getStatusColor(appointment.status || 'agendado')} mt-1`}>
                              {appointment.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};