import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Heart
} from "lucide-react";
import PortalFamiliasExpanded from '@/components/PortalFamiliasExpanded';

const ResponsavelDashboard = () => {
  const navigate = useNavigate();

  return (
    <PortalFamiliasExpanded />
  );
};

export default ResponsavelDashboard;