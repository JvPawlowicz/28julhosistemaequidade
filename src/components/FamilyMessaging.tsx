import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { showSuccess } from '@/utils/notifications';

const mensagensIniciais = [
  {
    id: 1,
    autor: "Dra. Ana Costa",
    texto: "Olá, família! A sessão de hoje foi muito produtiva. João conseguiu focar nas atividades propostas por mais tempo. Vamos continuar trabalhando nisso!",
    timestamp: "2024-07-25T15:30:00Z",
    remetente: "clinica"
  },
  {
    id: 2,
    autor: "Você",
    texto: "Que ótima notícia, Dra. Ana! Agradecemos pelo retorno. Notamos ele mais calmo em casa também.",
    timestamp: "2024-07-25T16:00:00Z",
    remetente: "familia"
  }
];

export const FamilyMessaging = () => {
  const [mensagens, setMensagens] = useState(mensagensIniciais);
  const [novaMensagem, setNovaMensagem] = useState("");

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const mensagem = {
      id: mensagens.length + 1,
      autor: "Você",
      texto: novaMensagem,
      timestamp: new Date().toISOString(),
      remetente: "familia"
    };

    setMensagens([...mensagens, mensagem]);
    setNovaMensagem("");
    showSuccess("Mensagem enviada com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comunicação com a Equipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 max-h-72 overflow-y-auto p-2">
          {mensagens.map((mensagem) => (
            <div 
              key={mensagem.id} 
              className={`flex items-end gap-3 ${mensagem.remetente === 'familia' ? 'justify-end' : ''}`}
            >
              {mensagem.remetente === 'clinica' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{mensagem.autor.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-xs p-3 rounded-lg ${
                  mensagem.remetente === 'familia' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{mensagem.texto}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(mensagem.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Textarea
            placeholder="Digite sua mensagem para a equipe..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            rows={2}
          />
          <Button onClick={handleEnviarMensagem} className="self-end">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};