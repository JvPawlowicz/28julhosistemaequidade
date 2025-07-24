import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EvolutionAdendumProps {
  evolutionId: string;
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EvolutionAdendum = ({ evolutionId, patientName, isOpen, onClose, onSuccess }: EvolutionAdendumProps) => {
  const [adendumContent, setAdendumContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdendum = async () => {
    if (!adendumContent.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo do adendo é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar a evolução original
      const { data: originalEvolution, error: fetchError } = await supabase
        .from('evolutions')
        .select('*')
        .eq('id', evolutionId)
        .single();

      if (fetchError) throw fetchError;

      // Criar novo registro de adendo
      const { error: insertError } = await supabase
        .from('evolutions')
        .insert({
          patient_id: originalEvolution.patient_id,
          professional_id: user.id,
          appointment_id: originalEvolution.appointment_id,
          status: 'Finalizada',
          content: {
            session_report: adendumContent,
            is_adendum: true,
            original_evolution_id: evolutionId
          },
          signed_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: "Adendo criado e assinado com sucesso",
      });

      setAdendumContent('');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating adendum:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar adendo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Adendo - {patientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Adendo
              </Badge>
            </div>
            <p className="text-sm text-blue-700">
              Este adendo será anexado à evolução original como um registro adicional. 
              Uma vez criado, não poderá ser editado.
            </p>
          </div>
          
          <div>
            <Label>Conteúdo do Adendo *</Label>
            <Textarea
              value={adendumContent}
              onChange={(e) => setAdendumContent(e.target.value)}
              placeholder="Descreva as informações adicionais, correções ou observações complementares..."
              rows={6}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 1000 caracteres
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleCreateAdendum}
              disabled={loading || !adendumContent.trim()}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Criando...' : 'Criar e Assinar Adendo'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvolutionAdendum;