import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import MacroPesoApp from "./components/MacroPesoApp";

// 🔑 Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [liberado, setLiberado] = useState(false);
  const [erro, setErro] = useState("");

  async function verificarAcesso() {
    setLoading(true);
    setErro("");

    const { data, error } = await supabase
      .from("acessos_kiwify")
      .select("email")
      .eq("email", email)
      .eq("ativo", true)
      .maybeSingle();

    if (error || !data) {
      setErro("Acesso não autorizado para este email.");
      setLoading(false);
      return;
    }

    setLiberado(true);
    setLoading(false);
  }

  // 🔒 BLOQUEIO
  if (!liberado) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#fff",
        flexDirection: "column",
        gap: "12px"
      }}>
        <h2>🔐 Acesso restrito</h2>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            width: "260px",
            borderRadius: "6px",
            border: "none"
          }}
        />

        <button
          onClick={verificarAcesso}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>

        {erro && <p style={{ color: "#f87171" }}>{erro}</p>}
      </div>
    );
  }

  // ✅ LIBERADO
  return <MacroPesoApp />;
}
