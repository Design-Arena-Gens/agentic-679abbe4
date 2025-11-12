"use client";

import { useMemo, useState } from "react";
import { z } from "zod";

const strategySchema = z.object({
  profile: z.enum(["Scalping", "Day Trade", "Swing"]),
  capital: z.number().min(100),
  riskPerTrade: z.number().min(0.1).max(5),
  indicators: z.array(z.string()).min(1),
  session: z.enum(["Londres", "Nova York", "Tóquio"]),
  automationLevel: z.enum(["Manual", "Semi-Autônomo", "Total"])
});

const indicatorOptions = [
  "Média Móvel Exponencial (EMA)",
  "Índice de Força Relativa (RSI)",
  "Bandas de Bollinger",
  "Parabolic SAR",
  "MACD"
];

const riskNotes: Record<string, string> = {
  Scalping: "Aproveite spreads baixos e priorize execução em contas ECN.",
  "Day Trade": "Combine confirmação de tendência com filtro de volatilidade.",
  Swing: "Busque confluência em timeframes H4 e D1, validando suporte/resistência."
};

const automationTips: Record<string, string> = {
  Manual: "Ideal para traders discricionários que buscam validar regras.",
  "Semi-Autônomo": "Automatize entradas/saídas e mantenha supervisão humana para ajustes.",
  Total: "Garanta backtests robustos em M1/M5 e monitore métricas de drawdown semanal."
};

const sessionCharacteristics: Record<string, string> = {
  Londres: "Alta liquidez em pares EUR/GBP, volatilidade consistente.",
  "Nova York": "Maior volume em USD, ideal para continuidades ou reversões pós-Londres.",
  "Tóquio": "Mercado mais técnico, spreads mais altos, pares JPY responsivos." 
};

type StrategyInput = z.infer<typeof strategySchema>;

