import React, { useState } from 'react';
import { toast } from 'sonner';

export function Formulario() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    conselho: '',
    profissionais: '',
    captcha: '',
  });

  const [loading, setLoading] = useState(false);

  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return cleaned
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'telefone') {
      const formatted = formatTelefone(value.slice(0, 15));
      setFormData(prev => ({ ...prev, [id]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Captcha validation
    if (formData.captcha.trim() !== '10') {
      toast.error('Por favor, responda a verificação matemática corretamente: 9 + 1 = 10.');
      return;
    }

    setLoading(true);

    try {
      // Disparar pixel de conversão do Meta
      const fbq = (window as any).fbq;
      if (fbq) {
        fbq('track', 'Lead', {
          content_category: 'Qualificacao_Geral',
          content_name: 'Formulario_Experimentar'
        });
      }

      const conselhoLabel = formData.conselho.toUpperCase();
      const profissionaisLabels: Record<string, string> = {
        '1': 'Apenas eu (1)',
        '2-5': 'De 2 a 5',
        '6-10': 'De 6 a 10',
        '11+': 'Mais de 10',
      };
      const profissionaisLabel = profissionaisLabels[formData.profissionais] || formData.profissionais;

      // Formatar a mensagem do WhatsApp
      const message = `Olá SomosFisio! Acabei de preencher o formulário de qualificação para experimentar a plataforma:

* Nome: ${formData.nome}
* E-mail: ${formData.email}
* Senha: ${formData.senha}
* WhatsApp: ${formData.telefone}
* Conselho: ${conselhoLabel}
* Qtd Profissionais: ${profissionaisLabel}

Gostaria de criar minha conta e iniciar o teste gratuito!`;

      const whatsappUrl = `https://wa.me/5585988335991?text=${encodeURIComponent(message)}`;

      toast.success('Qualificação concluída com sucesso! Redirecionando para o WhatsApp...');
      
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error('Ocorreu um erro ao processar seu cadastro. Tente novamente.');
    }
  };

  return (
    <div className="formulario-page-root">
      {/* Dynamic styles scoped to .formulario-page-root */}
      <style>{`
        .formulario-page-root {
          --bg-base: #020617; 
          --bg-surface: #0F172A; 
          --bg-card: #0B0F19;
          --text-main: #FFFFFF;
          --text-muted: #94A3B8;
          --blue-light: #60A5FA;
          --blue-main: #2563EB;
          --blue-dark: #1E3A8A;
          --border-color: rgba(255, 255, 255, 0.08);
          --font-sans: 'Inter', sans-serif;
          
          background-color: var(--bg-base);
          color: var(--text-main);
          font-family: var(--font-sans);
          line-height: 1.5;
          font-size: 15px;
          -webkit-font-smoothing: antialiased;
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        .formulario-page-root::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.3"/%3E%3C/svg%3E');
          opacity: 0.05; pointer-events: none; z-index: 9999;
        }

        /* Marquee Menu */
        .formulario-page-root .top-marquee {
          background: var(--blue-main);
          color: #fff;
          padding: 12px 0;
          overflow: hidden;
          display: flex;
          white-space: nowrap;
          position: relative;
          z-index: 20;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          width: 100%;
        }
        .formulario-page-root .top-marquee-content {
          display: flex;
          animation: marqueeTop 15s linear infinite;
          will-change: transform;
        }
        .formulario-page-root .top-marquee-inner {
          display: flex;
          white-space: nowrap;
        }
        .formulario-page-root .top-marquee-inner span {
          margin: 0 40px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        @keyframes marqueeTop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .formulario-page-root .formulario-container { 
          width: 100%; 
          max-width: 1300px; 
          margin: 0 auto; 
          padding: 60px 24px; 
          position: relative; 
          z-index: 10; 
          flex: 1; 
          display: flex; 
          align-items: center;
        }

        /* Animated Hero Arch Glow */
        @keyframes archPulse {
          0% { filter: blur(100px); transform: translateX(-50%) scale(1); opacity: 0.3; }
          50% { filter: blur(120px); transform: translateX(-50%) scale(1.05); opacity: 0.5; }
          100% { filter: blur(100px); transform: translateX(-50%) scale(1); opacity: 0.3; }
        }
        .formulario-page-root .hero-bg-arch {
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 1200px; height: 1200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 60%);
          filter: blur(100px); opacity: 0.4; z-index: 0; pointer-events: none;
          animation: archPulse 8s infinite alternate ease-in-out;
        }

        /* Layout */
        .formulario-page-root .split-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: flex-start;
          width: 100%;
        }

        /* Left Side: Content */
        .formulario-page-root .content-side h1 { 
          font-size: clamp(36px, 4vw, 48px); font-weight: 800; letter-spacing: -0.05em; line-height: 1.1; margin-bottom: 16px;
          background: linear-gradient(135deg, #FFFFFF 0%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .formulario-page-root .content-side p.subtitle {
          font-size: 18px;
          color: var(--text-muted);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .formulario-page-root .features-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .formulario-page-root .feature-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .formulario-page-root .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-light);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .formulario-page-root .feature-item:hover .feature-icon {
          background: var(--blue-main);
          color: #fff;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        }
        .formulario-page-root .feature-text h3 {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .formulario-page-root .feature-text p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Right Side: Form */
        .formulario-page-root .form-side {
          position: relative;
        }
        .formulario-page-root .form-wrapper {
          background: rgba(11, 15, 25, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(37, 99, 235, 0.1);
          transition: all 0.4s ease;
        }
        .formulario-page-root .form-wrapper:hover {
          border-color: rgba(96, 165, 250, 0.3);
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(37, 99, 235, 0.15);
        }
        
        .formulario-page-root .form-header {
          background: linear-gradient(135deg, var(--blue-main) 0%, var(--blue-dark) 100%);
          padding: 32px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .formulario-page-root .form-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }
        .formulario-page-root .form-header p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .formulario-page-root .form-body {
          padding: 32px;
        }

        .formulario-page-root .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .formulario-page-root .form-group {
          position: relative;
        }
        .formulario-page-root .form-group.full {
          grid-column: span 2;
        }

        .formulario-page-root .form-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .formulario-page-root .form-control {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 14px 16px;
          color: #fff;
          font-family: var(--font-sans);
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
        }

        .formulario-page-root .form-control:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--blue-light);
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
        }
        
        .formulario-page-root .form-control::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .formulario-page-root select.form-control {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        .formulario-page-root select.form-control option {
          background-color: var(--bg-surface);
          color: #fff;
        }

        .formulario-page-root .btn-submit {
          width: 100%;
          background: var(--blue-main);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 16px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
        }
        .formulario-page-root .btn-submit:hover {
          background: #1D4ED8;
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.6);
          transform: translateY(-2px);
        }
        .formulario-page-root .btn-submit::after {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(30deg) translateX(-100%); transition: 0.5s;
        }
        .formulario-page-root .btn-submit:hover::after { transform: rotate(30deg) translateX(100%); }

        .formulario-page-root .form-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .formulario-page-root .form-footer a {
          color: var(--blue-light);
          text-decoration: none;
        }
        .formulario-page-root .form-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 992px) {
          .formulario-page-root .split-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .formulario-page-root .content-side {
            text-align: center;
            order: 2;
          }
          .formulario-page-root .form-side {
            order: 1;
          }
          .formulario-page-root .feature-item {
            text-align: left;
          }
        }
        
        @media (max-width: 768px) {
          .formulario-page-root .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .formulario-page-root .form-group.full {
            grid-column: span 1;
          }
          .formulario-page-root .formulario-container { padding: 32px 16px; }
          .formulario-page-root .content-side h1 { font-size: 28px; line-height: 1.2; margin-bottom: 12px; }
          .formulario-page-root .content-side p.subtitle { font-size: 15px; margin-bottom: 32px; }
          .formulario-page-root .form-wrapper { border-radius: 16px; }
          .formulario-page-root .form-header { padding: 24px 16px; }
          .formulario-page-root .form-header h2 { font-size: 20px; }
          .formulario-page-root .form-body { padding: 24px 16px; }
          .formulario-page-root .feature-text h3 { font-size: 15px; }
          .formulario-page-root .feature-text p { font-size: 13px; }
        }
      `}</style>

      <div className="hero-bg-arch" />

      {/* Sliding Marquee */}
      <div className="top-marquee">
        <div className="top-marquee-content">
          <div className="top-marquee-inner">
            <span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span>
            <span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span>
          </div>
          <div className="top-marquee-inner">
            <span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span>
            <span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span><span>SOMOSFISIO</span>
          </div>
        </div>
      </div>

      <main className="formulario-container">
        <div className="split-layout">
          
          {/* Left Side Content */}
          <div className="content-side">
            <h1>Experimente a SomosFisio</h1>
            <p className="subtitle">Solução completa de gestão para melhorar a organização e os resultados do seu negócio.</p>
            
            <div className="features-list">
              
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                    <line x1={16} y1={2} x2={16} y2={6} />
                    <line x1={8} y1={2} x2={8} y2={6} />
                    <line x1={3} y1={10} x2={21} y2={10} />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Agenda Prática e Organizada</h3>
                  <p>Gestão de atendimentos por profissional, especialidade, procedimentos e convênios com máxima agilidade.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1={16} y1={13} x2={8} y2={13} />
                    <line x1={16} y1={17} x2={8} y2={17} />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Prontuário Eletrônico</h3>
                  <p>Tudo organizado: modelos de avaliação, evolução de atendimentos e anexo de arquivos direto no prontuário.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Documentos Acessíveis</h3>
                  <p>Emissão de documentos e centralização de todas as informações dos seus pacientes em um só lugar.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1={12} y1={1} x2={12} y2={23} />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Gestão Financeira Integrada</h3>
                  <p>Controle do fluxo de caixa, receitas, despesas, emissão de guias e comissionamento de profissionais.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Lembretes pelo WhatsApp</h3>
                  <p>Envio de mensagens automáticas de confirmação, reduzindo as faltas e aproximando você do seu cliente.</p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Right Side Form */}
          <div className="form-side">
            <div className="form-wrapper">
              
              <div className="form-header">
                <h2>Faça seu cadastro</h2>
                <p>Tenha acesso completo aos recursos para testar.</p>
              </div>

              <div className="form-body">
                <form onSubmit={handleSubmit}>
                  
                  <div className="form-group full" style={{ marginBottom: '20px' }}>
                    <label className="form-label" htmlFor="nome">Nome Completo *</label>
                    <input 
                      type="text" 
                      id="nome" 
                      className="form-control" 
                      placeholder="Seu nome ou da sua clínica" 
                      value={formData.nome}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">E-mail *</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="form-control" 
                        placeholder="Seu e-mail profissional" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="senha">Senha *</label>
                      <input 
                        type="password" 
                        id="senha" 
                        className="form-control" 
                        placeholder="Crie sua senha" 
                        value={formData.senha}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="telefone">WhatsApp / Fone *</label>
                      <input 
                        type="tel" 
                        id="telefone" 
                        className="form-control" 
                        placeholder="(00) 00000-0000" 
                        value={formData.telefone}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="conselho">Conselho *</label>
                      <select 
                        id="conselho" 
                        className="form-control" 
                        value={formData.conselho}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Selecione o Conselho</option>
                        <option value="crefito">CREFITO</option>
                        <option value="crm">CRM</option>
                        <option value="crp">CRP</option>
                        <option value="outros">Outros</option>
                        <option value="nenhum">Nenhum</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="profissionais">Profissionais da saúde *</label>
                      <select 
                        id="profissionais" 
                        className="form-control" 
                        value={formData.profissionais}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Selecione a opção</option>
                        <option value="1">Apenas eu (1)</option>
                        <option value="2-5">De 2 a 5</option>
                        <option value="6-10">De 6 a 10</option>
                        <option value="11+">Mais de 10</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="captcha">Verificação: 9 + 1 = ? *</label>
                      <input 
                        type="number" 
                        id="captcha" 
                        className="form-control" 
                        placeholder="Digite a resposta" 
                        value={formData.captcha}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'}
                  </button>

                  <div className="form-footer">
                    Ao criar a conta, você aceita nossos <a href="#" onClick={(e) => e.preventDefault()}>Termos de uso</a> e concorda em receber novidades.
                  </div>
                </form>
              </div>
              
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
