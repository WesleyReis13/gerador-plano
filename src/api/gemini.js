export async function gerarPlano(inputs) {
  try {
    // Prompt estruturado para JSON puro
    const promptTexto = `
Você é um especialista em educação infantil e ensino fundamental, com profundo conhecimento da BNCC. 
Gere um plano de aula completo em JSON puro, sem Markdown ou títulos extras. 
O formato deve ser exatamente este:

{
  "introducao_ludica": "...",
  "objetivo_bncc": "...",
  "passo_a_passo": ["..."],
  "rubrica_avaliacao": ["..."]
}

Informações do usuário:
- Tema: ${inputs.tema}
- Faixa etária: ${inputs.faixa_etaria}
- Disciplina: ${inputs.disciplina}
- Duração: ${inputs.duracao}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        import.meta.env.VITE_GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Estrutura exigida pela Gemini API
          instances: [
            {
              input: promptTexto,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API Gemini:", response.status, errorText);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Extrai o texto da IA
    let texto = data?.candidates?.[0]?.content?.[0]?.text;
    if (!texto) throw new Error("A resposta da IA veio vazia");

    // Remove espaços e quebras de linha no começo e fim
    texto = texto.trim();

    // Tenta parsear diretamente
    try {
      const plano = JSON.parse(texto);
      return plano;
    } catch {
      // Se falhar, tenta extrair JSON dentro do texto (caso IA insira algum comentário)
      const match = texto.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON não encontrado no texto retornado");
      return JSON.parse(match[0]);
    }
  } catch (err) {
    console.error("Erro ao converter JSON:", err);
    return { erro: err.message };
  }
}
