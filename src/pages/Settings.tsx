import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon,
  Building,
  Users,
  Stethoscope,
  CreditCard,
  FileText,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  Shield
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/usePermissions";

const Settings = () => {
  const { hasPermission, getUserRole } = usePermissions();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");

  // Mock data
  const [unidades, setUnidades] = useState([
    {
      id: 1,
      nome: "Unidade Centro",
      endereco: "Rua das Flores, 123 - Centro",
      telefone: "(11) 3333-4444",
      responsavel: "Dr. João Silva",
      ativa: true,
      salas: 8,
      capacidade: 120
    },
    {
      id: 2,
      nome: "Unidade Norte",
      endereco: "Av. Norte, 456 - Vila Norte",
      telefone: "(11) 3333-5555",
      responsavel: "Dra. Ana Costa",
      ativa: true,
      salas: 6,
      capacidade: 80
    }
  ]);

  const [servicos, setServicos] = useState([
    {
      id: 1,
      nome: "Psicologia Individual",
      categoria: "Psicologia",
      duracao: 50,
      valor: 120.00,
      ativo: true
    },
    {
      id: 2,
      nome: "Terapia Ocupacional",
      categoria: "Terapia Ocupacional",
      duracao: 45,
      valor: 100.00,
      ativo: true
    },
    {
      id: 3,
      nome: "Fonoaudiologia",
      categoria: "Fonoaudiologia",
      duracao: 45,
      valor: 110.00,
      ativo: true
    }
  ]);

  const [convenios, setConvenios] = useState([
    {
      id: 1,
      nome: "Unimed",
      contrato: "12345678",
      valorSessao: 85.00,
      ativo: true,
      especialidades: ["Psicologia", "TO", "Fono"]
    },
    {
      id: 2,
      nome: "Bradesco Saúde",
      contrato: "87654321",
      valorSessao: 90.00,
      ativo: true,
      especialidades: ["Psicologia", "TO"]
    }
  ]);

  const [salas, setSalas] = useState([
    {
      id: 1,
      nome: "Sala 1",
      unidade: "Centro",
      tipo: "Individual",
      equipamentos: ["Mesa", "Cadeiras", "Armário"],
      ativa: true
    },
    {
      id: 2,
      nome: "Sala Grande",
      unidade: "Centro",
      tipo: "Grupo",
      equipamentos: ["Tapete", "Brinquedos", "TV"],
      ativa: true
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      nome: "Evolução Psicologia",
      categoria: "Evolução",
      campos: ["Humor", "Comportamento", "Interação", "Objetivos"],
      ativo: true
    },
    {
      id: 2,
      nome: "Avaliação Inicial TO",
      categoria: "Avaliação",
      campos: ["Coordenação", "Força", "Sensibilidade", "AVD"],
      ativo: true
    }
  ]);

  const openDialog = (type: string) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso."
    });
    setIsDialogOpen(false);
  };

  if (!hasPermission('settings', 'manage')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar as configurações do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Gerencie unidades, serviços, convênios e recursos da clínica
        </p>
      </div>

      <Tabs defaultValue="unidades" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="convenios">Convênios</TabsTrigger>
          <TabsTrigger value="salas">Salas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        {/* Unidades */}
        <TabsContent value="unidades" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Gestão de Unidades
                </CardTitle>
                <Button onClick={() => openDialog('unidade')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Unidade
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unidades.map((unidade) => (
                  <div key={unidade.id} className="p-4 border border-medical-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {unidade.nome}
                          <Badge className={unidade.ativa ? 'bg-success' : 'bg-destructive'}>
                            {unidade.ativa ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {unidade.endereco}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Responsável</p>
                        <p className="font-medium">{unidade.responsavel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Telefone</p>
                        <p className="font-medium">{unidade.telefone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Salas</p>
                        <p className="font-medium">{unidade.salas}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Capacidade</p>
                        <p className="font-medium">{unidade.capacidade} pac/mês</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Serviços */}
        <TabsContent value="servicos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Serviços Oferecidos
                </CardTitle>
                <Button onClick={() => openDialog('servico')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Serviço
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicos.map((servico) => (
                  <div key={servico.id} className="p-4 border border-medical-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {servico.nome}
                          <Badge variant="outline">{servico.categoria}</Badge>
                          <Badge className={servico.ativo ? 'bg-success' : 'bg-destructive'}>
                            {servico.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duração</p>
                        <p className="font-medium">{servico.duracao} minutos</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valor Particular</p>
                        <p className="font-medium">R$ {servico.valor.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className={`font-medium ${servico.ativo ? 'text-success' : 'text-destructive'}`}>
                          {servico.ativo ? 'Disponível' : 'Suspenso'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Convênios */}
        <TabsContent value="convenios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Convênios Aceitos
                </CardTitle>
                <Button onClick={() => openDialog('convenio')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Convênio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {convenios.map((convenio) => (
                  <div key={convenio.id} className="p-4 border border-medical-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {convenio.nome}
                          <Badge className={convenio.ativo ? 'bg-success' : 'bg-destructive'}>
                            {convenio.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Contrato: {convenio.contrato}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Valor por Sessão</p>
                        <p className="font-medium">R$ {convenio.valorSessao.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Especialidades</p>
                        <div className="flex gap-1 flex-wrap">
                          {convenio.especialidades.map((esp, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className={`font-medium ${convenio.ativo ? 'text-success' : 'text-destructive'}`}>
                          {convenio.ativo ? 'Aceito' : 'Suspenso'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salas */}
        <TabsContent value="salas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Recursos e Salas
                </CardTitle>
                <Button onClick={() => openDialog('sala')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Sala
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salas.map((sala) => (
                  <div key={sala.id} className="p-4 border border-medical-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {sala.nome}
                          <Badge variant="outline">{sala.tipo}</Badge>
                          <Badge className={sala.ativa ? 'bg-success' : 'bg-destructive'}>
                            {sala.ativa ? 'Disponível' : 'Indisponível'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Unidade {sala.unidade}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Equipamentos:</p>
                      <div className="flex gap-1 flex-wrap">
                        {sala.equipamentos.map((eq, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Templates de Documentos
                </CardTitle>
                <Button onClick={() => openDialog('template')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border border-medical-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {template.nome}
                          <Badge variant="outline">{template.categoria}</Badge>
                          <Badge className={template.ativo ? 'bg-success' : 'bg-destructive'}>
                            {template.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Campos do formulário:</p>
                      <div className="flex gap-1 flex-wrap">
                        {template.campos.map((campo, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {campo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Nome da Clínica</Label>
                    <Input defaultValue="Clínica Equidade+" />
                  </div>
                  <div>
                    <Label>CNPJ</Label>
                    <Input defaultValue="12.345.678/0001-90" />
                  </div>
                  <div>
                    <Label>Telefone Principal</Label>
                    <Input defaultValue="(11) 3333-4444" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Email Institucional</Label>
                    <Input defaultValue="contato@equidade.com" />
                  </div>
                  <div>
                    <Label>Site</Label>
                    <Input defaultValue="www.equidade.com" />
                  </div>
                  <div>
                    <Label>Responsável Técnico</Label>
                    <Input defaultValue="Dr. João Silva - CRP 12345" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Preferências do Sistema</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificações automáticas por email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Realizar backup diário dos dados
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo de Manutenção</Label>
                      <p className="text-sm text-muted-foreground">
                        Restringir acesso para manutenção
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para criação/edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'unidade' && 'Nova Unidade'}
              {dialogType === 'servico' && 'Novo Serviço'}
              {dialogType === 'convenio' && 'Novo Convênio'}
              {dialogType === 'sala' && 'Nova Sala'}
              {dialogType === 'template' && 'Novo Template'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {dialogType === 'unidade' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da Unidade</Label>
                    <Input placeholder="Ex: Unidade Centro" />
                  </div>
                  <div>
                    <Label>Responsável</Label>
                    <Input placeholder="Nome do responsável" />
                  </div>
                </div>
                <div>
                  <Label>Endereço Completo</Label>
                  <Input placeholder="Rua, número, bairro, cidade" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Telefone</Label>
                    <Input placeholder="(11) 9999-9999" />
                  </div>
                  <div>
                    <Label>Número de Salas</Label>
                    <Input type="number" placeholder="8" />
                  </div>
                  <div>
                    <Label>Capacidade Mensal</Label>
                    <Input type="number" placeholder="120" />
                  </div>
                </div>
              </>
            )}

            {dialogType === 'servico' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Serviço</Label>
                    <Input placeholder="Ex: Psicologia Individual" />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="psicologia">Psicologia</SelectItem>
                        <SelectItem value="to">Terapia Ocupacional</SelectItem>
                        <SelectItem value="fono">Fonoaudiologia</SelectItem>
                        <SelectItem value="fisio">Fisioterapia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duração (minutos)</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div>
                    <Label>Valor Particular (R$)</Label>
                    <Input type="number" step="0.01" placeholder="120.00" />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descrição detalhada do serviço..." />
                </div>
              </>
            )}

            <Button onClick={handleSave} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;