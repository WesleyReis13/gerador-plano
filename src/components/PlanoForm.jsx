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
      setErro("Ocorreu um erro ao gerar o plano. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Planos de Aula</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Tema"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Faixa Etária"
          value={faixaEtaria}
          onChange={(e) => setFaixaEtaria(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Disciplina"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Duração"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar Plano"}
        </button>
      </form>

      {erro && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Erro: {erro}
        </div>
      )}

      {plano && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Plano Gerado:</h2>
          <p><strong>Introdução lúdica:</strong> {plano.introducao_ludica}</p>
          <p><strong>Objetivo BNCC:</strong> {plano.objetivo_bncc}</p>
          <p><strong>Passo a passo:</strong></p>
          <ul className="list-disc list-inside">
            {plano.passo_a_passo.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p><strong>Rubrica de avaliação:</strong></p>
          <ul className="list-disc list-inside">
            {plano.rubrica_avaliacao.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
