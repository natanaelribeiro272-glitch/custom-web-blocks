import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Template {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  template_data: any;
}

export default function AdminTemplates() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Category form
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  // Template form
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategoryId, setTemplateCategoryId] = useState("");
  const [templateData, setTemplateData] = useState("");

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/dashboard");
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
      loadTemplates();
    }
  }, [isAdmin]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("template_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("page_templates")
        .select("*")
        .order("name");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Erro ao carregar templates");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("template_categories")
        .insert({ name: categoryName, description: categoryDescription });

      if (error) throw error;
      
      toast.success("Categoria criada com sucesso!");
      setCategoryName("");
      setCategoryDescription("");
      loadCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Erro ao criar categoria");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria? Todos os templates associados serão excluídos.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("template_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Categoria excluída com sucesso!");
      loadCategories();
      loadTemplates();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Erro ao excluir categoria");
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let parsedData;
    try {
      parsedData = JSON.parse(templateData);
    } catch (error) {
      toast.error("JSON inválido. Verifique o formato dos dados do template.");
      return;
    }

    try {
      const { error } = await supabase
        .from("page_templates")
        .insert({
          name: templateName,
          description: templateDescription,
          category_id: templateCategoryId,
          template_data: parsedData,
        });

      if (error) throw error;
      
      toast.success("Template criado com sucesso!");
      setTemplateName("");
      setTemplateDescription("");
      setTemplateCategoryId("");
      setTemplateData("");
      loadTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar template");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este template?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("page_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Template excluído com sucesso!");
      loadTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir template");
    }
  };

  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category_id === selectedCategory)
    : templates;

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Templates</h1>
        <p className="text-muted-foreground">Crie categorias e templates para os usuários</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Nome da Categoria</Label>
                  <Input
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ex: Landing Page, Portfólio, Site Empresarial"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Descrição</Label>
                  <Textarea
                    id="category-description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Descrição da categoria"
                  />
                </div>
                <Button type="submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Categoria
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Template</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Nome do Template</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: Template Moderno, Template Minimalista"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">Categoria</Label>
                  <Select value={templateCategoryId} onValueChange={setTemplateCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="template-description">Descrição</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Descrição do template"
                  />
                </div>
                <div>
                  <Label htmlFor="template-data">Dados do Template (JSON)</Label>
                  <Textarea
                    id="template-data"
                    value={templateData}
                    onChange={(e) => setTemplateData(e.target.value)}
                    placeholder='{"pages": [{"name": "Home", "blocks": []}]}'
                    className="font-mono text-sm h-40"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Cole os dados do editor aqui em formato JSON
                  </p>
                </div>
                <Button type="submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Template
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex gap-2 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categories.find((c) => c.id === template.category_id)?.name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {template.description && (
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
