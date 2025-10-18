import { useState } from "react";
import { gerarPlano } from "../api/gemini";
import { supabase } from "../api/supabase";

export default function PlanoForm() {
  const [tema, setTema] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [duracao, setDuracao] = useState("");
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setPlano(null);

    try {
      
      const resultado = await gerarPlano({ tema, faixa_etaria: faixaEtaria, disciplina, duracao });

      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }

      setPlano(resultado);

      
      
      const { data, error } = await supabase
        .from("planos_aula")
        .insert([
          {
            tema,
            faixa_etaria: faixaEtaria,
            disciplina,
            duracao,
            plano: resultado,
          },
        ]);

      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
      } else {
        console.log("Plano salvo com sucesso:", data);
      }
    } catch (err) {
      console.error("Erro no handleSubmit:", err);
      
      setErro("Ocorreu um erro ao gerar o plano. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8"> 
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Gerador de Planos de Aula
      </h1>
      
      
      <form onSubmit={handleSubmit} className="space-y-4"> 
        <input
          type="text"
          placeholder="Tema"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          
          className="border p-3 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500" 
          required
        />
        <input
          type="text"
          placeholder="Faixa Etária"
          value={faixaEtaria}
          onChange={(e) => setFaixaEtaria(e.target.value)}
          className="border p-3 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500" 
          required
        />
        <input
          type="text"
          placeholder="Disciplina"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          className="border p-3 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500" 
          required
        />
        <input
          type="text"
          placeholder="Duração"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          className="border p-3 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500" 
          required
        />
        <button
          type="submit"
          disabled={loading}
          
          className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg w-full transition duration-150 ease-in-out hover:bg-blue-700 disabled:opacity-50" 
        >
          {loading ? "Gerando..." : "Gerar Plano"}
        </button>
      </form>

      
      {erro && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
          <p className="font-bold">Houve um erro! 😔</p>
          <p>Detalhe: {erro}</p>
        </div>
      )}

      
      {plano && (
        
        <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Plano de Aula Gerado 🚀</h2>
          
          <div className="space-y-4">
            <p><strong>Introdução lúdica:</strong> {plano.introducao_ludica}</p>
            <p><strong>Objetivo BNCC:</strong> {plano.objetivo_bncc}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Passo a passo:</h3>
            <ul className="list-decimal list-outside ml-5 space-y-2">
              {plano.passo_a_passo.map((item, idx) => (
                <li key={idx} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Rubrica de avaliação:</h3>
            <ul className="list-disc list-outside ml-5 space-y-2">
              {plano.rubrica_avaliacao.map((item, idx) => (
                <li key={idx} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}