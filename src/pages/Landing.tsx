import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Clock, 
  FileText, 
  BarChart3, 
  Smartphone,
  Shield,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Users,
  Calendar,
  Activity,
  Power,
  Briefcase,
  Home
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const funcionalidades = [
    {
      icon: Users,
      titulo: "Gestão de Pacientes",
      descricao: "Cadastro completo, prontuários digitais e informações centralizadas."
    },
    {
      icon: Calendar,
      titulo: "Agenda Inteligente",
      descricao: "Agendamento, controle de consultas e visualização por equipe ou unidade."
    },
    {
      icon: FileText,
      titulo: "Evoluções Clínicas",
      descricao: "Registro padronizado do progresso terapêutico com validade jurídica."
    },
    {
      icon: BarChart3,
      titulo: "Relatórios e Análises",
      descricao: "Dashboards com métricas de performance para uma gestão baseada em dados."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <Stethoscope className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Equidade+</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Clínica</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-success">Sistema Operacional</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Acessar o Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-primary leading-tight mb-6">
                Cuidado inclusivo e especializado para pessoas com 
                <span className="text-secondary"> deficiência</span> e 
                <span className="text-secondary"> diversas necessidades</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                O Equidade+ é uma plataforma de gestão para clínicas multidisciplinares, 
                centros de reabilitação e serviços especializados, conectando profissionais, 
                famílias e pessoas atendidas em um cuidado integrado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group" onClick={() => navigate("/login/professional")}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Acesso Profissional</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Para fisioterapeutas, terapeutas ocupacionais, fonoaudiólogos, psicólogos e equipe multidisciplinar.
                  </p>
                  <Button 
                    size="lg"
                    className="w-full h-12 text-lg"
                  >
                    Entrar como Profissional
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer group" onClick={() => navigate("/login/parent")}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Home className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Portal das Famílias</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Para familiares acompanharem o desenvolvimento e as terapias de seus entes queridos.
                  </p>
                  <Button 
                    size="lg"
                    variant="secondary"
                    className="w-full h-12 text-lg"
                  >
                    Entrar como Responsável
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="bg-card border rounded-2xl shadow-2xl p-8">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-primary-foreground mb-6">
                <h3 className="text-2xl font-bold mb-2">Dashboard Inteligente</h3>
                <p className="opacity-90">Visão completa da sua clínica em tempo real.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Atendimentos Hoje</span>
                  <span className="text-2xl font-bold text-primary">24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Taxa de Presença</span>
                  <span className="text-2xl font-bold text-success">94%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Pacientes Ativos</span>
                  <span className="text-2xl font-bold text-secondary">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plataforma Unificada */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary mb-4">
              Uma Plataforma Unificada para o Cuidado
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ferramentas projetadas para cada perfil, garantindo uma experiência integrada e eficiente para todos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-4">Para Profissionais</h4>
                <p className="text-muted-foreground">Centralize prontuários, evoluções e planos terapêuticos. Colabore com a equipe e otimize sua rotina.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h4 className="text-xl font-bold text-secondary mb-4">Para Famílias</h4>
                <p className="text-muted-foreground">Acompanhe o progresso, acesse relatórios e comunique-se de forma segura com a equipe terapêutica.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-bold text-primary/80 mb-4">Para Gestores</h4>
                <p className="text-muted-foreground">Tenha uma visão completa da operação, com dados para uma gestão eficiente e focada na qualidade.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary mb-4">
              Recursos Essenciais
            </h3>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para gerenciar sua clínica de forma profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {funcionalidades.map((func, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <func.icon className="h-12 w-12 text-primary mb-4" />
                  <h4 className="text-lg font-bold text-primary mb-2">{func.titulo}</h4>
                  <p className="text-muted-foreground text-sm">{func.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="h-8 w-8" />
                <span className="text-2xl font-bold">Equidade+</span>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Sistema de gestão clínica para um cuidado integrado e eficiente.
              </p>
              <p className="text-sm text-primary-foreground/60">
                Desenvolvido por Humexa 2025
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-foreground/80" />
                  <a 
                    href="mailto:joao.victor@equidadeplus.online"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    joao.victor@equidadeplus.online
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-foreground/80" />
                  <a 
                    href="tel:+5516996308848"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    +55 (16) 99630-8848
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Suporte</h4>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 gap-2"
                onClick={() => window.open("https://wa.me/5516996308848", "_blank")}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Suporte
              </Button>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="text-primary-foreground/60">
              © 2025 Equidade+ by Humexa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          onClick={() => window.open("https://wa.me/5516996308848", "_blank")}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;