import { useState } from "react";
import { gerarPlano } from "../api/gemini";
import { supabase } from "../api/supabase";

export default function PlanoForm() {
  const [inputs, setInputs] = useState({
    tema: "",
    faixa_etaria: "",
    disciplina: "",
    duracao: "",
  });
  const [loading, setLoading] = useState(false);
  const [plano, setPlano] = useState(null);
  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    setPlano(null);

    // 1️⃣ Gera o plano com a IA
    const result = await gerarPlano(inputs);

    if (result.erro) {
      setMensagem(result.erro);
      setLoading(false);
      return;
    }

    setPlano(result);

    // 2️⃣ Salva no Supabase
    const { error } = await supabase.from("planos_aula").insert([
      {
        tema: inputs.tema,
        faixa_etaria: inputs.faixa_etaria,
        disciplina: inputs.disciplina,
        duracao: inputs.duracao,
        plano: result,
      },
    ]);

    if (error) {
      console.error(error);
      setMensagem("Erro ao salvar no banco.");
    } else {
      setMensagem("Plano salvo com sucesso!");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        🧠 Gerador de Plano de Aula com IA
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="tema"
          placeholder="Tema da aula"
          value={inputs.tema}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="faixa_etaria"
          placeholder="Faixa etária (ex: 8 a 9 anos)"
          value={inputs.faixa_etaria}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="disciplina"
          placeholder="Disciplina"
          value={inputs.disciplina}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="duracao"
          placeholder="Duração (ex: 45 minutos)"
          value={inputs.duracao}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Gerando..." : "Gerar e Salvar Plano"}
        </button>
      </form>

      {mensagem && (
        <p
          className={`mt-4 text-center ${
            mensagem.includes("erro") ? "text-red-500" : "text-green-600"
          }`}
        >
          {mensagem}
        </p>
      )}

      {plano && !plano.erro && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Plano Gerado
          </h2>

          <p>
            <strong>Introdução lúdica:</strong> {plano.introducao_ludica}
          </p>
          <p className="mt-2">
            <strong>Objetivo BNCC:</strong> {plano.objetivo_bncc}
          </p>

          <div className="mt-2">
            <strong>Passo a passo:</strong>
            <ul className="list-disc ml-6">
              {plano.passo_a_passo?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="mt-2">
            <strong>Rubrica de Avaliação:</strong>
            <ul className="list-disc ml-6">
              {plano.rubrica_avaliacao?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
