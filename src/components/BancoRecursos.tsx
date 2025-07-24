import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Filter,
  Heart,
  Brain,
  Activity,
  Eye,
  Ear,
  Car,
  Home,
  School,
  Laptop,
  Book,
  Gamepad2,
  Wrench,
  Download,
  ExternalLink,
  Star,
  User,
  Calendar,
  Tag
} from "lucide-react";

const BancoRecursos = () => {
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroDeficiencia, setFiltroDeficiencia] = useState("todas");
  const [termoBusca, setTermoBusca] = useState("");

  const categorias = [
    { valor: "tecnologia_assistiva", label: "Tecnologia Assistiva", icone: Laptop },
    { valor: "adaptacoes_ambientais", label: "Adaptações Ambientais", icone: Home },
    { valor: "recursos_pedagogicos", label: "Recursos Pedagógicos", icone: Book },
    { valor: "equipamentos_reabilitacao", label: "Equipamentos de Reabilitação", icone: Wrench },
    { valor: "jogos_terapeuticos", label: "Jogos Terapêuticos", icone: Gamepad2 },
    { valor: "materiais_educativos", label: "Materiais Educativos", icone: School }
  ];

  const tiposDeficiencia = [
    { valor: "deficiencia_intelectual", label: "Deficiência Intelectual", icone: Brain },
    { valor: "deficiencia_fisica", label: "Deficiência Física/Motora", icone: Car },
    { valor: "deficiencia_visual", label: "Deficiência Visual", icone: Eye },
    { valor: "deficiencia_auditiva", label: "Deficiência Auditiva", icone: Ear },
    { valor: "tea", label: "Transtorno do Espectro Autista", icone: Activity },
    { valor: "multiplas_deficiencias", label: "Múltiplas Deficiências", icone: Heart }
  ];

  const recursos = [
    {
      id: 1,
      titulo: "Prancha de Comunicação Digital",
      categoria: "tecnologia_assistiva",
      deficiencias: ["deficiencia_intelectual", "tea", "deficiencia_fisica"],
      descricao: "Aplicativo com símbolos PCS para comunicação alternativa",
      fabricante: "SymbolStix",
      preco: "R$ 89,00",
      avaliacao: 4.8,
      link_externo: "https://symbolstix.com",
      recomendado_por: "Fga. Paula Silva",
      data_recomendacao: "2024-01-15",
      tags: ["CAA", "Símbolos", "Tablet", "Comunicação"]
    },
    {
      id: 2,
      titulo: "Mouse Adaptado para Deficiência Motora",
      categoria: "tecnologia_assistiva",
      deficiencias: ["deficiencia_fisica", "multiplas_deficiencias"],
      descricao: "Mouse com botões grandes e ajuste de sensibilidade",
      fabricante: "AbleData",
      preco: "R$ 345,00",
      avaliacao: 4.6,
      link_externo: "https://abledata.com",
      recomendado_por: "TO. Marina Santos",
      data_recomendacao: "2024-01-12",
      tags: ["Acessibilidade", "Computador", "Motora", "Independência"]
    },
    {
      id: 3,
      titulo: "Livro Tátil 'Os Três Porquinhos'",
      categoria: "recursos_pedagogicos", 
      deficiencias: ["deficiencia_visual", "deficiencia_intelectual"],
      descricao: "Livro com texturas e braille para estimulação tátil",
      fabricante: "Fundação Dorina Nowill",
      preco: "R$ 78,00",
      avaliacao: 4.9,
      link_externo: "https://fundacaodorina.org.br",
      recomendado_por: "Pedagoga Ana Costa",
      data_recomendacao: "2024-01-10",
      tags: ["Braille", "Tátil", "Literatura", "Educação"]
    },
    {
      id: 4,
      titulo: "Cadeira de Banho Ajustável",
      categoria: "equipamentos_reabilitacao",
      deficiencias: ["deficiencia_fisica", "multiplas_deficiencias"],
      descricao: "Cadeira com altura regulável e apoios laterais",
      fabricante: "Ortobras",
      preco: "R$ 890,00",
      avaliacao: 4.7,
      link_externo: "https://ortobras.com.br",
      recomendado_por: "Ft. Carlos Lima",
      data_recomendacao: "2024-01-08",
      tags: ["Banho", "Segurança", "AVD", "Independência"]
    },
    {
      id: 5,
      titulo: "Jogo de Memória das Emoções",
      categoria: "jogos_terapeuticos",
      deficiencias: ["tea", "deficiencia_intelectual"],
      descricao: "Cartas com expressões faciais para trabalhar emoções",
      fabricante: "Grow",
      preco: "R$ 45,00",
      avaliacao: 4.5,
      recomendado_por: "Psi. Roberto Costa",
      data_recomendacao: "2024-01-05",
      tags: ["Emoções", "Social", "Terapia", "Cognição"]
    },
    {
      id: 6,
      titulo: "Barras de Apoio para Banheiro",
      categoria: "adaptacoes_ambientais",
      deficiencias: ["deficiencia_fisica", "multiplas_deficiencias"],
      descricao: "Kit com barras de apoio e instruções de instalação",
      fabricante: "Deca",
      preco: "R$ 234,00",
      avaliacao: 4.4,
      link_externo: "https://deca.com.br",
      recomendado_por: "TO. Marina Santos",
      data_recomendacao: "2024-01-03",
      tags: ["Segurança", "Banheiro", "Instalação", "Mobilidade"]
    },
    {
      id: 7,
      titulo: "Fones de Ouvido com Redução de Ruído",
      categoria: "tecnologia_assistiva",
      deficiencias: ["tea", "deficiencia_auditiva"],
      descricao: "Fones especiais para hipersensibilidade auditiva",
      fabricante: "Sony",
      preco: "R$ 456,00",
      avaliacao: 4.8,
      recomendado_por: "TO. Marina Santos",
      data_recomendacao: "2024-01-01",
      tags: ["Sensorial", "Auditivo", "Proteção", "Conforto"]
    },
    {
      id: 8,
      titulo: "Material Dourado Montessori",
      categoria: "materiais_educativos",
      deficiencias: ["deficiencia_intelectual", "tea"],
      descricao: "Conjunto completo para ensino de matemática",
      fabricante: "Xalingo",
      preco: "R$ 123,00",
      avaliacao: 4.7,
      recomendado_por: "Psicopedagoga Lucia",
      data_recomendacao: "2023-12-28",
      tags: ["Matemática", "Montessori", "Concreto", "Educação"]
    }
  ];

  const recursosFiltrados = recursos.filter(recurso => {
    const matchCategoria = filtroCategoria === "todos" || recurso.categoria === filtroCategoria;
    const matchDeficiencia = filtroDeficiencia === "todas" || recurso.deficiencias.includes(filtroDeficiencia);
    const matchBusca = termoBusca === "" || 
      recurso.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      recurso.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      recurso.tags.some(tag => tag.toLowerCase().includes(termoBusca.toLowerCase()));
    
    return matchCategoria && matchDeficiencia && matchBusca;
  });

  const getIconeCategoria = (categoria: string) => {
    const cat = categorias.find(c => c.valor === categoria);
    return cat ? cat.icone : Book;
  };

  const getIconeDeficiencia = (deficiencia: string) => {
    const def = tiposDeficiencia.find(d => d.valor === deficiencia);
    return def ? def.icone : Heart;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Book className="h-8 w-8" />
            Banco de Recursos
          </h1>
          <p className="text-muted-foreground">
            Tecnologias assistivas, adaptações e recursos para diferentes deficiências
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </Button>
          <Button className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Sugerir Recurso
          </Button>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar recursos, tags..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.valor} value={cat.valor}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filtroDeficiencia} onValueChange={setFiltroDeficiencia}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Deficiência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Deficiências</SelectItem>
                {tiposDeficiencia.map(def => (
                  <SelectItem key={def.valor} value={def.valor}>
                    {def.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Buscar ({recursosFiltrados.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
          <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          <TabsTrigger value="populares">Mais Recomendados</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recursosFiltrados.map((recurso) => {
              const IconeCategoria = getIconeCategoria(recurso.categoria);
              
              return (
                <Card key={recurso.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <IconeCategoria className="h-5 w-5 text-primary" />
                        {recurso.titulo}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{recurso.avaliacao}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{recurso.descricao}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Fabricante:</span>
                          <span className="font-medium">{recurso.fabricante}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Preço:</span>
                          <span className="font-bold text-primary">{recurso.preco}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {recurso.deficiencias.slice(0, 2).map((def, i) => {
                          const IconeDef = getIconeDeficiencia(def);
                          const labelDef = tiposDeficiencia.find(td => td.valor === def)?.label || def;
                          
                          return (
                            <Badge key={i} variant="secondary" className="text-xs gap-1">
                              <IconeDef className="h-3 w-3" />
                              {labelDef.split(' ')[0]}
                            </Badge>
                          );
                        })}
                        {recurso.deficiencias.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{recurso.deficiencias.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {recurso.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <User className="h-3 w-3" />
                          <span>Recomendado por {recurso.recomendado_por}</span>
                          <Calendar className="h-3 w-3 ml-auto" />
                          <span>{new Date(recurso.data_recomendacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Detalhes
                          </Button>
                          {recurso.link_externo && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <ExternalLink className="h-3 w-3" />
                              Site
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          {categorias.map((categoria) => {
            const recursosCategoria = recursosFiltrados.filter(r => r.categoria === categoria.valor);
            const IconeCategoria = categoria.icone;
            
            if (recursosCategoria.length === 0) return null;
            
            return (
              <div key={categoria.valor}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <IconeCategoria className="h-6 w-6 text-primary" />
                  {categoria.label} ({recursosCategoria.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recursosCategoria.slice(0, 6).map((recurso) => (
                    <Card key={recurso.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{recurso.titulo}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{recurso.avaliacao}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">{recurso.descricao}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-primary">{recurso.preco}</span>
                          <Button size="sm" variant="outline">
                            Ver mais
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="populares" className="space-y-4">
          <div className="space-y-4">
            {recursosFiltrados
              .sort((a, b) => b.avaliacao - a.avaliacao)
              .slice(0, 10)
              .map((recurso, index) => {
                const IconeCategoria = getIconeCategoria(recurso.categoria);
                
                return (
                  <Card key={recurso.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-bold">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconeCategoria className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">{recurso.titulo}</h3>
                            <div className="flex items-center gap-1 ml-auto">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{recurso.avaliacao}</span>
                              <span className="text-muted-foreground text-sm">(alta avaliação)</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{recurso.descricao}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <span><strong>Fabricante:</strong> {recurso.fabricante}</span>
                              <span className="text-primary font-bold">{recurso.preco}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm">Ver Detalhes</Button>
                              {recurso.link_externo && (
                                <Button size="sm" variant="outline" className="gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  Site
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BancoRecursos;