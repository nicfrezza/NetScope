
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Headset,
  Settings,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Wifi,
  Menu,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./index.css";

const metricIcons = {
  "Receita mensal": CreditCard,
  "Clientes ativos": Users,
  "Taxa de inadimplência": TrendingDown,
  "Chamados abertos": Headset,
};

const planColors = ["#7c83ff", "#35c9a5", "#f5b95f", "#627089"];
const supportStatusLabels = {
  open: "Aberto",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  closed: "Fechado",
};
const supportStatusColors = {
  open: "#f5b95f",
  in_progress: "#8585ff",
  resolved: "#35c9a5",
  closed: "#627089",
};
const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const dashboardEndpoint = `${apiBaseUrl}/api/dashboard`;

function revenueFromInvoices(invoices) {
  const monthlyRevenue = new Map();

  invoices.forEach((invoice) => {
    const dateValue = invoice.paid_at
      || invoice.invoice_date
      || invoice.issue_date
      || invoice.created_at
      || invoice.date
      || invoice.due_date;
    const dateOnly = typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue);
    const date = new Date(dateOnly ? `${dateValue}T00:00:00` : dateValue);
    const amount = Number(invoice.amount ?? invoice.total_amount ?? invoice.total ?? invoice.value);
    if (Number.isNaN(date.getTime()) || !Number.isFinite(amount)) return;

    const monthKey = dateOnly
      ? dateValue.slice(0, 7)
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + amount);
  });

  return Array.from(monthlyRevenue)
    .sort(([firstMonth], [secondMonth]) => firstMonth.localeCompare(secondMonth))
    .map(([monthKey, revenue]) => {
      const [year, month] = monthKey.split("-").map(Number);
      const label = new Date(year, month - 1, 1)
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "");
      return { month: label, revenue };
    });
}

function formatInvoiceDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

function formatInvoiceAmount(invoice) {
  const amount = Number(invoice.amount ?? invoice.total_amount ?? invoice.total ?? invoice.value);
  return Number.isFinite(amount)
    ? amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";
}

