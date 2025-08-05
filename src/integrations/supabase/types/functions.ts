import { Enums } from "./enums"

export type Functions = {
  get_user_unit: {
    Args: {
      _user_id: string
    }
    Returns: string
  }
  has_role: {
    Args: {
      _user_id: string
      _role: Enums["app_role"]
    }
    Returns: boolean
  }
}