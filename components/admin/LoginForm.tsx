"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin.module.css";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setEntrando(true);
    setErro(null);

    const resultado = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (!resultado || resultado.error) {
      setErro("E-mail ou senha inválidos.");
      setEntrando(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.loginMarca} aria-hidden="true">
        {/* Fio de contas da marca, o mesmo elemento que separa as seções da loja. */}
        <svg viewBox="0 0 60 16" width="60" height="16">
          <circle cx="6" cy="8" r="3" fill="var(--contorno-forte)" opacity="0.5" />
          <circle cx="18" cy="8" r="4" fill="var(--contorno-forte)" opacity="0.75" />
          <circle cx="30" cy="8" r="5" fill="var(--contorno-forte)" />
          <circle cx="42" cy="8" r="4" fill="var(--contorno-forte)" opacity="0.75" />
          <circle cx="54" cy="8" r="3" fill="var(--contorno-forte)" opacity="0.5" />
        </svg>
      </div>
      <p className={styles.loginSaudacao}>bem-vinda(o) de volta</p>
      <h1 className={styles.loginTitulo}>Painel Dona Frida</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && <span className={styles.formError}>{erro}</span>}

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary} disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
