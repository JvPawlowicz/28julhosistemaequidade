import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const Loading = ({ className, size = "md", text }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export const LoadingPage = ({ text = "Carregando..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

export const LoadingCard = ({ text }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loading size="md" text={text} />
    </div>
  );
};