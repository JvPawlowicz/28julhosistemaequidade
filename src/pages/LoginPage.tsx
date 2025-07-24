import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Heart, Shield, UserCog, ArrowLeft, Users, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { type } = useParams<{ type: 'professional' | 'parent' }>();
  const [professionalEmail, setProfessionalEmail] = useState("");
  const [professionalPassword, setProfessionalPassword] = useState("");
  const [parentCPF, setParentCPF] = useState("");
  const [parentBirthDate, setParentBirthDate] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfessionalLogin = (role: string) => {
    if (!professionalEmail || !professionalPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Login realizado",
      description: `Bem-vindo(a), ${role}!`,
    });
    
    navigate(`/dashboard/${role.toLowerCase()}`);
  };

  const handleParentLogin = () => {
    if (!parentCPF || !parentBirthDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha CPF e data de nascimento.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Login realizado",
      description: "Bem-vindo(a) ao Portal dos Pais!",
    });
    
    navigate("/dashboard/responsavel");
  };

  if (!type) {
    // Página de seleção de tipo de login
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary rounded-xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-primary">Equidade+</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Escolha seu tipo de acesso ao sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Login Profissionais */}
            <Card 
              className="border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer group h-full"
              onClick={() => navigate("/login/professional")}
            >
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">Profissionais</h3>
                <p className="text-muted-foreground mb-6">
                  Acesso para médicos, terapeutas, coordenadores, administradores e equipe de apoio
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center">
                    <Shield className="h-4 w-4" />
                    <span>Login com email e senha</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Lock className="h-4 w-4" />
                    <span>Acesso seguro e controlado</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Responsáveis */}
            <Card 
              className="border-2 border-secondary/20 hover:border-secondary transition-colors cursor-pointer group h-full"
              onClick={() => navigate("/login/parent")}
            >
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">Portal dos Pais</h3>
                <p className="text-muted-foreground mb-6">
                  Acesso para pais e responsáveis acompanharem o tratamento
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center">
                    <User className="h-4 w-4" />
                    <span>Login com CPF e data de nascimento</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Heart className="h-4 w-4" />
                    <span>Acompanhe o progresso do seu filho</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${type === 'professional' ? 'bg-primary' : 'bg-secondary'}`}>
              {type === 'professional' ? (
                <Users className="h-8 w-8 text-white" />
              ) : (
                <Heart className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-primary">Equidade+</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {type === 'professional' ? 'Acesso Profissional' : 'Portal dos Pais'}
          </p>
        </div>

        {type === 'professional' ? (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Login Profissional
              </CardTitle>
              <CardDescription>
                Entre com suas credenciais profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email profissional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@clinica.com"
                    value={professionalEmail}
                    onChange={(e) => setProfessionalEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={professionalPassword}
                    onChange={(e) => setProfessionalPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-muted-foreground text-center mb-3">
                  Selecione seu perfil de acesso:
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    onClick={() => handleProfessionalLogin("Admin")}
                    className="w-full justify-start gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Administrador
                  </Button>
                  <Button 
                    onClick={() => handleProfessionalLogin("Coordenador")}
                    variant="secondary"
                    className="w-full justify-start gap-2"
                  >
                    <UserCog className="h-4 w-4" />
                    Coordenador
                  </Button>
                  <Button 
                    onClick={() => handleProfessionalLogin("Terapeuta")}
                    variant="medical"
                    className="w-full justify-start gap-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Terapeuta
                  </Button>
                  <Button 
                    onClick={() => handleProfessionalLogin("Estagiario")}
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <User className="h-4 w-4" />
                    Estagiário
                  </Button>
                  <Button 
                    onClick={() => handleProfessionalLogin("Recepcao")}
                    variant="success"
                    className="w-full justify-start gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Recepção
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Portal dos Pais
              </CardTitle>
              <CardDescription>
                Acesse com seu CPF e data de nascimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={parentCPF}
                    onChange={(e) => setParentCPF(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Data de Nascimento</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={parentBirthDate}
                    onChange={(e) => setParentBirthDate(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleParentLogin}
                className="w-full bg-secondary hover:bg-secondary-hover"
                size="lg"
              >
                Entrar no Portal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPage;