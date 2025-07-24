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
  Activity
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const beneficios = [
    {
      icon: Clock,
      titulo: "Tempo e produtividade",
      descricao: "Reduza o desperdício de tempo com cadastros em papel e falta de organização"
    },
    {
      icon: FileText,
      titulo: "Informações organizadas", 
      descricao: "Todas informações dos pacientes e atendimentos em um só lugar e com fácil acesso"
    },
    {
      icon: BarChart3,
      titulo: "Gestão e resultados",
      descricao: "Sem perda de tempo com burocracia e foco em processos e atividades"
    },
    {
      icon: Smartphone,
      titulo: "Prático e acessível",
      descricao: "Sistema muito simples de ser utilizado e acessível de qualquer local ou dispositivo"
    }
  ];

  const funcionalidades = [
    {
      icon: Users,
      titulo: "Gestão de Pacientes",
      descricao: "Cadastro completo e prontuários digitais"
    },
    {
      icon: Calendar,
      titulo: "Agenda Inteligente",
      descricao: "Agendamento e controle de consultas"
    },
    {
      icon: Activity,
      titulo: "Relatórios Completos",
      descricao: "Analytics e métricas de performance"
    },
    {
      icon: Shield,
      titulo: "Segurança Total",
      descricao: "Dados protegidos e conformidade LGPD"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Equidade+</h1>
              <p className="text-sm text-muted-foreground">Gestão Clínica Inteligente</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button 
              className="gap-2"
              onClick={() => window.open("https://wa.me/5516996308848", "_blank")}
            >
              <MessageCircle className="h-4 w-4" />
              Suporte
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
                O Equidade+ oferece gestão completa para clínicas multidisciplinares, 
                centros de reabilitação e serviços especializados. Uma plataforma acolhedora 
                que conecta profissionais, famílias e pessoas atendidas em um cuidado integrado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Acesso Profissionais</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Para fisioterapeutas, terapeutas ocupacionais, fonoaudiólogos, psicólogos e equipe multidisciplinar
                  </p>
                  <Button 
                    size="lg"
                    className="w-full h-12 text-lg"
                    onClick={() => navigate("/login/professional")}
                  >
                    Entrar como Profissional
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Portal das Famílias</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Para familiares acompanharem o desenvolvimento e terapias de seus entes queridos
                  </p>
                  <Button 
                    size="lg"
                    variant="secondary"
                    className="w-full h-12 text-lg"
                    onClick={() => navigate("/login/parent")}
                  >
                    Entrar como Responsável
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Teste grátis por 15 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Sem compromisso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Suporte incluído</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
                <h3 className="text-2xl font-bold mb-2">Dashboard Inteligente</h3>
                <p className="opacity-90">Visão completa da sua clínica em tempo real</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-medical-gray rounded-lg">
                  <span className="font-medium">Atendimentos Hoje</span>
                  <span className="text-2xl font-bold text-primary">24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-medical-gray rounded-lg">
                  <span className="font-medium">Taxa de Presença</span>
                  <span className="text-2xl font-bold text-success">94%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-medical-gray rounded-lg">
                  <span className="font-medium">Pacientes Ativos</span>
                  <span className="text-2xl font-bold text-secondary">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary mb-4">
              Por que escolher o Equidade+?
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforme sua gestão clínica com tecnologia de ponta e foque no que realmente importa: o cuidado dos seus pacientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <beneficio.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-4">{beneficio.titulo}</h4>
                  <p className="text-muted-foreground">{beneficio.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="bg-medical-gray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary mb-4">
              Funcionalidades Completas
            </h3>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para gerenciar sua clínica de forma profissional
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar sua gestão clínica?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já transformaram sua prática com o Equidade+
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              size="lg"
              variant="secondary"
              className="flex-1 h-14 text-lg gap-3"
              onClick={() => navigate("/login")}
            >
              <Shield className="h-5 w-5" />
              Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="h-8 w-8" />
                <span className="text-2xl font-bold">Equidade+</span>
              </div>
              <p className="text-white/80 mb-4">
                Sistema de gestão clínica mais completo do Brasil.
              </p>
              <p className="text-sm text-white/60">
                Desenvolvido por Humexa 2025 powered by Grupo Equidade
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white/80" />
                  <a 
                    href="mailto:joao.victor@equidadeplus.online"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    joao.victor@equidadeplus.online
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-white/80" />
                  <a 
                    href="tel:+5516996308848"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    (16) 99630-8848
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
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60">
              © 2025 Equidade+. Todos os direitos reservados.
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