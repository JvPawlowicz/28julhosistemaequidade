export type Enums = {
  app_role:
    | "admin"
    | "coordenador"
    | "terapeuta"
    | "estagiario"
    | "recepcao"
  appointment_status:
    | "agendado"
    | "confirmado"
    | "realizado"
    | "compareceu"
    | "falta"
    | "cancelado"
  evolution_status: "Rascunho" | "Pendente de Supervisão" | "Finalizada"
  specialty:
    | "psicologia"
    | "terapia_ocupacional"
    | "fonoaudiologia"
    | "fisioterapia"
    | "psicopedagogia"
    | "nutricao"
  user_status: "ativo" | "inativo" | "suspenso"
}