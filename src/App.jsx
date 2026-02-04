import { useState } from "react";
import { supabase } from "./supabaseClient";
import MacroPesoApp from "./components/MacroPesoApp";

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
      .select("*")
      .eq("email", email)
      .eq("ativo", true)
      .single();

    if (error || !data) {
      setErro("Acesso não liberado para este e-mail.");
      setLoading(false);
      return;
    }

    // opcional: checar data de expiração
    if (data.data_expiracao && new Date(data.data_expiracao) < new Date()) {
      setErro("Seu acesso expirou.");
      setLoading(false);
      return;
    }

    setLiberado(true);
    setLoading(false);
  }

  // 🔒 TELA DE LOGIN
  if (!liberado) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "#fff"
      }}>
        <div style={{
          background: "#020617",
          padding: 32,
          borderRadius: 12,
          width: 320
        }}>
          <h2 style={{ marginBottom: 16 }}>Acesso MacroPeso</h2>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 12,
              borderRadius: 6,
              border: "none"
            }}
          />

          <button
            onClick={verificarAcesso}
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "none",
              background: "#22c55e",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>

          {erro && (
            <p style={{ color: "#f87171", marginTop: 12 }}>
              {erro}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ✅ LIBERADO → CALCULADORA
  return <MacroPesoApp />;
}