function getPeriodStart(period, now = new Date()) {
  if (period === "Últimos 30 dias") {
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  const months = period === "Últimos 6 meses" ? 6 : 12;
  return new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
}

function isDateInPeriod(value, start, end) {
  if (!value) return false;
  const dateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(dateOnly ? `${value}T00:00:00` : value);
  return !Number.isNaN(date.getTime()) && date >= start && date <= end;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("12 meses");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({ metrics: [], revenue: [], plans: [], customers: [], invoices: [], support: [] });
  const [dataStatus, setDataStatus] = useState("loading");
  const [periodEnd, setPeriodEnd] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

   async function loadDashboard() {
  try {
    const response = await fetch(dashboardEndpoint, { signal: controller.signal });
    const body = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} em ${dashboardEndpoint}: ${body.slice(0, 120)}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error(
        `${dashboardEndpoint} retornou ${contentType || "tipo desconhecido"}, não JSON. ` +
        `Resposta: ${body.slice(0, 120)}`
      );
    }

    const payload = JSON.parse(body);
    const data = payload?.dashboard || payload?.data || payload;

    if (!data || typeof data !== "object") {
      throw new Error("Resposta inválida do endpoint do dashboard");
    }

    const invoicePayload = data.invoices ?? data.invoice ?? payload.invoices ?? payload.invoice;
    const invoiceList = Array.isArray(invoicePayload)
      ? invoicePayload
      : Array.isArray(invoicePayload?.data)
        ? invoicePayload.data
        : Array.isArray(invoicePayload?.rows)
          ? invoicePayload.rows
          : [];

    setDashboardData({
      metrics: Array.isArray(data.metrics) ? data.metrics : [],
      revenue: invoiceList.length > 0
        ? revenueFromInvoices(invoiceList)
        : Array.isArray(data.revenue) ? data.revenue : [],
      plans: Array.isArray(data.plans)
        ? data.plans.map((plan, index) => ({
            ...plan,
            color: plan.color || planColors[index % planColors.length],
          }))
        : [],
      customers: Array.isArray(data.customers) ? data.customers : [],
      invoices: invoiceList,
        support: Array.isArray(data.support) ? data.support : [],
    });
    setPeriodEnd(new Date());
    setDataStatus("connected");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(`Erro ao carregar ${dashboardEndpoint}:`, error);
      setDataStatus("error");
    }
  }
}

    loadDashboard();
    return () => controller.abort();
  }, []);

  const { metrics, revenue: revenueData, plans: planData, customers, invoices, support } = dashboardData;
  const periodStart = periodEnd ? getPeriodStart(period, periodEnd) : null;
  const filteredInvoices = invoices.filter((invoice) =>
    periodStart && periodEnd && isDateInPeriod(
      invoice.paid_at || invoice.invoice_date || invoice.issue_date || invoice.created_at || invoice.date || invoice.due_date,
      periodStart,
      periodEnd
    )
  );
  const chartRevenueData = invoices.length > 0
    ? revenueFromInvoices(filteredInvoices)
    : periodEnd ? revenueData : [];
  const filteredSupport = support.filter((ticket) =>
    periodStart && periodEnd && isDateInPeriod(ticket.opened_at, periodStart, periodEnd)
  );
  const supportCounts = filteredSupport.reduce((counts, ticket) => {
    counts.set(ticket.status, (counts.get(ticket.status) || 0) + 1);
    return counts;
  }, new Map());
  const supportChartData = Array.from(supportCounts, ([status, count]) => ({
    status,
    count,
    label: supportStatusLabels[status] || status,
  }));
  const openSupportCount = filteredSupport
    .filter((ticket) => ticket.status === "open" || ticket.status === "in_progress")
    .length;
  const showOverview = activePage === "Dashboard";
  const showCustomers = activePage === "Clientes";
  const showFinance = activePage === "Financeiro" || activePage === "Boletos";
  const showSupport = activePage === "Suporte";

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.city} ${customer.plan}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Clientes", icon: Users },
    { label: "Financeiro", icon: CreditCard },
    { label: "Suporte", icon: Headset },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Wifi size={23} /></div>
          <div>
            <h1>NetScope</h1>
            <span>TELECOM ANALYTICS</span>
          </div>
        </div>

        <div className="nav-label">MENU PRINCIPAL</div>
        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => {
                setActivePage(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Suporte" && <span className="nav-count">{openSupportCount}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="database-status">
            <span className="status-dot" />
            <div>
              <strong>Database status</strong>
              <span>{dataStatus === "connected" ? "Conectado ao banco" : dataStatus === "loading" ? "Carregando dados..." : "Falha ao carregar dados"}</span>
            </div>
          </div>
          <button className="nav-item settings-item">
            <Settings size={19} />
            <span>Configurações</span>
          </button>
          <div className="profile">
            <div className="avatar">NS</div>
            <div className="profile-info">
              <strong>Administrador</strong>
              <span>NetScope Demo</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            <Menu size={21} />
          </button>
          <div className="breadcrumb">Visão geral <span>/</span> <strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                placeholder="Buscar cliente..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button onClick={() => setSearch("")} aria-label="Limpar busca">×</button>}
            </div>
            <button className="icon-button" aria-label="Notificações">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="top-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">SEXTA-FEIRA, 23 DE OUTUBRO</div>
              <h2>{activePage === "Dashboard" ? "Visão geral" : activePage}</h2>
              <p>Acompanhe o desempenho da sua operação em um só lugar.</p>
            </div>
            <select aria-label="Filtrar período da dashboard" value={period} onChange={(event) => setPeriod(event.target.value)}>
              <option>12 meses</option>
              <option>Últimos 6 meses</option>
              <option>Últimos 30 dias</option>
            </select>
          </section>

          <section className="metrics-grid">
            {(showOverview || showCustomers) && (
              <>
                {metrics.map((metric) => {
                  const Icon = metricIcons[metric.label] || TrendingUp;
                  return (
                    <article className="metric-card" key={metric.label}>
                      <div className="metric-top">
                        <span>{metric.label}</span>
                        <div className="metric-icon"><Icon size={19} /></div>
                      </div>
                      <div className="metric-value">{metric.value}</div>
                      <div className={`metric-change ${metric.positive ? "positive" : "negative"}`}>
                        {metric.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <strong>{metric.change}</strong>
                        <span>vs. período anterior</span>
                      </div>
                    </article>
                  );
                })}
              </>
            )}
          </section>

          {(showOverview || showCustomers || showFinance) && (
          <section className={`charts-grid ${showOverview ? "" : "charts-grid-single"}`}>
            {(showOverview || showFinance) && (
            <article className="panel revenue-panel">
              <div className="panel-heading">
                <div>
                  <h3>Receita ao longo do tempo</h3>
                  <p>Evolução do faturamento mensal</p>
                </div>
                <button className="subtle-button" onClick={() => setActivePage("Financeiro")}>Ver boletos <ArrowUpRight size={15} /></button>
              </div>
              <div className="chart-legend"><span /> Receita total (R$) · {period}</div>
              <div className="revenue-chart">
                {chartRevenueData.length === 0 ? (
                  <p className="support-empty">Sem dados de receita no período selecionado.</p>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartRevenueData}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8585ff" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#8585ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#252d3d" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8994aa", fontSize: 12 }} dy={10} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8994aa", fontSize: 11 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                      width={42}
                    />
                    <Tooltip
                      contentStyle={{ background: "#151d2b", border: "1px solid #303b50", borderRadius: 10, color: "#f1f5fb" }}
                      formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Receita"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8585ff" strokeWidth={2.5} fill="url(#revenueFill)" />
                  </AreaChart>
                </ResponsiveContainer>
                )}
              </div>
            </article>
            )}

            {(showOverview || showCustomers) && (
            <article className="panel plans-panel">
              <div className="panel-heading">
                <div>
                  <h3>Distribuição de planos</h3>
                  <p>Clientes por plano contratado</p>
                </div>
                <button className="more-button" aria-label="Mais opções">···</button>
              </div>
              <div className="plan-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={4} stroke="none">
                      {planData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#151d2b", border: "1px solid #303b50", borderRadius: 10, color: "#f1f5fb" }} formatter={(value) => [`${value}%`, "Clientes"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><strong>{customers.length.toLocaleString("pt-BR")}</strong><span>Clientes</span></div>
              </div>
              <div className="plan-legend">
                {planData.map((plan) => (
                  <div className="legend-row" key={plan.name}>
                    <span className="legend-color" style={{ background: plan.color }} />
                    <span>{plan.name}</span>
                    <strong>{plan.value}%</strong>
                  </div>
                ))}
              </div>
            </article>
            )}
          </section>
          )}

          {(showOverview || showSupport) && <section className="panel support-panel">
            <div className="panel-heading">
              <div>
                <h3>Chamados de suporte</h3>
                <p>Chamados agrupados por status</p>
              </div>
              <span className="support-total">{openSupportCount} abertos ou em andamento</span>
            </div>
            {supportChartData.length > 0 ? (
              <div className="support-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supportChartData} layout="vertical" margin={{ top: 8, right: 20, bottom: 8, left: 8 }}>
                    <CartesianGrid stroke="#252d3d" strokeDasharray="3 5" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#8994aa", fontSize: 11 }} />
                    <YAxis type="category" dataKey="label" width={110} axisLine={false} tickLine={false} tick={{ fill: "#a7b1c3", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#151d2b", border: "1px solid #303b50", borderRadius: 10, color: "#f1f5fb" }}
                      formatter={(value) => [value, "Chamados"]}
                    />
                    <Bar dataKey="count" name="Chamados" radius={[0, 5, 5, 0]} maxBarSize={28}>
                      {supportChartData.map((ticket) => (
                        <Cell key={ticket.status} fill={supportStatusColors[ticket.status] || "#8585ff"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="support-empty">Nenhum chamado de suporte encontrado.</p>
            )}
          </section>}

          {(showOverview || showCustomers) && <section className="panel customers-panel">
            <div className="panel-heading customers-heading">
              <div>
                <h3>Clientes recentes</h3>
                <p>Visão rápida da base de clientes</p>
              </div>
              <button className="subtle-button" onClick={() => setActivePage("Clientes")}>
                Ver clientes <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>CLIENTE</th><th>CIDADE</th><th>PLANO</th><th>STATUS</th><th /></tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.name}>
                      <td><div className="customer-cell"><div className="customer-avatar">{customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><strong>{customer.name}</strong></div></td>
                      <td>{customer.city}</td>
                      <td>{customer.plan}</td>
                      <td><span className={`status-pill ${customer.status === "Ativo" ? "status-active" : "status-inactive"}`}><span />{customer.status}</span></td>
                      <td><button className="row-more" aria-label={`Opções para ${customer.name}`}>···</button></td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && <tr><td colSpan="5" className="empty-state">Nenhum cliente encontrado.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer">Exibindo {filteredCustomers.length} clientes</div>
          </section>}
          

            {showFinance && (
              <section className="panel customers-panel">
                <div className="panel-heading customers-heading">
                  <div>
                    <h3>Relatório de boletos</h3>
                    <p>Boletos registrados na tabela invoices</p>
                  </div>
                  <button className="subtle-button" onClick={() => setActivePage("Dashboard")}>
                    Voltar ao dashboard <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>BOLETO</th><th>CLIENTE</th><th>VENCIMENTO</th><th>VALOR</th><th>STATUS</th></tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice, index) => {
                        const id = invoice.id ?? invoice.invoice_id ?? invoice.number ?? index + 1;
                        const status = invoice.status ?? invoice.payment_status ?? "—";
                        return (
                          <tr key={id}>
                            <td>{invoice.number ?? invoice.invoice_number ?? invoice.id ?? `Boleto ${index + 1}`}</td>
                            <td>{invoice.customer_name ?? invoice.customer?.name ?? invoice.customer ?? "—"}</td>
                            <td>{formatInvoiceDate(invoice.due_date ?? invoice.due_at ?? invoice.created_at ?? invoice.issue_date)}</td>
                            <td>{formatInvoiceAmount(invoice)}</td>
                            <td><span className={`status-pill ${/pago|paid|quitado/i.test(status) ? "status-active" : "status-inactive"}`}><span />{status}</span></td>
                          </tr>
                        );
                      })}
                      {invoices.length === 0 && <tr><td colSpan="5" className="empty-state">Nenhum boleto encontrado.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">Exibindo {invoices.length} boletos</div>
              </section>
            )}

          <footer className="footer">
            <span>NetScope Analytics</span>
            <span><span className="status-dot" /> {dataStatus === "connected" ? "Dados carregados do servidor" : dataStatus === "loading" ? "Carregando dados do servidor" : "Não foi possível carregar os dados"}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
