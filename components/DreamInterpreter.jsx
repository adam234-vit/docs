import React, { useState } from 'react';

const DreamInterpreter = () => {
  const [dreamText, setDreamText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [interpretation, setInterpretation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('ar'); // 'ar' or 'en'

  const t = {
    ar: {
      title: 'تفسير الأحلام',
      subtitle: 'ما رأيته الليلة… ربما كان رسالة من الغيب',
      placeholder: 'صف رؤياك بكل تفاصيلها… 🌙',
      label: 'احكِ رؤياك',
      button: 'فسِّر الرؤيا',
      loading: 'جارٍ تفسير الرؤيا…',
      themes: 'المحاور الرئيسية',
      tone: 'الحالة والمزاج',
      symbols: 'رموز الرؤيا ودلالاتها',
      insight: 'التفسير',
      guidance: 'البشارة والتنبيه',
      error: 'تعذّر التفسير، حاول مجدداً.',
      switchLang: 'English',
      apiKeyLabel: 'مفتاح Claude API',
      apiKeyPlaceholder: 'sk-ant-...',
    },
    en: {
      title: 'Dream Interpretation',
      subtitle: 'What you saw tonight… may be a message from the unseen',
      placeholder: 'Describe your dream in detail… 🌙',
      label: 'Tell me your dream',
      button: 'Interpret Dream',
      loading: 'Interpreting your dream…',
      themes: 'Main Themes',
      tone: 'Mood & Atmosphere',
      symbols: 'Symbols & Their Meanings',
      insight: 'Interpretation',
      guidance: 'Signs for the Future',
      error: 'Could not interpret your dream. Please try again.',
      switchLang: 'عربي',
      apiKeyLabel: 'Claude API Key',
      apiKeyPlaceholder: 'sk-ant-...',
    }
  };

  const isArabic = lang === 'ar';
  const ui = t[lang];

  const interpretDream = async () => {
    if (!dreamText.trim() || !apiKey.trim()) return;
    setIsLoading(true);
    setError(null);
    setInterpretation(null);

    const prompt = `أنت مفسّر أحلام إسلامي متمرّس، تستند إلى علم تفسير الرؤى على منهج ابن سيرين والنابلسي والإمام القرطبي، وتؤمن أن الرؤيا الصادقة بشرى من الله أو إنذار للمؤمن.

وصف الرؤيا: "${dreamText}"

قدّم التفسير بالعربية الفصيحة الواضحة. أجب بكائن JSON فقط (بدون أي نص خارجه) بهذا الشكل:
{
  "mainThemes": ["محور1", "محور2", "محور3"],
  "emotionalTone": "وصف الحالة الروحية والمزاجية للرائي من خلال الرؤيا",
  "symbols": [
    {"symbol": "الرمز", "meaning": "دلالته في التراث الإسلامي والتفسير"},
    {"symbol": "الرمز", "meaning": "دلالته في التراث الإسلامي والتفسير"}
  ],
  "personalInsight": "التفسير الشامل للرؤيا استناداً إلى علماء التفسير، مع ذكر ما قد تبشّر به أو تنذر",
  "guidance": "ما يُستفاد من هذه الرؤيا فيما يخص المستقبل القريب، وما ينبغي للرائي أن يفعله أو يتحاشاه"
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'API error');
      }
      const text = data.content.map(i => i.text || '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      setInterpretation(JSON.parse(clean));
    } catch (err) {
      setError(ui.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ fontFamily: isArabic ? "'Amiri', 'Georgia', serif" : "'Georgia', serif" }}
      className="min-h-screen text-amber-50 p-6 pt-10 relative overflow-hidden"
    >
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        {[...Array(60)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() > 0.8 ? 3 : 2,
            height: Math.random() > 0.8 ? 3 : 2,
            borderRadius: '50%',
            background: '#fff',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.2,
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
        {/* Crescent Moon */}
        <div style={{
          position: 'absolute', top: 30, right: isArabic ? 'auto' : 40, left: isArabic ? 40 : 'auto',
          width: 70, height: 70,
          borderRadius: '50%',
          boxShadow: isArabic ? '-12px 8px 0 0 #f5d77e' : '12px 8px 0 0 #f5d77e',
          background: 'transparent',
          opacity: 0.85
        }} />
        {/* Arabesque decorative top border */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, transparent, #c9a84c, #e8c96a, #c9a84c, transparent)',
          opacity: 0.6
        }} />
      </div>

      <div className="max-w-2xl mx-auto relative" style={{zIndex:1}}>
        {/* Lang toggle */}
        <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'} mb-4`}>
          <button
            onClick={() => setLang(isArabic ? 'en' : 'ar')}
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#e8c96a',
              padding: '4px 14px',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            {ui.switchLang}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div style={{fontSize: 38, marginBottom: 6}}>🌙</div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 'normal',
            letterSpacing: isArabic ? 4 : 2,
            background: 'linear-gradient(90deg, #e8c96a, #f5e4a0, #c9a84c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8
          }}>{ui.title}</h1>
          <p style={{ color: '#c8b08a', fontSize: 15, opacity: 0.85 }}>{ui.subtitle}</p>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:12}}>
            <div style={{height:1, width:60, background:'linear-gradient(90deg,transparent,#c9a84c)'}}/>
            <span style={{color:'#c9a84c', fontSize:18}}>✦</span>
            <div style={{height:1, width:60, background:'linear-gradient(90deg,#c9a84c,transparent)'}}/>
          </div>
        </div>

        {/* Input Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: '28px 28px 24px',
          border: '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          marginBottom: 24
        }}>
          {/* API Key input */}
          <div style={{marginBottom: 18}}>
            <label style={{display:'block', color:'#c9a84c', marginBottom: 6, fontSize:13, opacity:0.85}}>
              {ui.apiKeyLabel}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={ui.apiKeyPlaceholder}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 10,
                padding: '8px 12px',
                color: '#f5e4a0',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                direction: 'ltr'
              }}
            />
          </div>

          <label style={{display:'block', color:'#e8c96a', marginBottom: 10, fontSize:15}}>{ui.label}</label>
          <textarea
            value={dreamText}
            onChange={e => setDreamText(e.target.value)}
            placeholder={ui.placeholder}
            rows={5}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 12,
              padding: '12px 14px',
              color: '#f5e4a0',
              fontSize: 15,
              lineHeight: 1.8,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: isArabic ? "'Amiri','Georgia',serif" : "'Georgia',serif",
              direction: isArabic ? 'rtl' : 'ltr'
            }}
          />
          <button
            onClick={interpretDream}
            disabled={isLoading || !dreamText.trim() || !apiKey.trim()}
            style={{
              marginTop: 14,
              width: '100%',
              padding: '12px 0',
              borderRadius: 12,
              border: 'none',
              background: (isLoading || !dreamText.trim() || !apiKey.trim())
                ? 'rgba(201,168,76,0.2)'
                : 'linear-gradient(90deg, #7b4f1e, #c9a84c, #7b4f1e)',
              color: (isLoading || !dreamText.trim() || !apiKey.trim()) ? '#a0855a' : '#1a0e0a',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: (isLoading || !dreamText.trim() || !apiKey.trim()) ? 'not-allowed' : 'pointer',
              letterSpacing: isArabic ? 2 : 1,
              fontFamily: isArabic ? "'Amiri','Georgia',serif" : "'Georgia',serif",
              transition: 'all 0.3s'
            }}
          >
            {isLoading ? (
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                <span style={{display:'inline-block',width:16,height:16,border:'2px solid #7b4f1e',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
                {ui.loading}
              </span>
            ) : ui.button}
          </button>
          {error && <div style={{marginTop:12,padding:'10px 14px',background:'rgba(180,60,60,0.2)',border:'1px solid rgba(200,80,80,0.4)',borderRadius:10,color:'#f08080',fontSize:14}}>{error}</div>}
        </div>

        {/* Results */}
        {interpretation && (
          <div style={{display:'flex',flexDirection:'column',gap:18,animation:'fadeUp 0.7s ease-out'}}>
            {/* Themes */}
            <Card gold>
              <SectionTitle>{ui.themes}</SectionTitle>
              <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:8}}>
                {interpretation.mainThemes.map((theme, i) => (
                  <span key={i} style={{
                    background:'rgba(201,168,76,0.15)',
                    border:'1px solid rgba(201,168,76,0.35)',
                    color:'#f5e4a0',
                    padding:'5px 16px',
                    borderRadius:20,
                    fontSize:14
                  }}>{theme}</span>
                ))}
              </div>
            </Card>

            {/* Tone */}
            <Card>
              <SectionTitle>{ui.tone}</SectionTitle>
              <p style={{color:'#d4bfa0',lineHeight:1.9,fontSize:15,marginTop:8}}>{interpretation.emotionalTone}</p>
            </Card>

            {/* Symbols */}
            <Card>
              <SectionTitle>{ui.symbols}</SectionTitle>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:10}}>
                {interpretation.symbols.map((s, i) => (
                  <div key={i} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                    <div style={{
                      minWidth:44,height:44,borderRadius:10,
                      background:'rgba(201,168,76,0.12)',
                      border:'1px solid rgba(201,168,76,0.3)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      color:'#e8c96a',fontSize:18
                    }}>✦</div>
                    <div>
                      <div style={{color:'#e8c96a',fontWeight:'bold',fontSize:15,marginBottom:3}}>{s.symbol}</div>
                      <div style={{color:'#c8b08a',fontSize:14,lineHeight:1.8}}>{s.meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Insight */}
            <Card>
              <SectionTitle>{ui.insight}</SectionTitle>
              <p style={{color:'#ddd0b8',lineHeight:2,fontSize:15,marginTop:8}}>{interpretation.personalInsight}</p>
            </Card>

            {/* Guidance */}
            <div style={{
              background:'linear-gradient(135deg,rgba(123,79,30,0.25),rgba(201,168,76,0.1),rgba(10,22,40,0.3))',
              backdropFilter:'blur(10px)',
              borderRadius:18,
              padding:'24px 26px',
              border:'1px solid rgba(201,168,76,0.35)',
              boxShadow:'0 4px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <span style={{fontSize:22}}>🔮</span>
                <SectionTitle>{ui.guidance}</SectionTitle>
              </div>
              <p style={{color:'#f5e4a0',lineHeight:2,fontSize:15}}>{interpretation.guidance}</p>
            </div>

            {/* Footer quote */}
            <div style={{textAlign:'center',padding:'12px 0 6px',opacity:0.5}}>
              <span style={{color:'#c9a84c',fontSize:13,letterSpacing:2}}>
                {isArabic ? '« الرؤيا الصالحة من الله »' : '« A righteous dream is from Allah »'}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
};

const Card = ({ children, gold }) => (
  <div style={{
    background: gold ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(10px)',
    borderRadius: 18,
    padding: '22px 24px',
    border: `1px solid rgba(201,168,76,${gold ? 0.35 : 0.18})`,
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontSize: 17,
    fontWeight: 'normal',
    color: '#e8c96a',
    letterSpacing: 2,
    margin: 0,
    borderBottom: '1px solid rgba(201,168,76,0.2)',
    paddingBottom: 8
  }}>{children}</h2>
);

export default DreamInterpreter;
