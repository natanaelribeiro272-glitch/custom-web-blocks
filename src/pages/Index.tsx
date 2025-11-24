import { Button } from "@/components/ui/button";
import { Smartphone, Zap, Palette, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Construtor de Sites Mobile-First
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
            Crie Sites Incríveis
            <span className="block text-primary mt-2">Focados em Mobile</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Construa landing pages, portfólios e sites empresariais profissionais com um editor visual poderoso e intuitivo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="gap-2 text-lg px-8 py-6"
              onClick={() => navigate("/editor")}
            >
              Começar Agora
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Exemplos
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Mobile-First</h3>
            <p className="text-muted-foreground">
              Otimizado para dispositivos móveis desde o início. Seus sites ficam perfeitos em qualquer tela.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Super Rápido</h3>
            <p className="text-muted-foreground">
              Sistema de blocos intuitivo. Adicione elementos, personalize e publique em minutos.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Palette className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Totalmente Personalizável</h3>
            <p className="text-muted-foreground">
              Controle total sobre cores, fontes, espaçamentos e layouts. Seu site, suas regras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
