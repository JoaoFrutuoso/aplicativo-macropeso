import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ENV (Hostinger / Vite)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export default function App() {
  const supabase = useMemo(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }, []);

  const [loading, setLoading] = useState(true);

  // Auth
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(null);

  // Gate
  const [isAllowed, setIsAllowed] = useState(null);
  const [gateTitle, setGateTitle] = useState("");
  const [gateError, setGateError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);

  const [screen, setScreen] = useState("home");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsAllowed(null);
      setGateTitle("");
      setGateError("");
      setExpiresAt(null);
    });

    return () => sub.subscription?.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    if (!session?.user?.email) return;

    const run = async () => {
      setIsAllowed(null);
      setGateTitle("");
      setGateError("");
      setExpiresAt(null);

      const userEmail = session.user.email.toLowerCase().trim();

      const { data, error } = await supabase
        .from("entitlements")
        .select("email,status,expires_at")
        .eq("email", userEmail)
        .maybeSingle();

      if (error) {
        setIsAllowed(false);
        setGateTitle("Erro ao validar acesso");
        setGateError("Não consegui validar seu acesso agora. Tente novamente.");
        return;
      }

      if (!data) {
        setIsAllowed(false);
        setGateTitle("Acesso não liberado");
        setGateError("Pagamento não encontrado para este e-mail.");
        return;
      }

      if ((data.status || "").toLowerCase() !== "active") {
        setIsAllowed(false);
        setGateTitle("Acesso bloqueado");
        setGateError("Seu acesso está inativo. Fale com o suporte.");
        return;
      }

      const exp = data.expires_at ? new Date(data.expires_at) : null;
      setExpiresAt(exp ? exp.toISOString() : null);

      if (!exp) {
        setIsAllowed(false);
        setGateTitle("Acesso inválido");
        setGateError("Registro sem validade (expires_at). Precisa corrigir no banco.");
        return;
      }

      const now = new Date();
      if (exp.getTime() <= now.getTime()) {
        setIsAllowed(false);
        setGateTitle("Acesso expirado");
        setGateError("Seu acesso de 12 meses expirou. Renove para continuar usando.");
        return;
      }

      setIsAllowed(true);
    };

    run();
  }, [supabase, session]);

  const sendLoginLink = async () => {
    if (!supabase) return alert("Supabase não configurado (VITE_...).");

    const userEmail = email.toLowerCase().trim();
    if (!userEmail.includes("@")) return alert("Digite um e-mail válido.");

    // DEBUG rápido: mostra de onde o app está rodando
    console.log("origin:", window.location.origin);
    console.log("supabase url:", SUPABASE_URL);

    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        shouldCreateUser: true,
      },
    });

    if (error) return alert("Erro ao enviar link: " + error.message);
    alert("Te enviei um link/código no e-mail. Abra para entrar.");
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setScreen("home");
  };

  if (loading) return <Page><p>Carregando...</p></Page>;

  if (!supabase) {
    return (
      <Page>
        <h1>Balança (MacroPeso)</h1>
        <p style={{ color: "#b91c1c" }}>
          Falta configurar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
        </p>
      </Page>
    );
  }

  if (!session) {
    return (
      <Page>
        <h1>Balança (MacroPeso)</h1>
        <p>Entre com seu e-mail para acessar.</p>

        <div style={card}>
          <label style={label}>E-mail</label>
          <input
            style={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@gmail.com"
          />
          <button style={btn} onClick={sendLoginLink}>
            Enviar link de acesso
          </button>

          <p style={{ fontSize: 12, color: "#64748b", marginTop: 10 }}>
            * Use o mesmo e-mail do pagamento na Kiwify. Acesso válido por 12 meses.
          </p>
        </div>
      </Page>
    );
  }

  if (isAllowed === null) {
    return (
      <Page>
        <TopBar email={session.user.email} expiresAt={expiresAt} onLogout={logout} />
        <p>Validando seu pagamento e sua validade...</p>
      </Page>
    );
  }

  if (isAllowed === false) {
    return (
      <Page>
        <TopBar email={session.user.email} expiresAt={expiresAt} onLogout={logout} />
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>{gateTitle || "Acesso bloqueado"}</h2>
          <p>{gateError || "Acesso não liberado."}</p>
          <p style={{ fontSize: 12, color: "#64748b" }}>
            Dica: confirme se entrou com o MESMO e-mail usado no checkout.
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar email={session.user.email} expiresAt={expiresAt} onLogout={logout} />

      {screen === "home" && (
        <>
          <h1>Balança Nutricional</h1>
          <div style={{ display: "grid", gap: 12, maxWidth: 360 }}>
            <button style={btn} onClick={() => setScreen("calculadora")}>
              Calculadora (TACO)
            </button>
            <button style={btn} onClick={() => setScreen("substituicao")}>
              Substituição (TACO)
            </button>
            <button style={btn2} onClick={() => setScreen("receita")}>
              Modo Receita (Peso)
            </button>
          </div>
        </>
      )}

      {screen === "calculadora" && (
        <Section title="Calculadora (TACO)" onBack={() => setScreen("home")}>
          <p>Macro↔Macro: pronto → cru, usando SOMENTE TACO.</p>
        </Section>
      )}

      {screen === "substituicao" && (
        <Section title="Substituição (TACO)" onBack={() => setScreen("home")}>
          <p>Substituição mantendo macro dominante, usando SOMENTE TACO.</p>
        </Section>
      )}

      {screen === "receita" && (
        <Section title="Modo Receita (Peso)" onBack={() => setScreen("home")}>
          <p>Peso↔Peso por rendimento e modo de cocção.</p>
        </Section>
      )}
    </Page>
  );
}

function TopBar({ email, expiresAt, onLogout }) {
  const expText = expiresAt ? formatBR(expiresAt) : null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
      <div style={{ fontSize: 14, color: "#334155" }}>
        Logado: <b>{email}</b>
        {expText && (
          <span style={{ marginLeft: 10, fontSize: 12, color: "#64748b" }}>
            Validade: <b>{expText}</b>
          </span>
        )}
      </div>
      <button style={btnSmall} onClick={onLogout}>Sair</button>
    </div>
  );
}

function Section({ title, onBack, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <button style={btnSmall} onClick={onBack}>← Voltar</button>
      <h2>{title}</h2>
      <div style={card}>{children}</div>
    </div>
  );
}

function Page({ children }) {
  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 720, margin: "0 auto" }}>
      {children}
    </div>
  );
}

function formatBR(isoOrDate) {
  const d = new Date(isoOrDate);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const card = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 16,
  maxWidth: 520,
  background: "#fff",
};

const label = { display: "block", fontSize: 12, color: "#475569", marginBottom: 6 };

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  outline: "none",
};

const btn = {
  marginTop: 12,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "#4f46e5",
  color: "#fff",
  fontWeight: 700,
};

const btn2 = { ...btn, background: "#0f172a" };

const btnSmall = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  cursor: "pointer",
  background: "#fff",
};
