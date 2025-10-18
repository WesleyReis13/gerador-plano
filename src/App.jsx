import PlanoForm from "./components/PlanoForm";
import ListaPlanos from "./components/ListaPlanos";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <PlanoForm />
      <ListaPlanos />
    </div>
  );
}


