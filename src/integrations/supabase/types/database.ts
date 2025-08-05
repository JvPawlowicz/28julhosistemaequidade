import { Enums } from "./enums"
import { Tables } from "./tables"
import { Functions } from "./functions"

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: Tables
    Views: {
      [_ in never]: never
    }
    Functions: Functions
    Enums: Enums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}