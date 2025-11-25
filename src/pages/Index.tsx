import { Button } from "@/components/ui/button";
import { Smartphone, Zap, Palette, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <div className="bg-card text-foreground px-4 py-2 rounded-lg text-sm font-medium mb-6 border border-border">
              🚀 Construtor de Sites Mobile-First
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold leading-tight tracking-tight">
            Crie Sites Incríveis
            <span className="block text-primary mt-2">Focados em Mobile</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Construa landing pages, portfólios e sites empresariais profissionais com um editor visual poderoso e intuitivo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="gap-2 text-base px-8 font-medium"
              onClick={() => navigate("/dashboard")}
            >
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 font-medium">
              Ver Exemplos
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile-First</h3>
            <p className="text-sm text-muted-foreground font-light">
              Otimizado para dispositivos móveis desde o início. Seus sites ficam perfeitos em qualquer tela.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Super Rápido</h3>
            <p className="text-sm text-muted-foreground font-light">
              Sistema de blocos intuitivo. Adicione elementos, personalize e publique em minutos.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Totalmente Personalizável</h3>
            <p className="text-sm text-muted-foreground font-light">
              Controle total sobre cores, fontes, espaçamentos e layouts. Seu site, suas regras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
