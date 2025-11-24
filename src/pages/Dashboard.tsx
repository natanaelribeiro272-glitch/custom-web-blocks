import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Globe, Calendar, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Carregar projetos salvos do localStorage
    const savedProjects = localStorage.getItem("userProjects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const createNewProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: `Novo Site ${projects.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects));
    
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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold">Meus Sites</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie todos os seus projetos
              </p>
            </div>
            <Button onClick={createNewProject} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Site
            </Button>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum site ainda</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Comece criando seu primeiro site. É rápido, fácil e totalmente
              personalizável!
            </p>
            <Button onClick={createNewProject} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Criar Primeiro Site
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => openProject(project.id)}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 flex items-center justify-center border-b">
                  <Globe className="h-12 w-12 text-primary/40" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>Atualizado {formatDate(project.updatedAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
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
    </div>
  );
};

export default Dashboard;
