import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { showSuccess } from '@/utils/notifications';

const relatorios = [
  {
    id: 1,
    titulo: "Relatório de Progresso Trimestral",
    data: "2024-07-15",
    tipo: "Progresso",
    profissional: "Dra. Ana Costa",
    status: "Novo"
  },
  {
    id: 2,
    titulo: "Plano Terapêutico Individualizado (PTI)",
    data: "2024-07-01",
    tipo: "Plano",
    profissional: "Equipe Multidisciplinar",
    status: "Visualizado"
  },
  {
    id: 3,
    titulo: "Relatório de Avaliação Fonoaudiológica",
    data: "2024-06-20",
    tipo: "Avaliação",
    profissional: "Fga. Paula Silva",
    status: "Visualizado"
  }
];

export const FamilyReports = () => {
  const handleDownload = (titulo: string) => {
    showSuccess("Download iniciado", `O relatório "${titulo}" será baixado.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatórios e Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatorios.map((relatorio) => (
            <div key={relatorio.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{relatorio.titulo}</h4>
                    {relatorio.status === 'Novo' && (
                      <Badge className="bg-success text-success-foreground">Novo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {relatorio.profissional} • {new Date(relatorio.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={() => handleDownload(relatorio.titulo)}
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};