CREATE TABLE planos_aula (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tema text NOT NULL,
  faixa_etaria text NOT NULL,
  disciplina text NOT NULL,
  duracao text NOT NULL,
  plano jsonb NOT NULL,
  created_at timestamp DEFAULT now()
);


ALTER TABLE public.planos_aula ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Anon users can insert plans"
ON public.planos_aula FOR INSERT
TO anon WITH CHECK (true);


CREATE POLICY "Anon users can view all plans"
ON public.planos_aula FOR SELECT
TO anon USING (true);