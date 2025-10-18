# 🚀 Gerador de Planos de Aula com Inteligência Artificial

Este projeto implementa um sistema completo para gerar planos de aula personalizados, utilizando o modelo **Gemini 2.5 Flash** e a infraestrutura **serverless do Supabase** para backend e persistência de dados.

---

## 📑 Índice

1. [Requisitos Técnicos](#1-requisitos-técnicos)  
2. [Arquitetura e Stack](#2-arquitetura-e-stack)  
3. [Decisões Técnicas Tomadas](#3-decisões-técnicas-tomadas)  
   - [3.1. Escolha do Modelo IA (Gemini 2.5 Flash)](#31-escolha-do-modelo-ia-gemini-25-flash)  
   - [3.2. Arquitetura Serverless (Edge Function e Segurança)](#32-arquitetura-serverless-edge-function-e-segurança)  
   - [3.3. Tratamento de Saída JSON](#33-tratamento-de-saída-json)  
4. [Desafios Encontrados e Soluções](#4-desafios-encontrados-e-soluções)  
5. [Instruções de Setup](#5-instruções-de-setup)  
   - [5.1. Variáveis de Ambiente](#51-variáveis-de-ambiente)  
   - [5.2. Execução do Projeto](#52-execução-do-projeto)  
6. [Modelagem de Dados (SQL e RLS)](#6-modelagem-de-dados-sql-e-rls)  
7. [Acessos e Credenciais para Avaliação](#7-acessos-e-credenciais-para-avaliação)  
8. [Conclusão](#📘-conclusão)

---

## 1. Requisitos Técnicos

O sistema gera um plano de aula estruturado com os seguintes componentes:

- 🎲 **Introdução lúdica:** Forma criativa e engajadora de apresentar o tema.  
- 🎯 **Objetivo de aprendizagem da BNCC:** Alinhado à Base Nacional Comum Curricular.  
- 🧩 **Passo a passo da atividade:** Roteiro detalhado para execução.  
- 📝 **Rubrica de avaliação:** Critérios para a professora avaliar o aprendizado.

---

## 2. Arquitetura e Stack

| Componente | Tecnologia | Uso |
|-------------|-------------|-----|
| **Frontend** | React (Hooks e Componentes) | Interface de entrada de dados e exibição do plano. |
| **Backend / Serverless** | Supabase Edge Functions (Deno / TypeScript) | Lógica de comunicação segura com a Gemini API. |
| **Banco de Dados** | Supabase (PostgreSQL) | Persistência dos planos de aula gerados. |
| **Inteligência Artificial** | Google Gemini API (gemini-2.5-flash) | Geração do conteúdo estruturado via prompt engineering. |

---

## 3. Decisões Técnicas Tomadas

### 3.1. Escolha do Modelo IA (Gemini 2.5 Flash)

O modelo **Gemini 2.5 Flash** foi escolhido em detrimento do *Gemini 2.5 Pro* ou modelos legados, principalmente por:

- ⚡ **Baixa latência:** Essencial para uma aplicação de tempo real, proporcionando retorno rápido ao usuário.  
- 💰 **Custo-benefício:** Alta performance a custo reduzido, ideal para o nível gratuito da API.  
- 🧩 **Fidelidade ao formato:** Excelente capacidade de seguir instruções e gerar JSON válido, fundamental para automação no frontend.

---

### 3.2. Arquitetura Serverless (Edge Function e Segurança)

O uso de uma **Edge Function** chamada `gerar-plano` foi uma decisão de segurança e arquitetura essencial:

- 🔒 **Ocultação da chave API:** A variável `GEMINI_API_KEY` é armazenada com segurança nas *Secrets* do Supabase e nunca é exposta no frontend.  
- 🌐 **CORS e Proxy:** A Edge Function atua como um *proxy* seguro, evitando problemas de CORS e permitindo comunicação limpa com a Gemini API via Deno.  
- 🧱 **Defesa em Profundidade (RLS):** O *Row Level Security (RLS)* foi ativado na tabela `planos_aula`, garantindo que apenas `INSERT` e `SELECT` sejam permitidos para o papel `anon`, mesmo que a chave pública seja exposta.

---

### 3.3. Tratamento de Saída JSON

Para garantir que a resposta da IA seja convertida corretamente em objeto JavaScript, foi implementada uma lógica de limpeza no arquivo `gemini.js`.

**Problema:**  
Modelos de linguagem frequentemente envolvem a saída JSON em blocos Markdown (` ```json ... ``` `).

**Solução:**  
Uso de uma expressão regular (Regex) para limpar essas marcações:

```javascript
.replace(/```json\s*|```/g, '')
```

Isso garante que o `JSON.parse()` funcione corretamente, mesmo com saída formatada.

---

## 4. Desafios Encontrados e Soluções

| Desafio | Solução Implementada |
|----------|----------------------|
| **Autenticação e CORS (Inicial)** | Uso da Edge Function do Supabase, que age como proxy seguro. A requisição do frontend usa a `SUPABASE_ANON_KEY` no cabeçalho de autorização. |
| **Erros de Sintaxe da API (400 / 404)** | Simplificação extrema do payload, focando apenas no corpo `contents` e removendo configurações complexas. |
| **Erro JSON não encontrado (500 lógico)** | Implementação da lógica de limpeza via Regex no `gemini.js`, garantindo o `JSON.parse()` correto. |
| **Exibição de Negrito do Markdown** | Uso de `dangerouslySetInnerHTML` no React com uma Regex de substituição (`**texto** → <strong>texto</strong>`) para renderizar o negrito corretamente no frontend. |

---

## 5. Instruções de Setup

### 5.1. Variáveis de Ambiente

As variáveis abaixo devem ser configuradas antes da execução:

| Variável | Uso | Fonte |
|-----------|------|-------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase | Painel do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) | Painel do Supabase |
| `(Edge Function) GEMINI_API_KEY` | Chave da API do Google Gemini | Google AI Studio |

💡 **Nota de Segurança:**  
A variável `GEMINI_API_KEY` deve ser configurada nas **Secrets do Supabase**, e **não** no arquivo `.env` local, para manter o segredo seguro no lado do servidor.  
O arquivo `.env` foi adicionado ao `.gitignore`.

---

### 5.2. Execução do Projeto

**Clone o repositório:**
```bash
git clone https://github.com/WesleyReis13/gerador-plano.git
```

**Instale as dependências:**
```bash
npm install
# ou
yarn install
```

**Execute o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

O projeto estará acessível em:  
👉 [http://localhost:5173](http://localhost:5173)

---

## 6. Modelagem de Dados (SQL e RLS)

A estrutura do banco de dados consiste em uma tabela única chamada `planos_aula`, otimizada para armazenar os dados de entrada e a saída estruturada da IA.

📜 **Script SQL Completo (`db/supabase_schema.sql`):**
```sql
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
```

### 🧱 Estrutura de Dados

| Campo | Tipo | Descrição |
|--------|------|------------|
| `id` | uuid | Chave primária. |
| `tema` | text | Tema do plano (input do usuário). |
| `faixa_etaria` | text | Faixa etária alvo. |
| `disciplina` | text | Disciplina aplicada. |
| `duracao` | text | Duração da atividade. |
| `plano` | jsonb | Objeto JSON completo do plano gerado pela IA. |
| `created_at` | timestamp | Data e hora da inserção. |

---

## 7. Acessos e Credenciais para Avaliação

| Item | Valor | Observação |
|------|--------|-------------|
| **URL da Aplicação (Deploy)** | [INSIRA O LINK DO SEU DEPLOY AQUI (Vercel/Netlify)] | Link principal para acessar a interface. |
| **Credenciais de Teste** | Não é necessário. | A aplicação utiliza o papel `anon` e RLS. |
| **URL da API (PostgREST)** | [INSIRA O VALOR DE `VITE_SUPABASE_URL` AQUI] | Endereço do endpoint público da sua base de dados. |
| **Chave Pública (ANON Key)** | [INSIRA O VALOR DE `VITE_SUPABASE_ANON_KEY` AQUI] | Chave de acesso público, usada para autenticar a API. |

---

## 📘 Conclusão

O **Gerador de Planos de Aula com IA** é um projeto moderno que combina a inteligência generativa do **Gemini** com a eficiência **serverless do Supabase**, oferecendo uma solução prática, segura e escalável para professores e desenvolvedores.

---
