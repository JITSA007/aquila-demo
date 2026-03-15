import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Globe2, 
  Terminal, 
  Server, 
  Cpu,
  ChevronRight,
  Send,
  X,
  Sparkles,
  Layers,
  Activity,
  Loader2
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

async function fetchGeminiWithRetry(payload, retries = 5) {
  const delays = [1000, 2000, 4000, 8000, 16000];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
}

// --- MOCK DATA ---
const regionalData = {
  All: { visitors: 124500, conversion: '4.2%', activePartners: 142, revenue: '$2.4M' },
  MENA: { visitors: 34200, conversion: '3.8%', activePartners: 45, revenue: '$850K' },
  India: { visitors: 65100, conversion: '5.1%', activePartners: 68, revenue: '$1.1M' },
  SEA: { visitors: 25200, conversion: '3.5%', activePartners: 29, revenue: '$450K' }
};

const partnerData = [
  { id: 1, name: "TechNova Solutions", region: "India", innovation: 92, marketFit: 88, techDepth: 95, tier: "Keynote" },
  { id: 2, name: "GulfStream Digital", region: "MENA", innovation: 85, marketFit: 94, techDepth: 82, tier: "Keynote" },
  { id: 3, name: "Pacific AI Group", region: "SEA", innovation: 89, marketFit: 81, techDepth: 87, tier: "Standard" },
  { id: 4, name: "Bharat Cloud Systems", region: "India", innovation: 95, marketFit: 91, techDepth: 89, tier: "Keynote" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <BrainCircuit className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold tracking-tight text-white">Aquila<span className="text-blue-500">.ai</span></span>
            </div>
            <div className="flex space-x-1 sm:space-x-4">
              <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Layers size={16}/>} text="Architecture" />
              <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={16}/>} text="Agentic Dashboard" />
              <NavButton active={activeTab === 'partners'} onClick={() => setActiveTab('partners')} icon={<Users size={16}/>} text="Partner Ecosystem" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'partners' && <PartnersView />}
      </main>

      {/* Floating Chatbot */}
      <ChatbotWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

// --- VIEWS ---

