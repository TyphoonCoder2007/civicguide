import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Info, Calendar, UserCheck, CheckSquare, ChevronRight, Loader2, Award, FileText, MapPin, ClipboardList, Printer, X, Sparkles } from 'lucide-react';
import { askElectionAssistant, generateVotingPlan } from './lib/gemini';
import { electionTimeline, votingOptions, electedPositions } from './data/electionData';
import { cn } from './lib/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ViewMode = 'timeline' | 'registration' | 'ballots' | 'explainer' | 'qa';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function App() {
  const [view, setView] = useState<ViewMode>('timeline');
  const [selectedState, setSelectedState] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [votingPlan, setVotingPlan] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm CivicGuide, your advanced AI Election Assistant. Ask me anything about the voting process, requirements, or election timelines, or start a simulation!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (view === 'qa') {
      scrollToBottom();
    }
  }, [messages, view]);

  const handleSendMessage = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const userMsg = (directText || input).trim();
    if (!userMsg || isTyping) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const history = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      // Remove the last user message from history for the API call since we pass it separately
      history.pop();
      
      const responseText = await askElectionAssistant(history, userMsg, selectedState);
      setMessages([...newMessages, { role: 'model', content: responseText || 'I am sorry, I could not process your request.' }]);
    } catch (error) {
       setMessages([...newMessages, { role: 'model', content: "Sorry, I encountered an error. Please try asking again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    setVotingPlan(null);
    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const plan = await generateVotingPlan(history, selectedState);
      setVotingPlan(plan);
    } catch (error) {
      alert("Failed to generate your voting plan.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const askContextualQuestion = (question: string) => {
    setView('qa');
    setTimeout(() => {
      handleSendMessage(undefined, question);
    }, 150);
  };

  const navItems = [
    { id: 'timeline', label: 'Election Timeline', icon: Calendar },
    { id: 'registration', label: 'Registration guide', icon: UserCheck },
    { id: 'ballots', label: 'Voting Options', icon: CheckSquare },
    { id: 'explainer', label: 'Ballot Explainer', icon: FileText },
    { id: 'qa', label: 'AI Assistant', icon: Bot },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 text-slate-900 z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">CivicGuide</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors hover:bg-slate-200">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold outline-none cursor-pointer focus:ring-0 [&>option]:text-slate-900"
              >
                <option value="">Select your State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm text-indigo-700">
               <Sparkles className="w-4 h-4" />
               <span className="tracking-widest uppercase">AI Powered</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row overflow-hidden relative">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200 shrink-0 md:h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden p-6">
          <nav className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                  )}
                >
                  <Icon className={cn("w-5 h-5 transition-colors duration-200", isActive ? "text-indigo-600" : "text-slate-400")} />
                  {item.label}
                  {item.id === 'qa' && (
                    <span className="ml-auto flex h-2 w-2 relative md:ml-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 relative">
          
          {/* Static Guides */}
          {view === 'timeline' && (
             <div className="p-6 md:p-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-12">
                 <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">The Election Process</h2>
                 <p className="text-slate-500 text-lg sm:text-xl font-medium">Understand the core phases of the Indian electoral system governed by the ECI.</p>
               </div>
               
               <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-6 space-y-12">
                 {electionTimeline.map((step, index) => (
                   <div key={index} className="relative pl-8 md:pl-12 group hover:-translate-y-1 transition-transform duration-300">
                     <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shadow-sm group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-colors">
                        {index + 1}
                     </span>
                     <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
                       <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.phase.replace(/^\d+\.\s*/, '')}</h3>
                       <p className="text-slate-600 leading-relaxed text-lg mb-4">{step.details}</p>
                       <button onClick={() => askContextualQuestion(`Explain the "${step.phase.replace(/^\d+\.\s*/, '')}" phase of Indian elections in detail and give a real-world example.`)} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg">
                         <Sparkles className="w-4 h-4" /> Deep Dive with AI
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-12 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
                  <div className="p-4 bg-indigo-100 text-indigo-700 rounded-2xl shrink-0">
                    <Info className="w-8 h-8" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl font-bold text-indigo-900">Have specific timeline questions?</h4>
                    <p className="text-indigo-700/80 mt-2 mb-4">Ask the AI assistant when specific deadlines like voter registration usually land.</p>
                    <button 
                      onClick={() => setView('qa')}
                      className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      Ask Assistant
                    </button>
                  </div>
               </div>
             </div>
          )}

          {view === 'registration' && (
             <div className="p-6 md:p-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-12">
                 <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Voter Registration</h2>
                 <p className="text-slate-500 text-lg sm:text-xl font-medium">Before you can cast a ballot, you must ensure you are properly registered.</p>
               </div>
               
               <div className="prose prose-slate max-w-none">
                  <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200 p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
                    <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-slate-900 mt-0">Eligibility Requirements</h3>
                    <ul className="space-y-4 mb-10">
                      <li className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-1.5 rounded-full mt-1 shrink-0">
                          <ChevronRight className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <span className="text-slate-700 text-lg font-medium">Must be a citizen of India.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-1.5 rounded-full mt-1 shrink-0">
                          <ChevronRight className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <span className="text-slate-700 text-lg font-medium">Must be 18 years of age or older on the qualifying date (usually Jan 1st).</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-1.5 rounded-full mt-1 shrink-0">
                          <ChevronRight className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <span className="text-slate-700 text-lg font-medium">Must be an ordinarily resident of the polling area where you wish to enroll.</span>
                      </li>
                    </ul>
                    <button onClick={() => askContextualQuestion(`Can you help me understand if I meet the eligibility requirements to vote in India? Ask me a few questions to check.`)} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl">
                        <Sparkles className="w-5 h-5" /> Verify my eligibility with AI
                    </button>
                    
                    <hr className="my-10 border-slate-200" />
                    
                    <h3 className="text-2xl font-extrabold mb-6 text-slate-900">How to Register</h3>
                    <p className="text-slate-600 text-lg mb-6">Registration methods vary by area. Common methods include:</p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex flex-col bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-indigo-200 transition-colors group">
                        <p className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Online Portals</p>
                        <p className="text-base text-slate-500 mt-2 mb-4 flex-grow">Register using the Election Commission's Voter Helpline App or the official voters.eci.gov.in portal. Submit Form 6.</p>
                        <button onClick={() => askContextualQuestion(`Give me a step-by-step guide on how to register to vote online via NVSP in India.`)} className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-auto w-fit">
                           <Sparkles className="w-4 h-4" /> Ask AI how
                        </button>
                      </div>
                      <div className="flex flex-col bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-indigo-200 transition-colors group">
                        <p className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Offline via BLO</p>
                        <p className="text-base text-slate-500 mt-2 mb-4 flex-grow">Fill out Form 6 in hard copy and submit it to your Booth Level Officer (BLO) or local Electoral Registration Officer (ERO).</p>
                        <button onClick={() => askContextualQuestion(`How do I find and contact my Booth Level Officer (BLO) to register to vote offline?`)} className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-auto w-fit">
                           <Sparkles className="w-4 h-4" /> Ask AI how
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
          )}

          {view === 'ballots' && (
             <div className="p-6 md:p-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-12">
                 <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Understanding Your Voting Options</h2>
                 <p className="text-slate-500 text-lg sm:text-xl font-medium">Learn about the different ways you can cast your valid ballot.</p>
               </div>
               
               <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                 {votingOptions.map((opt, index) => (
                   <div key={index} className="bg-white border text-left border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                     <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                        <CheckSquare className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{opt.type}</h3>
                     <p className="text-slate-600 leading-relaxed font-medium mb-6 flex-grow">{opt.description}</p>
                     <div className="mt-auto pt-5 border-t border-slate-100">
                       <button onClick={() => askContextualQuestion(`Explain the "${opt.type}" voting method in India in detail. Who uses it and how does it work?`)} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                         <Sparkles className="w-4 h-4" /> Deep Dive with AI
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {view === 'explainer' && (
             <div className="p-6 md:p-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-12 text-center sm:text-left">
                 <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Ballot Explainer</h2>
                 <p className="text-slate-500 text-lg sm:text-xl font-medium">A breakdown of the different types of elected positions and what they do.</p>
               </div>
               
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {electedPositions.map((pos, index) => (
                   <div key={index} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                     <div className="flex items-start justify-between mb-4">
                       <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{pos.title}</h3>
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shrink-0 ml-2">
                         {pos.level}
                       </span>
                     </div>
                     <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium flex-grow">{pos.role}</p>
                     <button onClick={() => askContextualQuestion(`What does a ${pos.title} actually do day-to-day? Give an analogy to help me understand.`)} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors w-fit">
                        <Sparkles className="w-4 h-4" /> Ask AI for an analogy
                     </button>
                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                       Term: <span className="ml-2 text-slate-800">{pos.term}</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* AI Q&A Chat Interface */}
          {view === 'qa' && (
            <div className="flex flex-col h-full bg-slate-50/50 absolute inset-0 animate-in fade-in duration-300">
              {/* Header Actions for QA section */}
              <div className="sm:hidden p-3 bg-white border-b border-slate-200 flex justify-center shadow-sm">
                 <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 w-full max-w-sm">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <select 
                    value={selectedState} 
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="bg-transparent border-none text-sm font-semibold outline-none cursor-pointer focus:ring-0 flex-1 [&>option]:text-slate-900"
                  >
                    <option value="">Select your State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center shadow-sm z-10 shrink-0">
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest hidden md:block">Interactive Assistant</p>
                 <button
                    onClick={handleGeneratePlan}
                    disabled={isGeneratingPlan}
                    className="ml-auto sm:ml-0 flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
                    {isGeneratingPlan ? "Generating..." : "Generate My Voting Plan"}
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-4 max-w-4xl mx-auto w-full",
                      message.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md mt-1",
                      message.role === 'user' ? "bg-slate-900 text-white" : "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-200"
                    )}>
                      {message.role === 'user' ? <UserCheck className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={cn(
                      "px-6 py-4 rounded-3xl max-w-[85%] text-base prose prose-p:leading-relaxed prose-a:text-indigo-600 prose-strong:text-inherit shadow-sm",
                      message.role === 'user' 
                        ? "bg-slate-900 text-white prose-invert rounded-tr-sm" 
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm prose-li:my-1"
                    )}>
                       <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                    </div>
                  </div>
                ))}
                
                {messages.length === 1 && !isTyping && (
                  <div className="max-w-4xl mx-auto w-full pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                    
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-4">Interactive Simulations</h3>
                      <div className="grid sm:grid-cols-3 gap-6">
                         {[
                           { title: "Voter Simulation", prompt: "I want to try the Voter Simulation. Guide me step-by-step from registration to casting my vote.", icon: "👨‍💼" },
                           { title: "Candidate Simulation", prompt: "I want to try the Candidate Simulation. Guide me step-by-step from nomination to campaigning.", icon: "📢" },
                           { title: "Election Officer", prompt: "I want to try the Election Officer Simulation. Walk me through setting up a polling booth and managing election day.", icon: "📋" }
                         ].map((sim, idx) => (
                           <button 
                             key={idx}
                             onClick={() => handleSendMessage(undefined, sim.prompt)}
                             className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl rounded-3xl text-center transition-all duration-300 group relative overflow-hidden"
                           >
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">{sim.icon}</span>
                             <span className="font-extrabold text-slate-900 text-base relative z-10">{sim.title}</span>
                           </button>
                         ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-4">Quick Questions</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                         {[
                           "Can you test my election knowledge with a quiz?",
                           "Explain the Indian EVM process to me like I'm a beginner.",
                           "How do I check my name on the electoral roll?",
                           "Compare the Indian election system with the USA."
                         ].map((q, idx) => (
                           <button 
                             key={idx}
                             onClick={() => handleSendMessage(undefined, q)}
                             className="text-left px-6 py-4 bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-2xl text-sm font-semibold text-slate-700 transition-all duration-200"
                           >
                             {q}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                )}

                {isTyping && (
                  <div className="flex gap-4 max-w-4xl mx-auto w-full">
                     <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
                       <Bot className="w-5 h-5" />
                     </div>
                     <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm px-6 py-4 shadow-sm text-indigo-500 font-bold flex items-center gap-3">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Thinking...
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
                <div className="max-w-4xl mx-auto relative rounded-3xl shadow-sm border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all bg-white overflow-hidden flex items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Ask CivicGuide a question or start a simulation... "
                    className="w-full max-h-48 pt-4 pb-4 pl-6 pr-14 bg-transparent border-0 focus:ring-0 resize-none outline-none text-slate-800 placeholder:text-slate-400 font-medium text-base"
                    rows={1}
                    style={{ minHeight: '64px' }}
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 bottom-2 p-2.5 rounded-2xl bg-indigo-600 text-white disabled:bg-slate-100 disabled:text-slate-400 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center mt-3 text-xs text-slate-400 font-semibold tracking-wide">
                  CivicGuide is an AI. Remember to verify details with official ECI resources.
                </div>
              </div>
            </div>
          )}

        </main>
        
        {/* Voting Plan Modal */}
        {votingPlan && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 shrink-0 print:hidden">
                <div className="flex items-center gap-3 text-indigo-700">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Your Voting Plan</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrint}
                    className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all font-semibold"
                    title="Print"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setVotingPlan(null)}
                    className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-extrabold prose-a:text-indigo-600 prose-li:marker:text-indigo-500 print:p-0 print:text-black font-medium leading-relaxed">
                 <Markdown remarkPlugins={[remarkGfm]}>{votingPlan}</Markdown>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-200 text-center text-sm font-bold text-slate-500 tracking-wide uppercase print:hidden">
                Review this checklist carefully to ensure you're ready for Election Day.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