export default function HomePage() {
  const [form, setForm] = useState<StrategyInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const defaultState: StrategyInput = useMemo(
    () => ({
      profile: "Day Trade",
      capital: 1000,
      riskPerTrade: 1,
      indicators: [indicatorOptions[0], indicatorOptions[1]],
      session: "Londres",
      automationLevel: "Semi-Autônomo"
    }),
    []
  );

  const handleChange = (partial: Partial<StrategyInput>) => {
    setForm(prev => ({ ...(prev ?? defaultState), ...partial }));
  };

  const parseNumber = (value: string, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const buildStrategy = (input: StrategyInput) => {
    const riskCapital = (input.capital * input.riskPerTrade) / 100;
    const stopLossPips = input.profile === "Scalping" ? 8 : input.profile === "Day Trade" ? 20 : 45;
    const takeProfitMultiplier = input.profile === "Scalping" ? 1.2 : input.profile === "Day Trade" ? 2 : 2.8;
    const lotSize = Number((riskCapital / (stopLossPips * 1.5)).toFixed(2));

    return `Estratégia ${input.profile} ${input.session}\n` +
      `- Indicadores principais: ${input.indicators.join(", ")}\n` +
      `- Sessão: ${sessionCharacteristics[input.session]}\n` +
      `- Risco por trade: ${input.riskPerTrade.toFixed(2)}% (${riskCapital.toFixed(2)} USD)\n` +
      `- Stop loss médio: ${stopLossPips} pips | Take profit: ${(stopLossPips * takeProfitMultiplier).toFixed(0)} pips\n` +
      `- Lote sugerido: ${lotSize} mini lotes\n` +
      `- Observação: ${riskNotes[input.profile]} ${automationTips[input.automationLevel]}`;
  };

  const handleGenerate = () => {
    try {
      const parsed = strategySchema.parse(form ?? defaultState);
      setError(null);
      setResult(buildStrategy(parsed));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Dados inválidos");
      } else {
        setError("Não foi possível gerar a estratégia.");
      }
    }
  };

  const currentState = form ?? defaultState;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="rounded-3xl bg-slate-900/60 p-10 shadow-xl ring-1 ring-slate-800/60">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/60 bg-brand-500/10 px-4 py-1 text-sm font-medium text-brand-200">
              MT5 &amp; Expert Advisors
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Monte planos consistentes para robôs e estratégias MetaTrader 5.
            </h1>
            <p className="text-slate-300">
              Defina o perfil, indicadores e níveis de automação para gerar uma estrutura de trading pronta para backtest. Receba recomendações de risco, alocação e documentação.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-800/70 px-4 py-3 shadow-inner">
              <p className="font-semibold text-brand-200">Backtests confiáveis</p>
              <p>Valide no Strategy Tester com dados de 99% qualidade e otimize parâmetros chave.</p>
            </div>
            <div className="rounded-xl bg-slate-800/70 px-4 py-3 shadow-inner">
              <p className="font-semibold text-brand-200">Deploy rápido</p>
              <p>Use MQL5 Wizard como base, exporte EAs modulares e monitore métricas críticas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6 rounded-3xl bg-slate-900/50 p-8 ring-1 ring-slate-800/60">
          <h2 className="text-2xl font-semibold text-brand-100">Configurador de Estratégia</h2>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-slate-200">Perfil operacional</span>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus:border-brand-500 focus:outline-none"
                value={currentState.profile}
                onChange={event => handleChange({ profile: event.target.value as StrategyInput["profile"] })}
              >
                <option value="Scalping">Scalping</option>
                <option value="Day Trade">Day Trade</option>
                <option value="Swing">Swing</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-slate-200">Capital (USD)</span>
              <input
                type="number"
                min={100}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus:border-brand-500 focus:outline-none"
                value={currentState.capital}
                onChange={event => handleChange({ capital: parseNumber(event.target.value, defaultState.capital) })}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-slate-200">Risco por trade (%)</span>
              <input
                type="number"
                min={0.1}
                max={5}
                step={0.1}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus:border-brand-500 focus:outline-none"
                value={currentState.riskPerTrade}
                onChange={event => handleChange({ riskPerTrade: parseNumber(event.target.value, defaultState.riskPerTrade) })}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-slate-200">Sessão principal</span>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus:border-brand-500 focus:outline-none"
                value={currentState.session}
                onChange={event => handleChange({ session: event.target.value as StrategyInput["session"] })}
              >
                <option value="Londres">Londres</option>
                <option value="Nova York">Nova York</option>
                <option value="Tóquio">Tóquio</option>
              </select>
            </label>
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-slate-200">Indicadores base</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {indicatorOptions.map(option => {
                const checked = currentState.indicators.includes(option);
                return (
                  <label key={option} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm shadow-sm">
                    <span>{option}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      className="h-4 w-4 accent-brand-500"
                      onChange={() => {
                        handleChange({
                          indicators: checked
                            ? currentState.indicators.filter(item => item !== option)
                            : [...currentState.indicators, option]
                        });
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-slate-200">Nível de automação</span>
            <div className="grid grid-cols-3 gap-3">
              {["Manual", "Semi-Autônomo", "Total"].map(level => (
                <button
                  key={level}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    currentState.automationLevel === level
                      ? "border-brand-500 bg-brand-500/20 text-brand-100"
                      : "border-slate-700 bg-slate-950 hover:border-slate-600"
                  }`}
                  onClick={() => handleChange({ automationLevel: level as StrategyInput["automationLevel"] })}
                >
                  {level}
                </button>
              ))}
            </div>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
              onClick={handleGenerate}
            >
              Gerar Estratégia
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-300 transition hover:border-slate-500"
              onClick={() => {
                setForm({ ...defaultState });
                setResult(null);
                setError(null);
              }}
            >
              Resetar parâmetros
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl bg-slate-900/40 p-8 ring-1 ring-slate-800/50">
          <h3 className="text-xl font-semibold text-brand-100">Resultado &amp; Playbook</h3>
          {result ? (
            <pre className="h-96 overflow-y-auto rounded-2xl bg-slate-950/80 p-6 text-sm leading-relaxed text-slate-200 ring-1 ring-slate-800/80">
              {result}
            </pre>
          ) : (
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                Configure os parâmetros ao lado para gerar um blueprint de estratégia com níveis de risco, alocação de lotes, objetivos de lucro e observações para programar o EA em MQL5.
              </p>
              <ul className="space-y-2">
                <li className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                  <strong className="text-brand-100">Passo 1:</strong> Valide a estratégia com backtests multi-parâmetros (Forward Testing). 
                </li>
                <li className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                  <strong className="text-brand-100">Passo 2:</strong> Gere relatório no MT5, avalie drawdown, profit factor e tempo médio de trade.
                </li>
                <li className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                  <strong className="text-brand-100">Passo 3:</strong> Exporte EA em VPS com monitoramento via Telegram/Discord.
                </li>
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section className="grid gap-6 rounded-3xl bg-slate-900/40 p-8 ring-1 ring-slate-800/50 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-100">Checklist do Robô</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✅ Controle de risco com ATR dinâmico e break-even progressivo.</li>
            <li>✅ Logs detalhados em CSV para auditoria e machine learning.</li>
            <li>✅ Feature toggle para desligar filtros durante notícias.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-100">Boas práticas</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>🧪 Execute testes de Monte Carlo para validar resiliência.</li>
            <li>🛡️ Use VPS de baixa latência e redundância de energia.</li>
            <li>📈 Rebalanceie parâmetros a cada 90 dias com walk-forward.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-100">Exportação EA</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>📄 Gere documento JSON com inputs (lot, magic number, filtros).</li>
            <li>⚙️ Utilize OnTick e OnTimer para dividir lógica de execução.</li>
            <li>🔔 Integre alertas com MetaTrader Signals ou WebRequest APIs.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
