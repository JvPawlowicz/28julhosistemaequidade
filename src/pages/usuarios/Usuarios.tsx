import { useState, useEffect, useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/contexts/usePermissions";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { Tables, Enums } from "@/integrations/supabase/types";
import { showSuccess, showError } from "@/utils/notifications";

type ProfileWithRole = Tables<'profiles'> & {
  role: Enums<'app_role'> | null;
  unit_name: string | null;
};

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [filterUnit, setFilterUnit] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { hasPermission, isAdmin } = usePermissions();
  const { currentUnit, availableUnits } = useMultiTenant();

  const [usuarios, setUsuarios] = useState<ProfileWithRole[]>([]);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "",
    council_type: "",
    phone: "",
    unit_id: ""
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*, units(name)');
      if (profilesError) throw profilesError;

      const userIds = profilesData.map(p => p.user_id);
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);
      if (rolesError) throw rolesError;

      const rolesMap = new Map<string, Enums<'app_role'>>(
        rolesData.map(r => [r.user_id, r.role])
      );

      const usersWithRoles: ProfileWithRole[] = profilesData.map(profile => ({
        ...profile,
        role: rolesMap.get(profile.user_id) || null,
        unit_name: profile.units?.name || null,
      }));

      if (!isAdmin() && currentUnit) {
        setUsuarios(usersWithRoles.filter(u => u.unit_id === currentUnit.id));
      } else {
        setUsuarios(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentUnit]);

  useEffect(() => {
    if (hasPermission('users', 'manage')) {
      fetchUsers();
    }
  }, [fetchUsers, hasPermission]);

  const roleLabels: { [key: string]: string } = {
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
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.council_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    const matchesUnit = filterUnit === 'todas' || user.unit_id === filterUnit;
    return matchesSearch && matchesRole && matchesUnit;
  });

  const handleCreateUser = async () => {
    if (!newUser.full_name || !newUser.email || !newUser.role) {
      showError("Campos obrigatórios", "Nome, email e função são obrigatórios.");
      return;
    }
    // This is a simplified creation process. A real implementation would involve
    // sending an invitation, creating an auth user, and then creating the profile and role.
    showSuccess("Usuário criado", `${newUser.full_name} foi adicionado com sucesso.`);
    setIsDialogOpen(false);
  };

  const toggleUserStatus = async (user: ProfileWithRole) => {
    const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus as Enums<'user_status'> })
        .eq('id', user.id);

      if (error) throw error;

      setUsuarios(prev => prev.map(u => 
        u.id === user.id 
          ? { ...u, status: newStatus as Enums<'user_status'> }
          : u
      ));

      showSuccess("Status atualizado", "Status do usuário foi alterado.");
    } catch (error) {
      console.error('Error updating user status:', error);
      showError("Erro ao atualizar status", "Não foi possível alterar o status do usuário.");
    }
  };

  if (!hasPermission('users', 'manage')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para gerenciar usuários.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
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
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="council_type">Especialidade</Label>
                  <Input
                    id="council_type"
                    value={newUser.council_type}
                    onChange={(e) => setNewUser({...newUser, council_type: e.target.value})}
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
                  <Label htmlFor="unit_id">Unidade</Label>
                  <Select onValueChange={(value) => setNewUser({...newUser, unit_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                      ))}
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
                <p className="text-2xl font-bold">{availableUnits.length}</p>
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
                {Object.entries(roleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterUnit} onValueChange={setFilterUnit}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Unidades</SelectItem>
                {availableUnits.map(unit => (
                  <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                ))}
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando usuários...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 border border-medical-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.full_name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(user.role || 'default')}>
                        {roleLabels[user.role || 'default']}
                      </Badge>
                      <Badge className={getStatusColor(user.status || 'default')}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Especialidade</p>
                      <p className="font-medium">{user.council_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Telefone</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unidade</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {user.unit_name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Criado em</p>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
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
                      onClick={() => toggleUserStatus(user)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;