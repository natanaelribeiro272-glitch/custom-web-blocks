-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create template_categories table
CREATE TABLE public.template_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Anyone can view categories"
ON public.template_categories
FOR SELECT
USING (true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
ON public.template_categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
ON public.template_categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
ON public.template_categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create page_templates table
CREATE TABLE public.page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.template_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;

-- Everyone can view templates
CREATE POLICY "Anyone can view templates"
ON public.page_templates
FOR SELECT
USING (true);

-- Only admins can insert templates
CREATE POLICY "Admins can insert templates"
ON public.page_templates
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update templates
CREATE POLICY "Admins can update templates"
ON public.page_templates
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete templates
CREATE POLICY "Admins can delete templates"
ON public.page_templates
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_template_categories_updated_at
BEFORE UPDATE ON public.template_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_templates_updated_at
BEFORE UPDATE ON public.page_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();