import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth, useAuthActions } from "@/contexts/useAuth";
import { UserRound, Heart, Stethoscope, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '@/integrations/supabase/client';


// Schema de validação para login/cadastro profissional
const professionalSchema = z.object({
  fullName: z.string().min(3, "Nome obrigatório").optional(),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().optional()
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

// Schema de validação para login de responsável
const parentSchema = z.object({
  cpf: z.string().min(11, "CPF obrigatório").regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido"),
  birthDate: z.string().min(8, "Data de nascimento obrigatória")
});
type ParentFormData = z.infer<typeof parentSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { signIn, signUp, loading } = useAuthActions();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [parentData, setParentData] = useState({ cpf: "", birthDate: "" });

  // React Hook Form + Zod para validação
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema.refine((data) => !isSignUp || data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"]
    })),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      confirmPassword: ""
    }
  });

  // Novo handler usando React Hook Form
  const onSubmit = async (data: ProfessionalFormData) => {
    if (isSignUp) {
      const { error } = await signUp(data.email, data.password, data.fullName || "");
      if (!error) {
        setIsSignUp(false);
        reset();
      }
    } else {
      const { error } = await signIn(data.email, data.password);
      if (!error) {
        // Buscar role do usuário após login
        // Exemplo: buscar do Supabase e salvar no localStorage
        // const { data: profileData, error: profileError } = await supabase
        //   .from('user_profiles')
        //   .select('role')
        //   .eq('id', user.id)
        //   .single();
        // if (!profileError && profileData?.role) {
        //   localStorage.setItem('userRole', profileData.role);
        // }
        navigate('/app');
      }
    }
  };

  // React Hook Form para login de responsável
  const {
    register: registerParent,
    handleSubmit: handleSubmitParent,
    formState: { errors: errorsParent, isSubmitting: isSubmittingParent },
    reset: resetParent
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: { cpf: "", birthDate: "" }
  });

  const handleParentLogin = async (data: ParentFormData) => {
    // Autenticação real de responsáveis (CPF + data de nascimento)
    const { data: guardian, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('cpf', data.cpf.replace(/\D/g, '')) // remove máscara
      .eq('birth_date', data.birthDate)
      .single();
    if (!error && guardian) {
      localStorage.setItem('userRole', 'responsavel');
      // Você pode salvar mais dados do responsável se quiser
      navigate('/app/dashboard/responsavel');
    } else {
      // Exibir erro de login
      alert('CPF ou data de nascimento inválidos.');
    }
  };

  // Render the selection screen if no type is specified
  if (!type) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema Equidade</h1>
            <p className="text-xl text-gray-600">Gestão Clínica Interdisciplinar</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/login/professional')}
            >
              <CardHeader className="text-center">
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">Profissionais</CardTitle>
                <CardDescription className="text-base">
                  Acesso para terapeutas, coordenadores, administradores e equipe de recepção
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/login/parent')}
            >
              <CardHeader className="text-center">
                <UserRound className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">Responsáveis</CardTitle>
                <CardDescription className="text-base">
                  Portal para pais e responsáveis acompanharem o progresso do tratamento
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Sistema desenvolvido para gestão integrada de terapias ABA</p>
          </div>
        </div>
      </div>
    );
  }

  // Professional login form
  if (type === 'professional') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Heart className="h-16 w-16 text-primary" />
          </div>

          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">
                {isSignUp ? 'Criar Conta' : 'Login Profissional'}
              </CardTitle>
              <CardDescription>
                {isSignUp 
                  ? 'Crie sua conta para acessar o sistema'
                  : 'Entre com suas credenciais para acessar o sistema'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Formulário validado com React Hook Form + Zod */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Formulário de login/cadastro profissional">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      {...register("fullName")}
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && <span className="text-red-600 text-xs">{errors.fullName.message as string}</span>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <span className="text-red-600 text-xs">{errors.email.message as string}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isSignUp ? "Mínimo 6 caracteres" : "Digite sua senha"}
                      {...register("password")}
                      aria-invalid={!!errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <span className="text-red-600 text-xs">{errors.password.message as string}</span>}
                </div>
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite a senha novamente"
                      {...register("confirmPassword")}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && <span className="text-red-600 text-xs">{errors.confirmPassword.message as string}</span>}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || isSubmitting}
                  aria-busy={loading || isSubmitting}
                >
                  {loading || isSubmitting
                    ? 'Carregando...'
                    : isSignUp 
                    ? 'Criar Conta' 
                    : 'Entrar'
                  }
                </Button>
              </form>
              {/* Fim do formulário validado */}
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    reset();
                  }}
                  className="text-sm"
                >
                  {isSignUp 
                    ? 'Já tem uma conta? Faça login' 
                    : 'Não tem uma conta? Cadastre-se'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Parent login form
  if (type === 'parent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Heart className="h-16 w-16 text-primary" />
          </div>

          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Portal dos Responsáveis</CardTitle>
              <CardDescription>
                Acesse com seu CPF e data de nascimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitParent(handleParentLogin)} className="space-y-4" aria-label="Formulário de login responsável">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    {...registerParent("cpf")}
                    aria-invalid={!!errorsParent.cpf}
                  />
                  {errorsParent.cpf && <span className="text-red-600 text-xs">{errorsParent.cpf.message as string}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...registerParent("birthDate")}
                    aria-invalid={!!errorsParent.birthDate}
                  />
                  {errorsParent.birthDate && <span className="text-red-600 text-xs">{errorsParent.birthDate.message as string}</span>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmittingParent} aria-busy={isSubmittingParent}>
                  {isSubmittingParent ? 'Carregando...' : 'Entrar'}
                </Button>
              </form>
              <div className="text-center text-sm text-gray-600">
                <p>Sistema de acompanhamento para pais e responsáveis</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

// Removido componente LoginPage legacy (mock). Apenas o componente Login real permanece.

export default Login;