import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Botão reutilizável acessível e responsivo.
 * Exemplo de uso:
 * <CommonButton onClick={...}>Salvar</CommonButton>
 */
export const CommonButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </button>
  )
);
CommonButton.displayName = "CommonButton";