function OverviewView() {
  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-4">
          <Sparkles className="w-4 h-4 mr-2" /> Pioneering AI Agent Ecosystems by 2028
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          The Agentic B2B Ecosystem
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
          A modular microservices architecture governed by an intelligent orchestration layer. Aquila delivers dynamic personalization, real-time analytics, and seamless external integrations.
        </p>
      </div>

      {/* Architecture Modules */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={<MessageSquare className="w-6 h-6 text-emerald-400"/>}
          title="AI Chatbot & Assistant"
          desc="NLP-driven, multilingual assistant with geo-IP detection. Captures leads and routes to CRM based on recognized intents."
        />
        <FeatureCard 
          icon={<Cpu className="w-6 h-6 text-blue-400"/>}
          title="Personalization Engine"
          desc="Machine learning tailors partner showcases and messaging based on real-time behavior and regional trends."
        />
        <FeatureCard 
          icon={<Users className="w-6 h-6 text-purple-400"/>}
          title="Partner Showcase"
          desc="Interactive pages for keynote partners, qualified automatically via AI metrics like innovation and market fit."
        />
        <FeatureCard 
          icon={<BarChart3 className="w-6 h-6 text-orange-400"/>}
          title="Analytics Dashboard"
          desc="Real-time visualization and adaptive learning. Informs automated adjustments in content through A/B testing."
        />
      </div>

      {/* Technical Deep Dive / CLI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2">
          <div className="p-8 lg:p-12 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Server className="text-blue-500" /> Scalable Infrastructure
            </h2>
            <p className="text-slate-400">
              Aquila is built on a <strong>Modular Microservices Architecture</strong>. Independent components communicate via RESTful/GraphQL APIs, allowing targeted scaling. 
            </p>
            <p className="text-slate-400">
              The <strong>Agentic Orchestration Layer</strong> acts as the brain, interpreting NLU requests to aggregate data across multiple systems (CRM, marketing) via real-time middleware like Apache Kafka.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg"><Globe2 size={16}/> MENA</div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg"><Globe2 size={16}/> India</div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg"><Globe2 size={16}/> SEA</div>
            </div>
          </div>
          <div className="bg-slate-950 p-6 md:p-8 flex flex-col justify-center border-l border-slate-800">
            <div className="mb-4 flex items-center gap-2 text-slate-500 text-sm">
              <Terminal size={16} /> Orchestration Deployment via emergent.ai CLI
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
              <div className="flex">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-slate-300">emergent deploy --project <span className="text-blue-300">"Aquila"</span> \</span>
              </div>
              <div className="pl-6 text-slate-300">--modules <span className="text-blue-300">"ai_chatbot,personalization_engine,partner_showcase,analytics_dashboard"</span> \</div>
              <div className="pl-6 text-slate-300">--regions <span className="text-blue-300">"MENA,India,SEA"</span> \</div>
              <div className="pl-6 text-slate-300">--config <span className="text-blue-300">"aquila_config.yaml"</span> \</div>
              <div className="pl-6 text-slate-300">--env <span className="text-blue-300">production</span></div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              * Triggered automatically via CI/CD pipelines to manage global release cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);

  // Orchestration Layer NLU powered by Gemini Structured Output
  const handleCommand = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setIsProcessing(true);
    
    try {
      const payload = {
        contents: [{ parts: [{ text: `Extract the requested region from this command: "${query}".` }] }],
        systemInstruction: { parts: [{ text: "You are an orchestration router. Identify which region the user is asking about. If they don't specify or it's broad, default to 'All'." }]},
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              region: {
                type: "STRING",
                enum: ["All", "MENA", "India", "SEA"]
              }
            },
            required: ["region"]
          }
        }
      };

      const result = await fetchGeminiWithRetry(payload);
      const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        setActiveRegion(parsed.region || 'All');
      }
    } catch (error) {
      console.error("NLU routing failed:", error);
      // Fallback
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('india')) setActiveRegion('India');
      else if (lowerQuery.includes('mena')) setActiveRegion('MENA');
      else if (lowerQuery.includes('sea')) setActiveRegion('SEA');
      else setActiveRegion('All');
    } finally {
      setIsProcessing(false);
      setQuery('');
    }
  };

  const currentStats = regionalData[activeRegion];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Agentic Dashboard</h2>
          <p className="text-slate-400 mt-1">Real-time telemetry and NLU-driven analytics</p>
        </div>
        
        {/* Orchestration Command Input */}
        <form onSubmit={handleCommand} className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Sparkles className={`h-5 w-5 ${isProcessing ? 'text-blue-500 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Try: 'Show me partner analytics in India'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Visitors" value={currentStats.visitors.toLocaleString()} region={activeRegion} />
        <StatCard title="Conversion Rate" value={currentStats.conversion} region={activeRegion} />
        <StatCard title="Active Partners" value={currentStats.activePartners} region={activeRegion} />
        <StatCard title="Revenue Impact" value={currentStats.revenue} region={activeRegion} highlight />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Activity className="text-blue-400"/> Regional Performance Visualization
        </h3>
        {/* Mock Chart Area */}
        <div className="h-64 flex items-end justify-around gap-2 pb-4 border-b border-slate-800">
          {Object.entries(regionalData).filter(([k]) => k !== 'All').map(([region, data], idx) => {
            const height = (data.visitors / 70000) * 100;
            const isTarget = region === activeRegion;
            return (
              <div key={region} className="w-1/4 flex flex-col items-center gap-2 group">
                <div 
                  className={`w-full max-w-[80px] rounded-t-sm transition-all duration-500 ${isTarget ? 'bg-blue-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className={`text-sm font-medium ${isTarget ? 'text-blue-400' : 'text-slate-400'}`}>{region}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

function PartnersView() {
  const [generatingId, setGeneratingId] = useState(null);
  const [pitches, setPitches] = useState({});

  const generatePitch = async (partner) => {
    setGeneratingId(partner.id);
    try {
      const payload = {
        contents: [{ parts: [{ text: `Generate a short, enthusiastic 2-sentence B2B pitch to introduce this partner to a potential client. Partner Name: ${partner.name}, Region: ${partner.region}, Innovation Score: ${partner.innovation}, Tech Depth: ${partner.techDepth}, Tier: ${partner.tier}. Focus on their specific strengths.` }] }]
      };
      const result = await fetchGeminiWithRetry(payload);
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setPitches(prev => ({ ...prev, [partner.id]: text }));
      }
    } catch (error) {
      setPitches(prev => ({ ...prev, [partner.id]: "Error generating pitch. Please check API key." }));
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold">Partner Showcase Ecosystem</h2>
        <p className="text-slate-400 mt-2 max-w-3xl">
          Partners are dynamically ingested via the orchestration layer and scored automatically using AI metrics. The dynamic content personalization engine ensures visitors see the most relevant partners.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {partnerData.map(partner => (
          <div key={partner.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-lg relative overflow-hidden">
            {partner.tier === 'Keynote' && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Keynote Partner
              </div>
            )}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">{partner.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <Globe2 size={12}/> Region: {partner.region}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-slate-400 mb-2">AI Onboarding Metrics:</div>
              <ProgressBar label="Innovation Score" value={partner.innovation} color="bg-indigo-500" />
              <ProgressBar label="Market Fit" value={partner.marketFit} color="bg-emerald-500" />
              <ProgressBar label="Tech Depth" value={partner.techDepth} color="bg-blue-500" />
            </div>

            {pitches[partner.id] && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm text-blue-100 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 mb-1 text-blue-400 font-semibold"><Sparkles size={14} /> AI Generated Pitch</div>
                {pitches[partner.id]}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
              <button 
                onClick={() => generatePitch(partner)}
                disabled={generatingId === partner.id}
                className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {generatingId === partner.id ? <Loader2 size={14} className="animate-spin text-blue-400" /> : <Sparkles size={14} className="text-blue-400" />}
                Draft Pitch
              </button>
              <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                View Case Study <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function NavButton({ active, onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-blue-500/10 text-blue-400' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors">
      <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ title, value, region, highlight }) {
  return (
    <div className={`p-6 rounded-xl border ${highlight ? 'bg-blue-900/20 border-blue-500/30' : 'bg-slate-900 border-slate-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm text-slate-400 font-medium">{title}</h4>
        <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">{region}</span>
      </div>
      <div className={`text-3xl font-bold ${highlight ? 'text-blue-400' : 'text-slate-100'}`}>
        {value}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{value}/100</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function ChatbotWidget({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am the Aquila AI Assistant. I can help qualify leads, route you to the CRM, or answer questions. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const contents = newMessages.map(msg => ({
        role: msg.role === 'bot' ? 'model' : msg.role,
        parts: [{ text: msg.text }]
      }));

      const payload = {
        contents: contents,
        systemInstruction: { parts: [{ text: "You are the Aquila AI Assistant, an expert on the Aquila B2B ecosystem. Be concise, helpful, and professional. You can discuss regions (MENA, India, SEA), partners, and our microservices architecture." }]}
      };

      const result = await fetchGeminiWithRetry(payload);
      const botText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (botText) {
        setMessages(prev => [...prev, { role: 'model', text: botText }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my neural core. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${isOpen ? 'bg-slate-800 text-slate-400 scale-90' : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <BrainCircuit className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Aquila Assistant</h3>
              <p className="text-xs text-slate-400">NLP & Lead Routing Active</p>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-4 bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700 flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder="Ask about partners or regions..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}