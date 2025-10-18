export async function gerarPlano(inputs) {

 const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; 

    try {
        const response = await fetch(
        "https://smagkfukisdzjjmedtcs.supabase.co/functions/v1/gerar-plano",
        {
        method: "POST",
        headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(inputs),
                }
            );

    if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro da Edge Function:", response.status, errorText);
    throw new Error(`Erro HTTP: ${response.status}`);
 }

     const data = await response.json();
    
    
    let texto = data?.text || ""; 
    texto = texto.trim();

    if (texto === "") {
        
        throw new Error("A API Gemini não retornou nenhum texto.");
    }

    try {
        
        return JSON.parse(texto);
    } catch (e) {
        
        
        
        let cleanedText = texto.replace(/```json\s*|```/g, '').trim();

        try {
            
            return JSON.parse(cleanedText);
        } catch (error) {
            
            console.error("Texto Bruto (Com falha de JSON):", texto);
            throw new Error("JSON inválido ou formato inesperado no texto retornado.");
        }
    }

     } catch (err) {
     console.error("Erro ao converter JSON:", err);
    
     throw new Error(err.message || "Erro desconhecido ao gerar o plano.");
  }
}