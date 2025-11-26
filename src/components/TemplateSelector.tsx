import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

interface TemplateSelectorProps {
  onSelectTemplate: (templateData: any) => void;
  onStartFromScratch: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onStartFromScratch }: TemplateSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, templatesRes] = await Promise.all([
        supabase.from("template_categories").select("*").order("name"),
        supabase.from("page_templates").select("*").order("name"),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (templatesRes.error) throw templatesRes.error;

      setCategories(categoriesRes.data || []);
      setTemplates(templatesRes.data || []);

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setSelectedCategoryId(categoriesRes.data[0].id);
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Erro ao carregar templates");
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((t) => t.category_id === selectedCategoryId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Escolha um Template</h2>
        <p className="text-muted-foreground">
          Comece com um template pronto ou crie do zero
        </p>
      </div>

      <Button onClick={onStartFromScratch} variant="outline" className="w-full">
        Começar do Zero
      </Button>

      {categories.length > 0 && (
        <Tabs value={selectedCategoryId} onValueChange={setSelectedCategoryId} className="w-full">
          <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}

              {filteredTemplates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum template disponível nesta categoria
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => onSelectTemplate(template.template_data)}
                    >
                      {template.thumbnail_url && (
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                          <img
                            src={template.thumbnail_url}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </CardHeader>
                      {template.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
