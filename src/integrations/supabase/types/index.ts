import { Database as DB } from "./database"
import { Tables as T, TablesInsert as TI, TablesUpdate as TU } from "./helpers"
import { Enums as E } from "./enums"

export type Database = DB
export type Tables<TableName extends keyof T> = T[TableName]
export type TablesInsert<TableName extends keyof TI> = TI[TableName]
export type TablesUpdate<TableName extends keyof TU> = TU[TableName]
export type Enums<EnumName extends keyof E> = E[EnumName]

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coordenador", "terapeuta", "estagiario", "recepcao"],
      appointment_status: [
        "agendado",
        "confirmado",
        "realizado",
        "compareceu",
        "falta",
        "cancelado",
      ],
      evolution_status: ["Rascunho", "Pendente de Supervisão", "Finalizada"],
      specialty: [
        "psicologia",
        "terapia_ocupacional",
        "fonoaudiologia",
        "fisioterapia",
        "psicopedagogia",
        "nutricao",
      ],
      user_status: ["ativo", "inativo", "suspenso"],
    },
  },
} as const