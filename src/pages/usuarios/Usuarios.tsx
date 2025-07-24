import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  MapPin,
  UserCheck
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Dr. João Silva",
      email: "joao.silva@equidade.com",
      role: "admin",
      specialty: "Administração",
      phone: "(11) 99999-1111",
      unit: "Centro",
      status: "ativo",
      lastLogin: "2024-01-15"
    },
    {
      id: 2,
      nome: "Dra. Ana Costa",
      email: "ana.costa@equidade.com", 
      role: "terapeuta",
      specialty: "Psicologia",
      phone: "(11) 99999-2222",
      unit: "Centro",
      status: "ativo",
      lastLogin: "2024-01-15"
    },
    {
      id: 3,
      nome: "TO. Carlos Lima",
      email: "carlos.lima@equidade.com",
      role: "terapeuta", 
      specialty: "Terapia Ocupacional",
      phone: "(11) 99999-3333",
      unit: "Norte",
      status: "ativo",
      lastLogin: "2024-01-14"
    },
    {
      id: 4,
      nome: "Fga. Paula Silva",
      email: "paula.silva@equidade.com",
      role: "terapeuta",
      specialty: "Fonoaudiologia",
      phone: "(11) 99999-4444", 
      unit: "Sul",
      status: "inativo",
      lastLogin: "2024-01-10"
    },
    {
      id: 5,
      nome: "Maria Santos",
      email: "maria.santos@equidade.com",
      role: "recepcao",
      specialty: "Atendimento",
      phone: "(11) 99999-5555",
      unit: "Centro", 
      status: "ativo",
      lastLogin: "2024-01-15"
    },
    {
      id: 6,
      nome: "Julia Mendes",
      email: "julia.mendes@estudante.com",
      role: "estagiario",
      specialty: "Psicologia",
      phone: "(11) 99999-6666",
      unit: "Norte",
      status: "ativo",
      lastLogin: "2024-01-15"
    }
  ]);

  const [newUser, setNewUser] = useState({
    nome: "",
    email: "",
    role: "",
    specialty: "",
    phone: "",
    unit: ""
  });

  const roleLabels = {
    admin: "Administrador",
    coordenador: "Coordenador",
    terapeuta: "Terapeuta", 
    estagiario: "Estagiário",
    recepcao: "Recepção"
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary text-primary-foreground';
      case 'coordenador': return 'bg-secondary text-secondary-foreground';
      case 'terapeuta': return 'bg-success text-success-foreground';
      case 'estagiario': return 'bg-warning text-warning-foreground';
      case 'recepcao': return 'bg-medical-gray text-medical-gray-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' 
      ? 'bg-success text-success-foreground'
      : 'bg-destructive text-destructive-foreground';
  };

  const filteredUsers = usuarios.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    if (!newUser.nome || !newUser.email || !newUser.role) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, email e função são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const user = {
      id: usuarios.length + 1,
      ...newUser,
      status: "ativo",
      lastLogin: "Nunca logou"
    };

    setUsuarios([...usuarios, user]);
    setNewUser({ nome: "", email: "", role: "", specialty: "", phone: "", unit: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Usuário criado",
      description: `${user.nome} foi adicionado com sucesso.`
    });
  };

  const toggleUserStatus = (id: number) => {
    setUsuarios(usuarios.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'ativo' ? 'inativo' : 'ativo' }
        : user
    ));

    toast({
      title: "Status atualizado",
      description: "Status do usuário foi alterado."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie profissionais e permissões do sistema
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                    placeholder="Ex: Dr. João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="joao@equidade.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Função *</Label>
                  <Select onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="coordenador">Coordenador</SelectItem>
                      <SelectItem value="terapeuta">Terapeuta</SelectItem>
                      <SelectItem value="estagiario">Estagiário</SelectItem>
                      <SelectItem value="recepcao">Recepção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    value={newUser.specialty}
                    onChange={(e) => setNewUser({...newUser, specialty: e.target.value})}
                    placeholder="Ex: Psicologia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Select onValueChange={(value) => setNewUser({...newUser, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Centro">Centro</SelectItem>
                      <SelectItem value="Norte">Norte</SelectItem>
                      <SelectItem value="Sul">Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateUser} className="w-full">
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{usuarios.length}</p>
                <p className="text-sm text-muted-foreground">Total Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{usuarios.filter(u => u.status === 'ativo').length}</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{usuarios.filter(u => u.role === 'terapeuta').length}</p>
                <p className="text-sm text-muted-foreground">Terapeutas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Funções</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="coordenador">Coordenador</SelectItem>
                <SelectItem value="terapeuta">Terapeuta</SelectItem>
                <SelectItem value="estagiario">Estagiário</SelectItem>
                <SelectItem value="recepcao">Recepção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border border-medical-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.nome}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleColor(user.role)}>
                      {roleLabels[user.role as keyof typeof roleLabels]}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Especialidade</p>
                    <p className="font-medium">{user.specialty}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unidade</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Último Acesso</p>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant={user.status === 'ativo' ? 'warning' : 'success'}
                    onClick={() => toggleUserStatus(user.id)}
                    className="gap-1"
                  >
                    <UserCheck className="h-3 w-3" />
                    {user.status === 'ativo' ? 'Desativar' : 'Ativar'}
                  </Button>
                  {user.status === 'inativo' && (
                    <Button size="sm" variant="destructive" className="gap-1">
                      <Trash2 className="h-3 w-3" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;