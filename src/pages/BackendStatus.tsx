import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

const BackendStatus = () => {
  const [status, setStatus] = useState<'ok' | 'error' | 'loading'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Testa uma query simples no Supabase
    supabase
      .from('profiles') // Corrigido para tabela existente
      .select('id')
      .limit(1)
      .then(({ error }) => {
        if (error) {
          setStatus('error');
          setError(error.message);
        } else {
          setStatus('ok');
        }
      }, (err) => {
        setStatus('error');
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Status do Backend (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && <p>Testando conexão com o backend...</p>}
          {status === 'ok' && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span>Conexão com o backend OK!</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col gap-2 text-destructive">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Erro ao conectar ao backend!</span>
              </div>
              <pre className="bg-destructive/10 p-2 rounded text-xs overflow-x-auto">{error}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendStatus;
