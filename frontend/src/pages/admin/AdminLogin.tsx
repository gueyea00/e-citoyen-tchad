import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Lock } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.fetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      setAuth(data.token, data.user);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-card p-8 rounded-xl shadow-float max-w-sm w-full border border-border">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Administration CMS</h1>
          <p className="text-muted-foreground text-sm text-center">Identifiez-vous pour gérer le catalogue E-Citoyen.</p>
        </div>
        
        {error && <div className="bg-destructive/15 text-destructive p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email (ex: admin@ministere.gov)" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Mot de passe (ex: admin)" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Vérification..." : "Connexion Sécurisée"}
          </Button>
        </form>
      </div>
    </div>
  );
}
