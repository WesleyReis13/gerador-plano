# 1. Escolha e Justificativa do Modelo de Inteligência Artificial

Para a implementação do Gerador de Planos de Aula, foi escolhido o modelo **Gemini 2.5 Flash** do Google AI.

## Modelo Escolhido: `gemini-2.5-flash`

O modelo `gemini-2.5-flash` foi selecionado devido ao seu equilíbrio ideal entre **velocidade**, **custo-benefício** e **capacidade de raciocínio**, alinhado aos requisitos do projeto.

## Justificativas Técnicas

A escolha do `gemini-2.5-flash` se baseia nos seguintes pilares:

### 1. Velocidade e Latência (Performance)

O **Flash** é o modelo mais rápido da família Gemini 2.5, otimizado para tarefas de inferência de alta velocidade.  
Para uma aplicação frontend interativa, onde o usuário espera um retorno imediato ao clicar no botão "Gerar Plano", a **baixa latência** é crucial para garantir uma excelente **Experiência do Usuário (UX)**.

### 2. Custo-Benefício (Eficiência)

Como o projeto utiliza a **API do Gemini no tier gratuito**, o modelo Flash permite o processamento de um volume significativamente maior de requisições e tokens dentro dos limites do nível gratuito, em comparação com modelos mais robustos como o **Pro**.  
Isso garante a **sustentabilidade da aplicação** em um ambiente de teste ou de baixo tráfego.

### 3. Capacidade de Raciocínio Estruturado (Seguimento de Instruções)

Embora seja o modelo mais leve, o Gemini 2.5 Flash mantém uma forte capacidade de **seguir instruções complexas e estruturadas**.  
Isso foi fundamental para:

- **Geração de Conteúdo Educacional**: Gerar a "Introdução lúdica", "Objetivo da BNCC" e "Rubrica de avaliação" com qualidade e relevância educacional.  
- **Formato de Saída (JSON)**: O Flash é altamente capaz de aderir ao requisito de **saída JSON puro**. A capacidade do modelo de seguir as instruções do prompt para **formatar os dados corretamente** foi essencial para que o parsing no frontend funcionasse após a implementação da lógica de limpeza.

---

Em suma, o Gemini 2.5 Flash foi a escolha ideal por ser **rápido e econômico**, ao mesmo tempo em que demonstrou a **inteligência necessária** para realizar a tarefa de **estruturação de dados** e **criação de conteúdo**.
