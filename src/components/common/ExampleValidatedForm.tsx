import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Exemplo de schema de validação
const schema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" })
});

type FormData = z.infer<typeof schema>;

export function ExampleValidatedForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  function onSubmit(data: FormData) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Formulário de exemplo">
      <div>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" {...register("email")}
          className="border rounded px-2 py-1 w-full" aria-invalid={!!errors.email} />
        {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input id="password" type="password" {...register("password")}
          className="border rounded px-2 py-1 w-full" aria-invalid={!!errors.password} />
        {errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}
      </div>
      <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-4 py-2 rounded">
        {isSubmitting ? "Enviando..." : "Entrar"}
      </button>
    </form>
  );
}
