import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";

export default function ListaPlanos() {
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    buscarPlanos();
  }, []);

  async function buscarPlanos() {
    const { data, error } = await supabase
      .from("planos_aula")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPlanos(data);
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-3 text-center text-blue-700">
        📚 Planos Gerados
      </h2>

      {planos.length === 0 && (
        <p className="text-center text-gray-500">Nenhum plano ainda.</p>
      )}

      {planos.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded-lg shadow mb-3">
          <h3 className="font-semibold text-blue-600">{p.tema}</h3>
          <p className="text-sm text-gray-600">
            {p.faixa_etaria} • {p.disciplina} • {p.duracao}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-gray-700">
              Ver detalhes
            </summary>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(p.plano, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
}
