import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Calendar,
  Target,
  TrendingUp,
  Upload,
  Download,
  Edit,
  Save,
  Clock,
  User,
  Heart,
  ClipboardList,
  Shield,
  AlertCircle,
  Calculator
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/usePermissions";
import { AssessmentProtocols } from "./AssessmentProtocols";
import type { Evolution } from "@/types/Evolution";

// Helper para buscar nome do profissional
function getProfessionalName(professional_id: string) {
  return professional_id;
}

// Exemplo de evoluções
const evolucoes: Evolution[] = [
  {
    id: "1",
    appointment_id: "apt-1",
    attachments: [],
    content: {},
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    patient_id: "p1",
    professional_id: "prof-1",
    signed_at: "2024-01-15T00:00:00Z",
    status: "Finalizada",
    supervisors_signature: "Dr. Supervisor"
  }
];

// Renderização básica
const MedicalRecordTabs = () => {
  return (
    <div>
      {evolucoes.map((evolucao) => (
        <div key={evolucao.id}>
          <p>Profissional: {getProfessionalName(evolucao.professional_id)}</p>
          <p>Status: {evolucao.status}</p>
          <p>Assinatura do supervisor: {evolucao.supervisors_signature}</p>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecordTabs;