import { useState } from "react";
import "./Configuracoes.css";

const defaultSettings = {
	emailAlerts: true,
	criticalAlerts: true,
	weeklyReport: false,
	autoRefresh: true,
	darkMode: false,
};

function Toggle({ label, checked, onChange }) {
	return (
		<button
			type="button"
			role="switch"
			aria-label={label}
			aria-checked={checked}
			onClick={onChange}
			className={`settings-toggle ${checked ? "settings-toggle-on" : ""}`}
		>
			<span
				className={`settings-toggle-thumb ${checked ? "settings-toggle-thumb-on" : ""}`}
			/>
		</button>
	);
}

function Preference({ title, description, checked, onChange }) {
	return (
		<div className="settings-preference">
			<div>
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
			<Toggle label={title} checked={checked} onChange={onChange} />
		</div>
	);
}

export default function Configuracoes() {
	const [settings, setSettings] = useState(defaultSettings);
	const [saved, setSaved] = useState(false);

	function updateSetting(key) {
		setSettings((current) => ({ ...current, [key]: !current[key] }));
		setSaved(false);
	}

	function handleSubmit(event) {
		event.preventDefault();
		setSaved(true);
	}

	return (
		<section className="settings-page">
			<div className="settings-container">
				<header className="settings-header">
					<h2>Configurações</h2>
					<p>
						Personalize suas preferências de monitoramento e notificações.
					</p>
				</header>

				<form onSubmit={handleSubmit} className="settings-form">
					<section className="settings-card">
						<h2>Notificações</h2>
						<p className="settings-card-description">Escolha quais atualizações deseja receber.</p>
						<div className="settings-preferences">
							<Preference
								title="Alertas por e-mail"
								description="Receba avisos importantes sobre sua rede por e-mail."
								checked={settings.emailAlerts}
								onChange={() => updateSetting("emailAlerts")}
							/>
							<Preference
								title="Alertas críticos"
								description="Seja avisado quando um dispositivo ficar offline."
								checked={settings.criticalAlerts}
								onChange={() => updateSetting("criticalAlerts")}
							/>
							<Preference
								title="Resumo semanal"
								description="Receba um resumo semanal de atividade e desempenho."
								checked={settings.weeklyReport}
								onChange={() => updateSetting("weeklyReport")}
							/>
						</div>
					</section>

					<section className="settings-card">
						<h2>Monitoramento</h2>
						<p className="settings-card-description">Configure a atualização dos dados da rede.</p>
						<div className="settings-preferences">
							<Preference
								title="Atualização automática"
								description="Atualize o painel automaticamente."
								checked={settings.autoRefresh}
								onChange={() => updateSetting("autoRefresh")}
							/>
							<div className="settings-preference">
								<div>
									<h3>Intervalo de atualização</h3>
									<p>Frequência de coleta dos dados.</p>
								</div>
								<select
									aria-label="Intervalo de atualização"
									defaultValue="30"
									className="settings-select"
								>
									<option value="15">A cada 15 segundos</option>
									<option value="30">A cada 30 segundos</option>
									<option value="60">A cada 1 minuto</option>
									<option value="300">A cada 5 minutos</option>
								</select>
							</div>
						</div>
					</section>

					<section className="settings-card">
						<h2>Aparência</h2>
						<p className="settings-card-description">Ajuste a experiência visual do NetScope.</p>
						<div className="settings-preferences">
							<Preference
								title="Modo escuro"
								description="Use uma interface com tons escuros."
								checked={settings.darkMode}
								onChange={() => updateSetting("darkMode")}
							/>
						</div>
					</section>

					<div className="settings-actions">
						{saved && <p role="status">Configurações salvas.</p>}
						<button
							type="submit"
							className="settings-save"
						>
							Salvar alterações
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
