import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Globe, Calendar, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    // Carregar projetos salvos do localStorage
    const savedProjects = localStorage.getItem("userProjects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleCreateProject = () => {
    const trimmedName = newProjectName.trim();
    
    if (!trimmedName) {
      toast.error("Por favor, digite um nome para o site");
      return;
    }

    if (trimmedName.length > 50) {
      toast.error("Nome muito longo (máximo 50 caracteres)");
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: trimmedName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects));
    
    // Limpar e fechar
    setNewProjectName("");
    setShowCreateDialog(false);
    
    toast.success(`Site "${trimmedName}" criado com sucesso!`);
    
    // Redirecionar para o editor com o novo projeto
    navigate(`/editor?project=${newProject.id}`);
  };

  const deleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects));
    
    // Limpar dados do projeto deletado
    localStorage.removeItem(`editorState-${projectId}`);
    
    toast.success("Site removido");
  };

  const openProject = (projectId: string) => {
    navigate(`/editor?project=${projectId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Meus Sites</h1>
              <p className="text-sm text-muted-foreground mt-1 font-light">
                Gerencie todos os seus projetos
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Novo Site
            </Button>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center mb-6">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum site ainda</h3>
            <p className="text-muted-foreground mb-6 max-w-md text-sm font-light">
              Comece criando seu primeiro site. É rápido, fácil e totalmente
              personalizável!
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Criar Primeiro Site
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden bg-card"
                onClick={() => openProject(project.id)}
              >
                <div className="aspect-video bg-muted flex items-center justify-center border-b border-border">
                  <Globe className="h-12 w-12 text-muted-foreground/40" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-light">
                    <Calendar className="h-3 w-3" />
                    <span>Atualizado {formatDate(project.updatedAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProject(project.id);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => deleteProject(project.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Site</DialogTitle>
            <DialogDescription>
              Escolha um nome para o seu novo site. Você pode alterá-lo depois.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nome do Site</Label>
              <Input
                id="site-name"
                placeholder="Ex: Meu Portfólio, Landing Page..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProject();
                  }
                }}
                maxLength={50}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {newProjectName.length}/50 caracteres
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setNewProjectName("");
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProject}>
              Criar Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
