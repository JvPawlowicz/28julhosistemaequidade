import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info, TrendingUp, AlertCircle } from "lucide-react";
import { showSuccess, showError } from '@/utils/notifications'; // Import new notification utility

interface ScaleCalculatorProps {
  selectedScale?: string;
}

export const ScaleCalculator = ({ selectedScale }: ScaleCalculatorProps) => {
  const [activeScale, setActiveScale] = useState(selectedScale || "");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    total: number;
    classification: string;
    description: string;
    recommendations: string[];
  } | null>(null);

  // Definições das escalas
  const scaleDefinitions = {
    "CARS-2": {
      name: "Escala de Avaliação do Autismo",
      items: [
        "Relacionamento interpessoal",
        "Imitação",
        "Resposta emocional",
        "Uso corporal",
        "Uso de objetos",
        "Resposta a mudanças",
        "Resposta visual",
        "Resposta auditiva",
        "Resposta ao tato, olfato e paladar",
        "Medo ou nervosismo",
        "Comunicação verbal",
        "Comunicação não-verbal",
        "Nível de atividade",
        "Nível de consistência da resposta intelectual",
        "Impressões gerais"
      ],
      scoring: {
        range: [1, 4],
        total: [15, 60],
        classifications: [
          { min: 15, max: 29.5, label: "Sem autismo", description: "Comportamentos dentro da normalidade" },
          { min: 30, max: 36.5, label: "Autismo leve a moderado", description: "Alguns comportamentos claramente autísticos" },
          { min: 37, max: 60, label: "Autismo severo", description: "Muitos comportamentos claramente autísticos" }
        ]
      }
    },
    "Vineland-3": {
      name: "Escala de Comportamento Adaptativo",
      items: [
        "Comunicação receptiva",
        "Comunicação expressiva",
        "Comunicação escrita",
        "Relacionamento interpessoal",
        "Brincadeira e tempo livre",
        "Habilidades de enfrentamento",
        "Vida doméstica",
        "Vida na comunidade",
        "Autocuidado",
        "Habilidades motoras finas",
        "Habilidades motoras grossas"
      ],
      scoring: {
        range: [0, 2],
        total: [0, 154],
        classifications: [
          { min: 130, max: 154, label: "Alto", description: "Habilidades adaptativas muito desenvolvidas" },
          { min: 115, max: 129, label: "Moderadamente alto", description: "Habilidades acima da média" },
          { min: 85, max: 114, label: "Adequado", description: "Habilidades dentro da normalidade" },
          { min: 70, max: 84, label: "Moderadamente baixo", description: "Algumas dificuldades adaptativas" },
          { min: 0, max: 69, label: "Baixo", description: "Déficits significativos nas habilidades adaptativas" }
        ]
      }
    },
    "SNAP-IV": {
      name: "Escala de Avaliação TDAH",
      items: [
        "Dificuldade para manter atenção",
        "Não escuta quando falam diretamente",
        "Não segue instruções",
        "Dificuldade para organizar tarefas",
        "Evita tarefas que exigem esforço mental",
        "Perde coisas necessárias",
        "Distrai-se facilmente",
        "Esquece atividades diárias",
        "Agita as mãos ou pés",
        "Abandona sua cadeira",
        "Corre ou escala excessivamente",
        "Dificuldade para brincar quieto",
        "Age como se fosse movido a motor",
        "Fala excessivamente",
        "Responde antes da pergunta ser completada",
        "Dificuldade para aguardar a vez",
        "Interrompe ou se intromete",
        "Perde a paciência",
        "Discute com adultos",
        "Desafia regras",
        "Incomoda deliberadamente",
        "Culpa outros por seus erros",
        "É sensível ou facilmente incomodado",
        "É raivoso e ressentido",
        "É rancoroso ou vingativo"
      ],
      scoring: {
        range: [0, 3],
        total: [0, 78],
        classifications: [
          { min: 0, max: 18, label: "Sintomas mínimos", description: "Comportamento típico para a idade" },
          { min: 19, max: 35, label: "Sintomas leves", description: "Alguns indicadores presentes" },
          { min: 36, max: 52, label: "Sintomas moderados", description: "Vários indicadores presentes" },
          { min: 53, max: 78, label: "Sintomas severos", description: "Muitos indicadores presentes" }
        ]
      }
    }
  };

  const handleScoreChange = (item: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => ({ ...prev, [item]: numValue }));
  };

  const calculateResult = () => {
    if (!activeScale || !scaleDefinitions[activeScale as keyof typeof scaleDefinitions]) {
      showError("Erro", "Selecione uma escala válida.");
      return;
    }

    const scale = scaleDefinitions[activeScale as keyof typeof scaleDefinitions];
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    // Encontrar classificação
    const classification = scale.scoring.classifications.find(
      c => total >= c.min && total <= c.max
    );

    if (!classification) {
      showError("Erro no cálculo", "Pontuação fora do intervalo válido.");
      return;
    }

    // Gerar recomendações baseadas na classificação
    const recommendations = generateRecommendations(activeScale, classification.label);

    setResult({
      total,
      classification: classification.label,
      description: classification.description,
      recommendations
    });

    showSuccess("Cálculo realizado", `Total: ${total} pontos - ${classification.label}.`);
  };

  const generateRecommendations = (scale: string, classification: string): string[] => {
    const recommendationMap: Record<string, Record<string, string[]>> = {
      "CARS-2": {
        "Sem autismo": [
          "Continuar monitoramento do desenvolvimento",
          "Manter atividades de estimulação apropriadas para a idade"
        ],
        "Autismo leve a moderado": [
          "Implementar intervenções comportamentais estruturadas",
          "Desenvolver programa de habilidades sociais",
          "Considerar terapia da fala se necessário",
          "Reavaliação em 6 meses"
        ],
        "Autismo severo": [
          "Programa intensivo de intervenção comportamental",
          "Terapia multidisciplinar (TO, Fono, Psicologia)",
          "Adaptações ambientais significativas",
          "Suporte familiar especializado",
          "Reavaliação em 3 meses"
        ]
      },
      "Vineland-3": {
        "Baixo": [
          "Programa intensivo de desenvolvimento de habilidades adaptativas",
          "Suporte educacional especializado",
          "Treinamento de habilidades de vida diária"
        ],
        "Moderadamente baixo": [
          "Intervenções focadas em áreas específicas de dificuldade",
          "Apoio para desenvolvimento de autonomia",
          "Orientação familiar para generalização",
          "Reavaliação em 6 meses"
        ],
        "Adequado": [
          "Manter estímulos apropriados ao desenvolvimento",
          "Monitoramento regular do progresso"
        ]
      },
      "SNAP-IV": {
        "Sintomas mínimos": [
          "Monitoramento contínuo do comportamento",
          "Orientação aos pais sobre estratégias de manejo"
        ],
        "Sintomas leves": [
          "Intervenções comportamentais em ambiente escolar e familiar",
          "Estratégias de organização e planejamento",
          "Reavaliação em 3 meses"
        ],
        "Sintomas moderados": [
          "Avaliação neuropsicológica aprofundada",
          "Intervenção multidisciplinar (psicologia, psicopedagogia)",
          "Considerar suporte medicamentoso se indicado",
          "Reavaliação em 3 meses"
        ],
        "Sintomas severos": [
          "Intervenção intensiva e multidisciplinar",
          "Acompanhamento psiquiátrico para manejo medicamentoso",
          "Suporte escolar e adaptações curriculares",
          "Reavaliação em 1 mês"
        ]
      }
    };

    return recommendationMap[scale]?.[classification] || [
      "Consultar literatura especializada para recomendações específicas",
      "Considerar avaliação complementar se necessário"
    ];
  };

  const currentScale = activeScale ? scaleDefinitions[activeScale as keyof typeof scaleDefinitions] : null;

  return (
    <div className="space-y-6">
      {/* Seletor de escala */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Escalas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Selecione a Escala</label>
              <Select value={activeScale} onValueChange={setActiveScale}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma escala para calcular" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(scaleDefinitions).map(([key, scale]) => (
                    <SelectItem key={key} value={key}>
                      {key} - {scale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentScale && (
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">{currentScale.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pontuação: {currentScale.scoring.range[0]} a {currentScale.scoring.range[1]} por item
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total possível: {currentScale.scoring.total[0]} a {currentScale.scoring.total[1]} pontos
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de pontuação */}
      {currentScale && (
        <Card>
          <CardHeader>
            <CardTitle>Itens da Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentScale.items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">{index + 1}. {item}</label>
                  <Input
                    type="number"
                    min={currentScale.scoring.range[0]}
                    max={currentScale.scoring.range[1]}
                    value={scores[item] || ""}
                    onChange={(e) => handleScoreChange(item, e.target.value)}
                    placeholder={`${currentScale.scoring.range[0]} - ${currentScale.scoring.range[1]}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button onClick={calculateResult} className="gap-2">
                <Calculator className="h-4 w-4" />
                Calcular Resultado
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resultado da Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">{result.total} pontos</div>
                <Badge className="text-lg px-4 py-2">
                  {result.classification}
                </Badge>
                <p className="text-muted-foreground mt-2">{result.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Recomendações
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};