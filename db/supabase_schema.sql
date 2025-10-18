create table planos_aula (
  id uuid primary key default gen_random_uuid(),
  tema text not null,
  faixa_etaria text not null,
  disciplina text not null,
  duracao text not null,
  plano jsonb not null,
  created_at timestamp default now()
);
