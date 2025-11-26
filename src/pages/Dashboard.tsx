import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Trash2, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import TemplateSelector from "@/components/TemplateSelector";

interface Project {
  id: string;
  name: string;
  created_at: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadProjects();
  }, [user, navigate]);

  const loadProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar projetos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleSelectTemplate = (templateData: any) => {
    setSelectedTemplate(templateData);
    setShowCreateDialog(false);
    setShowNameDialog(true);
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setShowCreateDialog(false);
    setShowNameDialog(true);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, dê um nome ao seu projeto.",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    const newProjectId = `project-${Date.now()}`;

    const { error } = await supabase
      .from('projects')
      .insert({
        id: newProjectId,
        user_id: user.id,
        name: newProjectName.trim(),
      });

    if (error) {
      toast({
        title: "Erro ao criar projeto",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Initialize project data in localStorage with template or empty
    const defaultData = {
      pages: [{
        id: "page-1",
        name: "Home",
        backgroundColor: "#ffffff",
        header: {
          template: "none",
          links: [],
        },
        footer: {
          template: "none",
          links: [],
        },
        blocks: [],
      }],
      currentPageId: "page-1",
    };

    const projectData = selectedTemplate || defaultData;
    localStorage.setItem(newProjectId, JSON.stringify(projectData));

    toast({
      title: "Projeto criado!",
      description: `${newProjectName} foi criado com sucesso.`,
    });

    setShowNameDialog(false);
    setNewProjectName("");
    setSelectedTemplate(null);
    loadProjects();
    navigate(`/editor?project=${newProjectId}`);
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro ao excluir projeto",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    localStorage.removeItem(id);
    setProjectToDelete(null);
    loadProjects();
    toast({
      title: "Projeto removido",
      description: "O projeto foi removido com sucesso.",
    });
  };

  const openEditor = (projectId: string) => {
    navigate(`/editor?project=${projectId}`);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Meus Projetos</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              {user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="lg" 
              onClick={() => setShowCreateDialog(true)}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Projeto
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum projeto criado ainda</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Comece criando seu primeiro projeto. É rápido e fácil!
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{project.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => openEditor(project.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir Editor
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 text-destructive hover:text-destructive" 
                    onClick={() => setProjectToDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
            <DialogDescription>
              Escolha um template para começar ou comece do zero
            </DialogDescription>
          </DialogHeader>
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            onStartFromScratch={handleStartFromScratch}
          />
        </DialogContent>
      </Dialog>

      {/* Name Project Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nome do Projeto</DialogTitle>
            <DialogDescription>
              Dê um nome ao seu novo projeto. Você poderá alterá-lo depois.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Nome do Projeto</Label>
              <Input
                id="project-name"
                placeholder="Ex: Meu Portfólio, Loja Virtual, etc."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProject();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProject}>
              Criar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O projeto será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
