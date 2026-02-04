import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MacroPesoApp from "@/components/MacroPesoApp";
import { supabase } from "@/supabaseClient";

const STORAGE_KEY = "macropeso_auth_email_v1";

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function isExpired(dateStr) {
  if (!dateStr) return false; // sem expiração = válido
  const exp = new Date(dateStr).getTime();
  if (Number.isNaN(exp)) return true;
  return exp < Date.now();
}

function AccessGate({ children }) {
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [error, setError] = useState("");

  // tenta auto-logar se tiver email salvo
  useEffect(() => {
    const fromStorage = normalizeEmail(localStorage.getItem(STORAGE_KEY));
    if (fromStorage) setSavedEmail(fromStorage);
    setCheckingSaved(false);
  }, []);

  async function checkAccess(targetEmail) {
    const e = normalizeEmail(targetEmail);
    if (!e.includes("@")) {
      throw new Error("Digite um e-mail válido.");
    }

    // Busca no Supabase
    const { data, error: supaErr } = await supabase
      .from("acessos_kiwify")
      .select("ativo, data_expiracao")
      .eq("email", e)
      .maybeSingle();

    if (supaErr) {
      // erro de permissão / RLS / etc
      throw new Error("Erro ao consultar acesso no Supabase. Verifique RLS/policies e permissões.");
    }

    if (!data) {
      throw new Error("E-mail não encontrado como comprador.");
    }

    if (data.ativo !== true) {
      throw new Error("Acesso inativo para este e-mail.");
    }

    if (isExpired(data.data_expiracao)) {
      throw new Error("Acesso expirado para este e-mail.");
    }

    return true;
  }

  // auto-check do email salvo
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!savedEmail) return;
      try {
        setLoading(true);
        setError("");
        await checkAccess(savedEmail);
        if (cancelled) return;
        localStorage.setItem(STORAGE_KEY, savedEmail);
        setEmail(savedEmail);
      } catch (err) {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
        setSavedEmail("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [savedEmail]);

  const isAuthed = useMemo(() => {
    const stored = normalizeEmail(localStorage.getItem(STORAGE_KEY));
    return stored && stored === normalizeEmail(email);
  }, [email]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const e2 = normalizeEmail(email);
      await checkAccess(e2);
      localStorage.setItem(STORAGE_KEY, e2);
      setEmail(e2);
    } catch (err) {
      setError(err?.message || "Erro ao validar e-mail.");
    } finally {
      setLoading(false);
    }
  }

  function sair() {
    localStorage.removeItem(STORAGE_KEY);
    setEmail("");
    setSavedEmail("");
    setError("");
  }

  if (checkingSaved || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Carregando...</div>
          <div style={{ opacity: 0.7 }}>Validando acesso</div>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui" }}>
        <div style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Acesso MacroPeso</div>
          <div style={{ opacity: 0.7, marginBottom: 16 }}>Digite o e-mail usado na compra</div>

          <form onSubmit={onSubmit}>
            <input
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="seuemail@dominio.com"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.18)",
                outline: "none",
                fontSize: 14
              }}
            />

            {error && (
              <div style={{ marginTop: 12, color: "#b00020", fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: 14,
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                background: "#0f766e",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Entrar
            </button>
          </form>

          <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7 }}>
            Se você acabou de comprar, aguarde a liberação do e-mail.
          </div>
        </div>
      </div>
    );
  }

  // autorizado
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "10px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "system-ui"
      }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Logado como: <b>{normalizeEmail(localStorage.getItem(STORAGE_KEY))}</b>
        </div>
        <button
          onClick={sair}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.14)",
            background: "white",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 12
          }}
        >
          Sair
        </button>
      </div>

      {children}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AccessGate>
              <MacroPesoApp />
            </AccessGate>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
