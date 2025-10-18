const PROMPT_BASE = `
Você é um especialista em educação infantil e ensino fundamental, com profundo conhecimento da BNCC (Base Nacional Comum Curricular).  
Sua tarefa é gerar um plano de aula completo e criativo, baseado nas informações fornecidas pelo usuário.  

Responda somente no formato JSON, seguindo exatamente esta estrutura:

{
  "introducao_ludica": "Texto criativo e envolvente que apresente o tema da aula.",
  "objetivo_bncc": "Objetivo de aprendizagem da BNCC correspondente ao tema e à faixa etária.",
  "passo_a_passo": [
    "Etapa 1 - descrição da atividade inicial",
    "Etapa 2 - descrição da atividade principal",
    "Etapa 3 - encerramento e discussão"
  ],
  "rubrica_avaliacao": [
    "Critério 1 - o que será avaliado e como",
    "Critério 2 - o que será avaliado e como",
    "Critério 3 - o que será avaliado e como"
  ]
}

Agora gere o plano de aula de forma inspiradora e adequada ao contexto informado.
Informações fornecidas pelo usuário:
- Tema: {{tema}}
- Faixa etária: {{faixa_etaria}}
- Disciplina: {{disciplina}}
- Duração: {{duracao}}
`;

export async function gerarPlano(inputs) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
  
  const body = {
    contents: [
      {
        parts: [
          {
            text: PROMPT_BASE
              .replace("{{tema}}", inputs.tema)
              .replace("{{faixa_etaria}}", inputs.faixa_etaria)
              .replace("{{disciplina}}", inputs.disciplina)
              .replace("{{duracao}}", inputs.duracao)
          }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
    return JSON.parse(texto);
  } catch (err) {
    console.error("Erro ao converter JSON:", err);
    return { erro: "Erro ao gerar o plano. Tente novamente." };
  }
}
