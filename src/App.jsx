import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import MacroPesoApp from "@/components/MacroPesoApp";
import { supabase } from "./supabaseClient";

function AccessGate({ children }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | ok | denied | error
  const [msg, setMsg] = useState("");

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  async function checkEmail(e) {
    e?.preventDefault?.();

    const em = normalizedEmail;
    if (!em || !em.includes("@")) {
      setStatus("denied");
      setMsg("Digite um e-mail válido.");
      return;
    }

    setStatus("checking");
    setMsg("");

    try {
      const { data, error } = await supabase
        .from("acessos_kiwify")
        .select("email, ativo, data_expiracao")
        .eq("email", em)
        .maybeSingle();

      if (error) {
        setStatus("error");
        setMsg("Erro ao consultar o acesso. (RLS/Policy/Conexão)");
        return;
      }

      if (!data) {
        setStatus("denied");
        setMsg("E-mail não encontrado na lista de compradores.");
        return;
      }

      const ativo = !!data.ativo;

      // data_expiracao pode ser null
      const exp = data.data_expiracao ? new Date(data.data_expiracao).getTime() : null;
      const now = Date.now();
      const naoExpirou = exp === null || exp > now;

      if (ativo && naoExpirou) {
        localStorage.setItem("mp_access_email", em);
        setStatus("ok");
        setMsg("");
        return;
      }

      setStatus("denied");
      setMsg("Acesso inativo ou expirado.");
    } catch (err) {
      setStatus("error");
      setMsg("Erro inesperado ao validar acesso.");
    }
  }

  async function autoCheck() {
    const saved = (localStorage.getItem("mp_access_email") || "").trim().toLowerCase();
    if (!saved) return;
    setEmail(saved);
    // valida de verdade também (não confia só no localStorage)
    setStatus("checking");
    setMsg("");

    try {
      const { data, error } = await supabase
        .from("acessos_kiwify")
        .select("email, ativo, data_expiracao")
        .eq("email", saved)
        .maybeSingle();

      if (error || !data) {
        setStatus("idle");
        return;
      }

      const ativo = !!data.ativo;
      const exp = data.data_expiracao ? new Date(data.data_expiracao).getTime() : null;
      const now = Date.now();
      const naoExpirou = exp === null || exp > now;

      if (ativo && naoExpirou) setStatus("ok");
      else setStatus("idle");
    } catch {
      setStatus("idle");
    }
  }

  function logout() {
    localStorage.removeItem("mp_access_email");
    setStatus("idle");
    setMsg("");
    setEmail("");
  }

  useEffect(() => {
    autoCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "ok") {
    return (
      <div className="min-h-screen">
        <div style={{ position: "fixed", top: 12, right: 12, zIndex: 9999 }}>
          <button
            onClick={logout}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Sair
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 18,
        background: "#0b1220",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 18px 60px rgba(0,0,0,.35)",
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>
          Acesso MacroPeso
        </h1>
        <p style={{ marginTop: 0, marginBottom: 14, color: "#444" }}>
          Digite o e-mail usado na compra para liberar a calculadora.
        </p>

        <form onSubmit={checkEmail} style={{ display: "grid", gap: 10 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            autoComplete="email"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />

          <button
            type="submit"
            disabled={status === "checking"}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
              opacity: status === "checking" ? 0.7 : 1,
            }}
          >
            {status === "checking" ? "Verificando..." : "Entrar"}
          </button>

          {(status === "denied" || status === "error") && (
            <div
              style={{
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#9a3412",
                padding: 12,
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Helmet>
        <title>MacroPeso</title>
      </Helmet>

      <AccessGate>
        <MacroPesoApp />
      </AccessGate>
    </>
  );
}
