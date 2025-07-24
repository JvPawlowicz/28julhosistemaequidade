import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus,
  Timer,
  Hash,
  Percent,
  Save,
  Wifi,
  WifiOff,
  BarChart3
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DataPoint {
  id: string;
  behavior: string;
  value: number;
  unit: string;
  timestamp: string;
  notes?: string;
  synced: boolean;
}

interface Session {
  id: string;
  patient_name: string;
  start_time: string;
  duration: number;
  data_points: DataPoint[];
}

const RealtimeDataCollection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [targetBehavior, setTargetBehavior] = useState('');
  const [dataType, setDataType] = useState<'frequency' | 'duration' | 'percentage'>('frequency');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    fetchPatients();
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const startSession = () => {
    if (!selectedPatient || !targetBehavior) {
      toast({
        title: "Erro",
        description: "Selecione um paciente e defina o comportamento alvo",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find((p: any) => p.id === selectedPatient);
    const session: Session = {
      id: Date.now().toString(),
      patient_name: patient?.full_name || 'Paciente',
      start_time: new Date().toISOString(),
      duration: 0,
      data_points: []
    };

    setCurrentSession(session);
    setTimer(0);
    setIsTimerRunning(true);
    setDataPoints([]);
    
    toast({
      title: "Sessão iniciada",
      description: `Coletando dados para ${session.patient_name}`,
    });
  };

  const recordData = (value: number) => {
    if (!currentSession) return;

    const dataPoint: DataPoint = {
      id: Date.now().toString(),
      behavior: targetBehavior,
      value: value,
      unit: dataType === 'frequency' ? 'count' : dataType === 'duration' ? 'seconds' : 'percentage',
      timestamp: new Date().toISOString(),
      synced: false
    };

    setDataPoints(prev => [...prev, dataPoint]);
    
    // Tentar sincronizar imediatamente se online
    if (isOnline) {
      syncDataPoint(dataPoint);
    }
  };

  const syncDataPoint = async (dataPoint: DataPoint) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('realtime_data_collection')
        .insert({
          patient_id: selectedPatient,
          therapist_id: user.id,
          session_id: currentSession?.id,
          data_type: dataType,
          target_behavior: dataPoint.behavior,
          recorded_value: dataPoint.value,
          unit: dataPoint.unit,
          timestamp: dataPoint.timestamp,
          notes: sessionNotes,
          is_synced: true
        });

      if (error) throw error;

      // Marcar como sincronizado
      setDataPoints(prev => 
        prev.map(dp => 
          dp.id === dataPoint.id ? { ...dp, synced: true } : dp
        )
      );
    } catch (error) {
      console.error('Error syncing data point:', error);
    }
  };

  const endSession = () => {
    setIsTimerRunning(false);
    setCurrentSession(null);
    setDataPoints([]);
    setTimer(0);
    
    toast({
      title: "Sessão finalizada",
      description: "Dados salvos com sucesso",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalCount = () => {
    return dataPoints.reduce((sum, dp) => sum + dp.value, 0);
  };

  const getUnsyncedCount = () => {
    return dataPoints.filter(dp => !dp.synced).length;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {/* Header Mobile */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Coleta em Tempo Real</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}
          {getUnsyncedCount() > 0 && (
            <Badge variant="outline" className="text-xs">
              {getUnsyncedCount()} não sincronizados
            </Badge>
          )}
        </div>
      </div>

      {!currentSession ? (
        /* Configuração da Sessão */
        <Card>
          <CardHeader>
            <CardTitle>Nova Sessão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Paciente</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Selecione o paciente</option>
                {patients.map((patient: any) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label>Comportamento Alvo</Label>
              <Input
                value={targetBehavior}
                onChange={(e) => setTargetBehavior(e.target.value)}
                placeholder="Ex: Contato visual, Ecolalia, Estereotipia..."
              />
            </div>
            
            <div>
              <Label>Tipo de Dado</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={dataType === 'frequency' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDataType('frequency')}
                  className="text-xs"
                >
                  <Hash className="h-3 w-3 mr-1" />
                  Frequência
                </Button>
                <Button
                  variant={dataType === 'duration' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDataType('duration')}
                  className="text-xs"
                >
                  <Timer className="h-3 w-3 mr-1" />
                  Duração
                </Button>
                <Button
                  variant={dataType === 'percentage' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDataType('percentage')}
                  className="text-xs"
                >
                  <Percent className="h-3 w-3 mr-1" />
                  Percentual
                </Button>
              </div>
            </div>
            
            <Button onClick={startSession} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Sessão
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Interface de Coleta */
        <div className="space-y-4">
          {/* Timer e Status */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-mono font-bold text-primary mb-2">
                {formatTime(timer)}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentSession.patient_name} • {targetBehavior}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <Button
                  variant={isTimerRunning ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimer(0)}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Coleta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Total: {getTotalCount()} {dataType === 'frequency' ? 'ocorrências' : 
                         dataType === 'duration' ? 'segundos' : '%'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataType === 'frequency' && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="h-20 text-xl"
                    onClick={() => recordData(1)}
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    +1
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-20 text-xl"
                    onClick={() => recordData(-1)}
                    disabled={getTotalCount() <= 0}
                  >
                    <Minus className="h-6 w-6 mr-2" />
                    -1
                  </Button>
                </div>
              )}
              
              {dataType === 'duration' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Button onClick={() => recordData(5)}>+5s</Button>
                    <Button onClick={() => recordData(10)}>+10s</Button>
                    <Button onClick={() => recordData(30)}>+30s</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => recordData(60)}>+1min</Button>
                    <Button onClick={() => recordData(300)}>+5min</Button>
                  </div>
                </div>
              )}
              
              {dataType === 'percentage' && (
                <div className="grid grid-cols-4 gap-2">
                  <Button onClick={() => recordData(25)}>25%</Button>
                  <Button onClick={() => recordData(50)}>50%</Button>
                  <Button onClick={() => recordData(75)}>75%</Button>
                  <Button onClick={() => recordData(100)}>100%</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notas Rápidas */}
          <Card>
            <CardContent className="p-4">
              <Label>Notas da Sessão</Label>
              <Textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Observações rápidas..."
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Histórico da Sessão */}
          {dataPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Últimos Registros</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {dataPoints.slice(-5).reverse().map((dp) => (
                    <div key={dp.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                      <span>{dp.value} {dp.unit}</span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(dp.timestamp).toLocaleTimeString()}</span>
                        {dp.synced ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        ) : (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Finalizar Sessão */}
          <Button 
            onClick={endSession} 
            variant="destructive" 
            className="w-full"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Finalizar Sessão
          </Button>
        </div>
      )}
    </div>
  );
};

export default RealtimeDataCollection;