import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap, Legend } from "recharts";

// ========== DATA ==========
const cursos = [
  { id:1, nome:"Formação Inicial para novos servidores e para colaboradores", semestre:"Ambos", ch:20, competencia:"Orientação por Valores Éticos e Institucionais", eixo:"I", status:"Em andamento", ministrante:"Didep - Curso em Andamento (AVA)", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Didep", obs:"" },
  { id:2, nome:"Empreendedorismo na graduação e pós-graduação", semestre:"1º", ch:30, competencia:"Inovação e Mudança", eixo:"I", status:"Aguardando confirmação", ministrante:"Aginova - SEEMP (Mariana Klein)", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Aginova", obs:"" },
  { id:3, nome:"Sustentabilidade na Graduação e Pós-Graduação", semestre:"1º", ch:30, competencia:"Inovação e Mudança", eixo:"IV", status:"Realizado", ministrante:"Suzete Wiziack / Patricia Garcia / Lilian Zucchini / Dides", confirmado:true, remuneracao:"Voluntário/GECC", publico:"Docentes", sipec:false, dependencia:"Dides", obs:"Incluído Semana Lixo Zero" },
  { id:4, nome:"Pensamento Lean aplicado à UFMS", semestre:"2º", ch:9, competencia:"Visão Sistêmica", eixo:"I", status:"Proposto", ministrante:"Brayan Correa de Campos (Dibib)", confirmado:true, remuneracao:"GECC", publico:"Ambos", sipec:false, dependencia:"Dibib", obs:"" },
  { id:5, nome:"Inglês como meio de Instrução (EMI)", semestre:"1º", ch:20, competencia:"Visão Sistêmica", eixo:"VI", status:"Aguardando confirmação", ministrante:"Aginter (Flávia Melville Paiva)", confirmado:false, remuneracao:"A definir", publico:"Docentes", sipec:false, dependencia:"Aginter", obs:"aguardando resposta da Aginter" },
  { id:6, nome:"Espanhol como meio de instrução", semestre:"1º", ch:40, competencia:"Visão Sistêmica", eixo:"VI", status:"Aguardando confirmação", ministrante:"Aginter (Flávia Melville Paiva)", confirmado:false, remuneracao:"A definir", publico:"Docentes", sipec:false, dependencia:"Aginter", obs:"aguardando resposta da Aginter" },
  { id:7, nome:"Espanhol Básico – Corporativo", semestre:"2º", ch:60, competencia:"Visão Sistêmica", eixo:"VI", status:"Aguardando confirmação", ministrante:"Aginter", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Aginter", obs:"" },
  { id:8, nome:"Inglês Básico - Corporativo", semestre:"2º", ch:60, competencia:"Visão Sistêmica", eixo:"VI", status:"Aguardando confirmação", ministrante:"Aginter", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Aginter", obs:"" },
  { id:9, nome:"Libras Básico - Corporativo", semestre:"2º", ch:60, competencia:"Visão Sistêmica", eixo:"VI", status:"Proposto", ministrante:"Aginter", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Aginter", obs:"" },
  { id:10, nome:"Ética no Serviço Público", semestre:"1º", ch:20, competencia:"Orientação para Valores Éticos", eixo:"II", status:"Confirmado", ministrante:"Heloísa Helena - Corregedoria", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Corregedoria", obs:"Ok" },
  { id:11, nome:"Formação inicial à docência na educação superior", semestre:"1º", ch:60, competencia:"Inovação e Mudança", eixo:"VI", status:"Realizado", ministrante:"Inovação e Humanização na Docência (40h - 450 part.)", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Interno", obs:"10/02 a 06/12" },
  { id:12, nome:"Semana de Capacitação Pedagógica da UFMS", semestre:"1º", ch:40, competencia:"Inovação e Mudança", eixo:"VI", status:"Realizado", ministrante:"Seili", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Seili", obs:"OK" },
  { id:13, nome:"Wordpress Básico", semestre:"2º", ch:40, competencia:"Inovação e Mudança", eixo:"V", status:"Em desenvolvimento", ministrante:"Lucas Bassani / Rafael Pinheiro", confirmado:true, remuneracao:"GECC", publico:"TAEs", sipec:false, dependencia:"Interno", obs:"previsto out/nov" },
  { id:14, nome:"Práticas Pedagógicas Inovadoras e Avaliação", semestre:"Ambos", ch:60, competencia:"Inovação e Mudança", eixo:"VI", status:"Aguardando confirmação", ministrante:"FAED? Agead?", confirmado:false, remuneracao:"A definir", publico:"Docentes", sipec:false, dependencia:"FAED/Agead", obs:"" },
  { id:15, nome:"Redação Oficial", semestre:"2º", ch:20, competencia:"Comunicação Estratégica", eixo:"VI", status:"Aguardando confirmação", ministrante:"Mongelli?", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Externo", obs:"previsto out/2025" },
  { id:16, nome:"Sistemas UFMS", semestre:"2º", ch:20, competencia:"Mentalidade Digital", eixo:"V", status:"Proposto", ministrante:"", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:17, nome:"Formação em EaD", semestre:"Ambos", ch:60, competencia:"Inovação e Mudança", eixo:"V", status:"Em andamento", ministrante:"Agead", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Agead", obs:"Fluxo contínuo" },
  { id:18, nome:"Proteção e Tratamento de Dados Pessoais (LGPD)", semestre:"Ambos", ch:20, competencia:"Visão Sistêmica", eixo:"V", status:"Em desenvolvimento", ministrante:"Ouvidoria (Mariane) / Auditoria (André)", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Ouvidoria/Auditoria", obs:"previsão out/2025" },
  { id:19, nome:"Formação em TICs", semestre:"Ambos", ch:60, competencia:"Inovação e Mudança", eixo:"V", status:"Em andamento", ministrante:"Agead", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Agead", obs:"Fluxo contínuo" },
  { id:20, nome:"Lógica aplicada na Escrita Científica", semestre:"2º", ch:30, competencia:"Visão Sistêmica", eixo:"VI", status:"Proposto", ministrante:"Teodorico Alves Sobrinho (aposentado)", confirmado:true, remuneracao:"GECC", publico:"Ambos", sipec:false, dependencia:"Externo", obs:"" },
  { id:21, nome:"Programa de Gestão e Desempenho (PGD)", semestre:"1º", ch:10, competencia:"Trabalho em Equipe", eixo:"I", status:"Em desenvolvimento", ministrante:"Comissão do PGD", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Comissão PGD", obs:"em desenvolvimento" },
  { id:22, nome:"Estágio Probatório e progressão funcional", semestre:"1º", ch:20, competencia:"Engajamento de Pessoas e Equipes", eixo:"I", status:"Confirmado", ministrante:"Didep", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Didep", obs:"" },
  { id:23, nome:"Formação de Coordenadores de Graduação", semestre:"1º", ch:30, competencia:"Gestão para Resultados", eixo:"I", status:"Realizado", ministrante:"Curso realizado 17-21/02/2025 (450 part.)", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Interno", obs:"Realizado" },
  { id:24, nome:"Formação de Coordenadores de Pós-Graduação", semestre:"1º", ch:30, competencia:"Gestão para Resultados", eixo:"I", status:"Confirmado", ministrante:"Várias pró-reitorias", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:false, dependencia:"Pró-reitorias", obs:"" },
  { id:25, nome:"Formação de Diretores de Unidades", semestre:"2º", ch:20, competencia:"Gestão para Resultados", eixo:"I", status:"Proposto", ministrante:"", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:26, nome:"Gestão Acadêmica", semestre:"1º", ch:30, competencia:"Gestão para Resultados", eixo:"I", status:"Aguardando confirmação", ministrante:"?", confirmado:false, remuneracao:"A definir", publico:"TAEs", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:27, nome:"Gestão Administrativa", semestre:"2º", ch:30, competencia:"Gestão para Resultados", eixo:"I", status:"Proposto", ministrante:"", confirmado:false, remuneracao:"A definir", publico:"TAEs", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:28, nome:"Parcerias para Transferência de Tecnologia", semestre:"2º", ch:40, competencia:"Coordenação de Colaboração em Rede", eixo:"IV", status:"Proposto", ministrante:"", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:29, nome:"Inovação em Processos de Gestão e Tecnologia", semestre:"2º", ch:20, competencia:"Coordenação e Colaboração em Rede", eixo:"V", status:"Aguardando confirmação", ministrante:"Agetic?", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Agetic", obs:"" },
  { id:30, nome:"Mediação e conciliação", semestre:"2º", ch:30, competencia:"Orientação para Valores Éticos", eixo:"II", status:"Confirmado", ministrante:"Paulo Carpegianni ou Monica Toniollo", confirmado:true, remuneracao:"GECC", publico:"Ambos", sipec:false, dependencia:"Externo", obs:"" },
  { id:31, nome:"Gestão de Projeto", semestre:"1º", ch:20, competencia:"Visão Gerencial", eixo:"I", status:"Aguardando confirmação", ministrante:"?", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Indefinido", obs:"Felipe Diex" },
  { id:32, nome:"Liderança e Produtividade no PGD", semestre:"2º", ch:20, competencia:"Engajamento de Pessoas e Equipes", eixo:"I", status:"Proposto", ministrante:"", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:33, nome:"Biossegurança. Mapa de Riscos e resíduos laboratoriais", semestre:"1º", ch:20, competencia:"Geração de Valor para o Usuário", eixo:"I", status:"Realizado", ministrante:"Servidores de lab (Bio/Quí/Farm) / Dides", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Dides", obs:"realizado na Semana Lixo Zero" },
  { id:34, nome:"Reflexões sobre Aposentadoria", semestre:"2º", ch:20, competencia:"Visão de Futuro", eixo:"I", status:"Confirmado", ministrante:"Daniela Medrado e SeQV", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"SeQV/Progep", obs:"Outubro/2025" },
  { id:35, nome:"Sustentabilidade e desenv. sustentável no âmbito universitário", semestre:"1º", ch:20, competencia:"Visão transversal da sustentabilidade", eixo:"IV", status:"Em andamento", ministrante:"Dides", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Dides", obs:"Fluxo contínuo - Multiplicadores ODS" },
  { id:36, nome:"Combate a Incêndio e Primeiros Socorros", semestre:"2º", ch:20, competencia:"Prevenção de Riscos", eixo:"I", status:"Confirmado", ministrante:"Elizeu Justino (Progep)", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Progep", obs:"" },
  { id:37, nome:"Acolhimento e qualidade de vida do autista", semestre:"1º", ch:40, competencia:"Visão Sistêmica", eixo:"III", status:"Confirmado", ministrante:"Sedise/Proaes - Mirella Tucunduva", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Sedise/Proaes", obs:"" },
  { id:38, nome:"Qualidade no Atendimento e Relações Interpessoais", semestre:"1º", ch:20, competencia:"Trabalho em Equipe", eixo:"I", status:"Confirmado", ministrante:"Monica Toniollo / Andrey / Mayla / Douglas (Ext.)", confirmado:true, remuneracao:"Empenho", publico:"Ambos", sipec:false, dependencia:"Externo", obs:"" },
  { id:39, nome:"Construindo uma cultura antidiscriminatória", semestre:"2º", ch:20, competencia:"Engajamento de Pessoas e Equipes", eixo:"III", status:"Aguardando confirmação", ministrante:"Proaes ou Procids?", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Proaes/Procids", obs:"" },
  { id:40, nome:"Praticando o letramento racial no serviço público", semestre:"2º", ch:20, competencia:"Engajamento de Pessoas e Equipes", eixo:"III", status:"Proposto", ministrante:"", confirmado:false, remuneracao:"A definir", publico:"Ambos", sipec:false, dependencia:"Indefinido", obs:"" },
  { id:41, nome:"Diversidade e Inclusão: desafios e possibilidades", semestre:"2º", ch:20, competencia:"Engajamento de Pessoas e Equipes", eixo:"III", status:"Confirmado", ministrante:"Sedise (ramal 7834)", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:true, dependencia:"Sedise", obs:"25-30/11/2025" },
  { id:42, nome:"Caminhos Inclusivos na UFMS", semestre:"2º", ch:24, competencia:"Engajamento de Pessoas e Equipes", eixo:"III", status:"Confirmado", ministrante:"Sedise (ramal 7834)", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:true, dependencia:"Sedise", obs:"02-06/12/2025" },
  { id:43, nome:"Workshop AvaliAção: Construindo Avaliações Eficazes", semestre:"2º", ch:3, competencia:"Inovação e Mudança", eixo:"VI", status:"Confirmado", ministrante:"Seili", confirmado:true, remuneracao:"Institucional", publico:"Docentes", sipec:true, dependencia:"Seili", obs:"Agosto/2025" },
  { id:44, nome:"Enfrentamento do Assédio Moral e Sexual", semestre:"1º", ch:20, competencia:"Engajamento de Pessoas e Equipes", eixo:"II", status:"Confirmado", ministrante:"Corregedoria e Ouvidoria", confirmado:true, remuneracao:"Institucional", publico:"Ambos", sipec:false, dependencia:"Corregedoria/Ouvidoria", obs:"" },
];

const statusOrder = ["Realizado","Em andamento","Confirmado","Em desenvolvimento","Aguardando confirmação","Proposto","Cancelado"];
const statusColors = { "Realizado":"#22c55e","Em andamento":"#3b82f6","Confirmado":"#8b5cf6","Em desenvolvimento":"#f59e0b","Aguardando confirmação":"#ef4444","Proposto":"#6b7280","Cancelado":"#374151" };
const eixoNames = { "I":"I - Organização da adm. pública federal","II":"II - Integridade e ética","III":"III - Estado Democrático de Direito","IV":"IV - Políticas públicas","V":"V - Letramento digital","VI":"VI - Gestão do conhecimento" };
const eixoColors = { "I":"#3b82f6","II":"#8b5cf6","III":"#ec4899","IV":"#f59e0b","V":"#22c55e","VI":"#06b6d4" };

const tabs = [
  { key:"exec", label:"Execução (Semáforo)" },
  { key:"timeline", label:"Timeline Semestral" },
  { key:"comp", label:"Mapa de Competências" },
  { key:"dep", label:"Dependências de Terceiros" },
  { key:"decreto", label:"Aderência ao Decreto" },
  { key:"fin", label:"Controle Financeiro" },
  { key:"rede", label:"Rede de Ministrantes" },
  { key:"sipec", label:"Controle SIPEC" },
  { key:"comp_prop", label:"Propostas vs Definitivos" },
];

// ========== COMPONENTS ==========
const Badge = ({ children, color }) => (
  <span style={{ background: color || "#374151", color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.3 }}>{children}</span>
);

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ background: "#1e2432", borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 160, borderLeft: `3px solid ${accent || "#3b82f6"}` }}>
    <div style={{ fontSize: 28, fontWeight: 800, color: accent || "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{sub}</div>}
  </div>
);

const ProgressBar = ({ value, max, color, height = 8 }) => (
  <div style={{ background: "#0f1219", borderRadius: 4, height, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${(value/max)*100}%`, height: "100%", background: color || "#3b82f6", borderRadius: 4, transition: "width 0.6s ease" }} />
  </div>
);

const CourseCard = ({ c }) => (
  <div style={{ background: "#1e2432", borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${statusColors[c.status]}`, display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
      <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.3, flex: 1 }}>{c.nome}</span>
      <Badge color={statusColors[c.status]}>{c.status}</Badge>
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.ch}h</span>
      <span style={{ fontSize: 11, color: "#64748b" }}>|</span>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.semestre === "Ambos" ? "1º e 2º sem" : c.semestre + " sem"}</span>
      <span style={{ fontSize: 11, color: "#64748b" }}>|</span>
      <span style={{ fontSize: 11, color: c.confirmado ? "#22c55e" : "#ef4444" }}>{c.confirmado ? "✓ Ministrante" : "✗ Sem ministrante"}</span>
    </div>
    {c.obs && <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>{c.obs}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e2432", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e2e8f0" }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color || p.fill }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

// ========== PANELS ==========

function PanelExecucao() {
  const [filterStatus, setFilterStatus] = useState("Todos");
  const filtered = filterStatus === "Todos" ? cursos : cursos.filter(c => c.status === filterStatus);
  const counts = {};
  statusOrder.forEach(s => counts[s] = cursos.filter(c => c.status === s).length);
  const total = cursos.length;
  const chTotal = cursos.reduce((a, c) => a + c.ch, 0);
  const realizados = cursos.filter(c => c.status === "Realizado");
  const chRealizada = realizados.reduce((a, c) => a + c.ch, 0);
  const emExec = cursos.filter(c => ["Realizado","Em andamento","Confirmado","Em desenvolvimento"].includes(c.status));
  const confCount = cursos.filter(c => c.confirmado).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Total de Ações" value={total} accent="#3b82f6" />
        <StatCard label="CH Planejada" value={`${chTotal}h`} accent="#8b5cf6" />
        <StatCard label="Taxa de Execução" value={`${((realizados.length/total)*100).toFixed(0)}%`} sub={`${realizados.length} realizados de ${total}`} accent="#22c55e" />
        <StatCard label="CH Executada" value={`${chRealizada}h`} sub={`${((chRealizada/chTotal)*100).toFixed(0)}% do total`} accent="#f59e0b" />
        <StatCard label="Ministrantes OK" value={`${confCount}/${total}`} sub={`${((confCount/total)*100).toFixed(0)}% confirmados`} accent="#06b6d4" />
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>FILTRAR:</span>
        {["Todos", ...statusOrder.filter(s => counts[s] > 0)].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ background: filterStatus === s ? (s === "Todos" ? "#3b82f6" : statusColors[s]) : "#1e2432", color: "#fff", border: "1px solid " + (filterStatus === s ? "transparent" : "#334155"), borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>
            {s} {s !== "Todos" && `(${counts[s]})`}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.sort((a,b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)).map(c => <CourseCard key={c.id} c={c} />)}
          </div>
        </div>
        <div style={{ flex: "0 0 280px" }}>
          <div style={{ background: "#1e2432", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>DISTRIBUIÇÃO POR STATUS</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusOrder.filter(s => counts[s] > 0).map(s => ({ name: s, value: counts[s] }))} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="#0f1219" strokeWidth={2}>
                  {statusOrder.filter(s => counts[s] > 0).map(s => <Cell key={s} fill={statusColors[s]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {statusOrder.filter(s => counts[s] > 0).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: statusColors[s], flexShrink: 0 }} />
                  <span style={{ color: "#94a3b8", flex: 1 }}>{s}</span>
                  <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{counts[s]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelTimeline() {
  const sem1 = cursos.filter(c => c.semestre === "1º" || c.semestre === "Ambos");
  const sem2 = cursos.filter(c => c.semestre === "2º" || c.semestre === "Ambos");
  const barData = [
    { name: "1º Sem", total: sem1.length, ch: sem1.reduce((a,c) => a+c.ch, 0) },
    { name: "2º Sem", total: sem2.length, ch: sem2.reduce((a,c) => a+c.ch, 0) },
  ];
  const renderSem = (label, items) => (
    <div style={{ flex: 1, minWidth: 320 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ background: label === "1º Semestre 2026" ? "#3b82f6" : "#8b5cf6", width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />{label}
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>({items.length} ações · {items.reduce((a,c)=>a+c.ch,0)}h)</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.sort((a,b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)).map(c => (
          <div key={c.id} style={{ background: "#1e2432", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, borderLeft: `3px solid ${statusColors[c.status]}` }}>
            <span style={{ fontSize: 12, color: "#e2e8f0", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nome}</span>
            <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{c.ch}h</span>
            <span style={{ background: statusColors[c.status], color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, minWidth: "fit-content" }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>CARGA POR SEMESTRE (Execução 2026)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} barSize={40}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Nº Ações" fill="#3b82f6" radius={[6,6,0,0]} />
            <Bar dataKey="ch" name="CH Total" fill="#8b5cf6" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 8, padding: "8px 12px", background: "#1a1612", borderRadius: 6, border: "1px solid #78350f" }}>
          ⚠ Concentração: o 2º semestre tem {sem2.length} ações ({sem2.reduce((a,c)=>a+c.ch,0)}h) contra {sem1.length} ações ({sem1.reduce((a,c)=>a+c.ch,0)}h) do 1º. Considerar redistribuição.
        </div>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {renderSem("1º Semestre 2026", sem1)}
        {renderSem("2º Semestre 2026", sem2)}
      </div>
    </div>
  );
}

function PanelCompetencias() {
  const groups = {};
  cursos.forEach(c => {
    const comp = c.competencia;
    if (!groups[comp]) groups[comp] = { count: 0, ch: 0, cursos: [] };
    groups[comp].count++;
    groups[comp].ch += c.ch;
    groups[comp].cursos.push(c.nome);
  });
  const sorted = Object.entries(groups).sort((a, b) => b[1].count - a[1].count);
  const maxCount = Math.max(...sorted.map(([,v]) => v.count));
  const treeData = sorted.map(([name, data]) => ({ name: name.length > 25 ? name.substring(0,22)+"..." : name, size: data.count, ch: data.ch }));
  const treeColors = ["#3b82f6","#8b5cf6","#22c55e","#f59e0b","#ef4444","#06b6d4","#ec4899","#a855f7","#f97316","#14b8a6","#6366f1","#84cc16"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>MAPA DE COMPETÊNCIAS — TREEMAP (tamanho = nº de cursos)</div>
        <ResponsiveContainer width="100%" height={260}>
          <Treemap data={treeData} dataKey="size" nameKey="name" stroke="#0f1219" strokeWidth={2}
            content={({ x, y, width, height, index, name, size }) => {
              if (width < 30 || height < 20) return null;
              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={treeColors[index % treeColors.length]} rx={4} opacity={0.85} />
                  {width > 60 && height > 30 && <text x={x+width/2} y={y+height/2-6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>{name}</text>}
                  {width > 40 && height > 30 && <text x={x+width/2} y={y+height/2+10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={10}>{size} cursos</text>}
                </g>
              );
            }}
          />
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map(([comp, data], i) => (
          <div key={comp} style={{ background: "#1e2432", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{comp}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{data.count} cursos</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{data.ch}h</span>
              </div>
            </div>
            <ProgressBar value={data.count} max={maxCount} color={treeColors[i % treeColors.length]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelDependencias() {
  const deps = {};
  cursos.filter(c => !c.confirmado).forEach(c => {
    const d = c.dependencia;
    if (!deps[d]) deps[d] = [];
    deps[d].push(c);
  });
  const sorted = Object.entries(deps).sort((a, b) => b[1].length - a[1].length);
  const totalPendentes = cursos.filter(c => !c.confirmado).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Cursos pendentes" value={totalPendentes} sub={`de ${cursos.length} totais`} accent="#ef4444" />
        <StatCard label="Fornecedores envolvidos" value={sorted.length} accent="#f59e0b" />
        <StatCard label="CH em risco" value={`${cursos.filter(c => !c.confirmado).reduce((a,c)=>a+c.ch,0)}h`} accent="#ec4899" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map(([dep, items]) => (
          <div key={dep} style={{ background: "#1e2432", borderRadius: 12, padding: 16, borderLeft: "3px solid #ef4444" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🔴</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{dep}</span>
              </div>
              <Badge color="#ef4444">{items.length} curso{items.length > 1 ? "s" : ""} pendente{items.length > 1 ? "s" : ""}</Badge>
            </div>
            {items.map(c => (
              <div key={c.id} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{c.nome}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>{c.ch}h · {c.semestre === "Ambos" ? "1º e 2º" : c.semestre} sem</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelDecreto() {
  const eixos = ["I","II","III","IV","V","VI"];
  const eixoData = eixos.map(e => {
    const items = cursos.filter(c => c.eixo === e);
    return { eixo: e, nome: eixoNames[e], count: items.length, ch: items.reduce((a,c)=>a+c.ch,0), cursos: items };
  });
  const radarData = eixoData.map(e => ({ subject: `Eixo ${e.eixo}`, cursos: e.count, ch: e.ch / 20 }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>RADAR DE COBERTURA — EIXOS TEMÁTICOS (Decreto nº 9.991/2019)</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 10 }} />
            <Radar name="Nº Cursos" dataKey="cursos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {eixoData.map(e => (
          <div key={e.eixo} style={{ background: "#1e2432", borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${eixoColors[e.eixo]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{e.nome}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <Badge color={eixoColors[e.eixo]}>{e.count} cursos</Badge>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{e.ch}h</span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {e.cursos.map(c => (
                <span key={c.id} style={{ fontSize: 10, background: "#141821", color: "#94a3b8", padding: "3px 8px", borderRadius: 4 }}>{c.nome.substring(0,40)}{c.nome.length > 40 ? "..." : ""}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelFinanceiro() {
  const groups = {};
  cursos.forEach(c => {
    const r = c.remuneracao;
    if (!groups[r]) groups[r] = { count: 0, ch: 0 };
    groups[r].count++;
    groups[r].ch += c.ch;
  });
  const pieData = Object.entries(groups).map(([name, data]) => ({ name, value: data.count, ch: data.ch }));
  const finColors = { "Institucional":"#22c55e", "GECC":"#3b82f6", "Empenho":"#f59e0b", "Voluntário/GECC":"#8b5cf6", "A definir":"#ef4444" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Sem custo adicional" value={`${groups["Institucional"]?.count || 0}`} sub="Institucional" accent="#22c55e" />
        <StatCard label="GECC" value={`${(groups["GECC"]?.count || 0) + (groups["Voluntário/GECC"]?.count || 0)}`} sub="Gratificação por Encargo de Curso" accent="#3b82f6" />
        <StatCard label="Nota de Empenho" value={`${groups["Empenho"]?.count || 0}`} sub="Recurso orçamentário" accent="#f59e0b" />
        <StatCard label="A definir" value={`${groups["A definir"]?.count || 0}`} sub="Risco orçamentário" accent="#ef4444" />
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#1e2432", borderRadius: 12, padding: 20, flex: "0 0 300px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>DISTRIBUIÇÃO POR FORMA DE REMUNERAÇÃO</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" stroke="#0f1219" strokeWidth={2}>
                {pieData.map(d => <Cell key={d.name} fill={finColors[d.name] || "#6b7280"} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: finColors[d.name] || "#6b7280" }} />
                <span style={{ color: "#94a3b8", flex: 1 }}>{d.name}</span>
                <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ background: "#1e2432", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>CH POR MODALIDADE</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pieData.sort((a,b)=>b.ch-a.ch)} layout="vertical" barSize={20}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ch" name="CH (horas)" radius={[0,6,6,0]}>
                  {pieData.map(d => <Cell key={d.name} fill={finColors[d.name] || "#6b7280"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelRede() {
  const ministrantes = {};
  cursos.forEach(c => {
    const d = c.dependencia;
    if (!ministrantes[d]) ministrantes[d] = { cursos: [], confirmados: 0, total: 0, interno: true };
    ministrantes[d].cursos.push(c);
    ministrantes[d].total++;
    if (c.confirmado) ministrantes[d].confirmados++;
    if (["Externo","Indefinido"].includes(d) || d.includes("?")) ministrantes[d].interno = false;
  });
  const sorted = Object.entries(ministrantes).sort((a,b) => b[1].total - a[1].total);
  const internos = sorted.filter(([,v]) => v.interno);
  const externos = sorted.filter(([,v]) => !v.interno);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Fornecedores internos" value={internos.length} accent="#22c55e" />
        <StatCard label="Fornecedores externos/indefinidos" value={externos.length} accent="#ef4444" />
        <StatCard label="Multiplicadores potenciais" value={cursos.filter(c => c.confirmado).length} sub="Servidores com GECC/experiência" accent="#8b5cf6" />
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 10 }}>REDE INTERNA</div>
          {internos.map(([name, data]) => (
            <div key={name} style={{ background: "#1e2432", borderRadius: 8, padding: "10px 14px", marginBottom: 6, borderLeft: "3px solid #22c55e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{name}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{data.total} curso{data.total > 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                {data.cursos.map(c => <span key={c.id} style={{ fontSize: 10, background: "#141821", color: "#64748b", padding: "2px 6px", borderRadius: 3 }}>{c.nome.substring(0,35)}...</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 10 }}>EXTERNOS / INDEFINIDOS</div>
          {externos.map(([name, data]) => (
            <div key={name} style={{ background: "#1e2432", borderRadius: 8, padding: "10px 14px", marginBottom: 6, borderLeft: "3px solid #ef4444" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{name}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{data.total} curso{data.total > 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                {data.cursos.map(c => <span key={c.id} style={{ fontSize: 10, background: "#141821", color: "#64748b", padding: "2px 6px", borderRadius: 3 }}>{c.nome.substring(0,35)}...</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PanelSipec() {
  const inseridos = cursos.filter(c => c.sipec);
  const naoInseridos = cursos.filter(c => !c.sipec);
  const aptos = naoInseridos.filter(c => ["Realizado","Confirmado","Em andamento"].includes(c.status));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Inseridos no SIPEC" value={inseridos.length} accent="#22c55e" />
        <StatCard label="Não inseridos" value={naoInseridos.length} accent="#ef4444" />
        <StatCard label="Aptos p/ inserção" value={aptos.length} sub="Realizados/Confirmados/Em andamento sem SIPEC" accent="#f59e0b" />
      </div>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 10 }}>✓ JÁ INSERIDOS NO PORTAL SIPEC</div>
        {inseridos.map(c => (
          <div key={c.id} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginBottom: 4, display: "flex", justifyContent: "space-between", borderLeft: "3px solid #22c55e" }}>
            <span style={{ fontSize: 12, color: "#e2e8f0" }}>{c.nome}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.obs}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 10 }}>⚠ APTOS PARA INSERÇÃO (ação recomendada)</div>
        {aptos.map(c => (
          <div key={c.id} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "3px solid #f59e0b" }}>
            <span style={{ fontSize: 12, color: "#e2e8f0" }}>{c.nome}</span>
            <Badge color={statusColors[c.status]}>{c.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelComparativo() {
  const soPropostas = [
    "Curso sobre TEA (Transtornos do Espectro Autista)",
    "Estudo Técnico Preliminar",
    "Gerenciamento de risco nas contratações e licitações",
    "Motivação, Liderança e Desenvolvimento de Equipes",
    "Inclusão e diversidade na educação superior",
    "Segurança da Informação",
  ];
  const renomeados = [
    { de: "English as a medium of Instruction – EMI", para: "Inglês como meio de Instrução" },
    { de: "Semana Pedagógica", para: "Semana de Capacitação Pedagógica da UFMS" },
    { de: "Assédio Moral e Sexual: O que saber e fazer", para: "Conhecimento como ferramenta de enfrentamento do Assédio Moral e Sexual" },
  ];
  const novosDefinitivos = [
    "Sustentabilidade na Graduação e Pós-Graduação",
    "Liderança e Produtividade no PGD",
    "Acolhimento e qualidade de vida do autista",
    "Construindo uma cultura antidiscriminatória",
  ];
  const novosCronograma = [
    "Diversidade e Inclusão: desafios e possibilidades",
    "Caminhos Inclusivos na UFMS",
    "Workshop AvaliAção: Construindo Avaliações Eficazes",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Propostas originais" value="44" accent="#3b82f6" />
        <StatCard label="Cursos definitivos" value="42" accent="#8b5cf6" />
        <StatCard label="Acrescentados no cronograma" value="3" accent="#22c55e" />
        <StatCard label="Total final (executável)" value="44" accent="#f59e0b" />
      </div>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 10 }}>✗ PROPOSTAS QUE NÃO PASSARAM PARA DEFINITIVOS (6)</div>
        {soPropostas.map((n, i) => (
          <div key={i} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginBottom: 4, fontSize: 12, color: "#94a3b8", borderLeft: "3px solid #ef4444" }}>{n}</div>
        ))}
      </div>
      <div style={{ background: "#1e2432", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 10 }}>↔ CURSOS RENOMEADOS ENTRE PROPOSTAS E DEFINITIVOS (3)</div>
        {renomeados.map((r, i) => (
          <div key={i} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginBottom: 4, fontSize: 12, borderLeft: "3px solid #f59e0b" }}>
            <span style={{ color: "#ef4444", textDecoration: "line-through" }}>{r.de}</span>
            <span style={{ color: "#64748b", margin: "0 8px" }}>→</span>
            <span style={{ color: "#22c55e" }}>{r.para}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280, background: "#1e2432", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#8b5cf6", marginBottom: 10 }}>+ NOVOS NOS DEFINITIVOS (4)</div>
          {novosDefinitivos.map((n, i) => (
            <div key={i} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginBottom: 4, fontSize: 12, color: "#94a3b8", borderLeft: "3px solid #8b5cf6" }}>{n}</div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 280, background: "#1e2432", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", marginBottom: 10 }}>+ ACRESCENTADOS NO CRONOGRAMA (3)</div>
          {novosCronograma.map((n, i) => (
            <div key={i} style={{ background: "#141821", borderRadius: 6, padding: "8px 12px", marginBottom: 4, fontSize: 12, color: "#94a3b8", borderLeft: "3px solid #22c55e" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== MAIN ==========
export default function App() {
  const [activeTab, setActiveTab] = useState("exec");

  const panels = {
    exec: <PanelExecucao />,
    timeline: <PanelTimeline />,
    comp: <PanelCompetencias />,
    dep: <PanelDependencias />,
    decreto: <PanelDecreto />,
    fin: <PanelFinanceiro />,
    rede: <PanelRede />,
    sipec: <PanelSipec />,
    comp_prop: <PanelComparativo />,
  };

  return (
    <div style={{ background: "#0f1219", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff" }}>P</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                PDP 2025 — Painel de Gestão Estratégica
              </h1>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>PROGEP/UFMS · Plano de Desenvolvimento de Pessoal · Execução 2026</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 24, background: "#1e2432", borderRadius: 12, padding: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              background: activeTab === t.key ? "#3b82f6" : "transparent",
              color: activeTab === t.key ? "#fff" : "#94a3b8",
              border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap"
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        {panels[activeTab]}

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "16px 0", borderTop: "1px solid #1e2432", fontSize: 11, color: "#475569", textAlign: "center" }}>
          PDP 2025 — PROGEP/UFMS · Dashboard gerado em {new Date().toLocaleDateString("pt-BR")} · Dados inferidos da planilha original (Propostas + Definitivos + Cronograma)
        </div>
      </div>
    </div>
  );
}
export default PDP_2025_Dashboard;
