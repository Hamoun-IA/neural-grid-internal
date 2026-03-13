import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Cpu, Network, Database, Shield, X } from 'lucide-react';

type AgentStatus = 'active' | 'idle' | 'error' | 'offline';

interface AgentData {
  id: string;
  name: string;
  emoji: string;
  status: AgentStatus;
  progress: number;
  color: 'cyan' | 'purple';
  logs: string[];
  model: string;
  uptime: string;
  lastActivity: string;
  tokensIn: number;
  tokensOut: number;
  messagesProcessed: number;
  avgResponseTime: string;
  activeSession: string;
  role: string;
  currentTask: string;
  meshConnections: string[];
}

const INITIAL_AGENTS: AgentData[] = [
  { 
    id: 'a1', name: 'IT Chief', emoji: '👨‍💻', status: 'active', progress: 85, color: 'cyan', logs: [],
    model: 'Claude 3 Opus', uptime: '14d 02h 12m', lastActivity: 'il y a 1 min',
    tokensIn: 145, tokensOut: 42, messagesProcessed: 1240, avgResponseTime: '0.8s',
    activeSession: 'User (Admin)', role: 'Lead System Administrator',
    currentTask: 'Optimisation des requêtes de la base de données principale.', meshConnections: ['A2', 'A4']
  },
  { 
    id: 'a2', name: 'Data Analyst', emoji: '📊', status: 'active', progress: 42, color: 'purple', logs: [],
    model: 'Claude 3.5 Sonnet', uptime: '5d 11h 45m', lastActivity: 'il y a 3 min',
    tokensIn: 890, tokensOut: 120, messagesProcessed: 8432, avgResponseTime: '1.2s',
    activeSession: 'Agent A1 (IT Chief)', role: 'Data Processing & Analytics',
    currentTask: 'Analyse du dataset alpha et génération de rapports.', meshConnections: ['A1', 'A5']
  },
  { 
    id: 'a3', name: 'Artiste', emoji: '🎨', status: 'idle', progress: 0, color: 'cyan', logs: [],
    model: 'Claude 3 Haiku', uptime: '1d 04h 20m', lastActivity: 'il y a 45 min',
    tokensIn: 12, tokensOut: 8, messagesProcessed: 45, avgResponseTime: '0.4s',
    activeSession: 'Aucune', role: 'Génération d\'assets visuels',
    currentTask: 'En attente de nouveaux prompts créatifs.', meshConnections: []
  },
  { 
    id: 'a4', name: 'Security', emoji: '🛡️', status: 'active', progress: 92, color: 'cyan', logs: [],
    model: 'GPT-4o', uptime: '30d 12h 00m', lastActivity: 'à l\'instant',
    tokensIn: 540, tokensOut: 12, messagesProcessed: 15420, avgResponseTime: '0.2s',
    activeSession: 'Surveillance globale', role: 'Cybersecurity & Firewall',
    currentTask: 'Analyse des paquets entrants sur le port 8080.', meshConnections: ['A1', 'A5', 'A6']
  },
  { 
    id: 'a5', name: 'Comptable', emoji: '💼', status: 'error', progress: 15, color: 'purple', logs: [],
    model: 'Claude 3.5 Sonnet', uptime: '12d 08h 11m', lastActivity: 'il y a 12 min',
    tokensIn: 45, tokensOut: 15, messagesProcessed: 312, avgResponseTime: '2.5s',
    activeSession: 'Agent A2 (Data Analyst)', role: 'Financial Operations',
    currentTask: 'ERREUR: Timeout lors de la connexion à l\'API bancaire.', meshConnections: ['A2']
  },
  { 
    id: 'a6', name: 'HR Manager', emoji: '🤝', status: 'offline', progress: 100, color: 'purple', logs: [],
    model: 'Claude 3 Opus', uptime: '0d 00h 00m', lastActivity: 'il y a 2h',
    tokensIn: 0, tokensOut: 0, messagesProcessed: 0, avgResponseTime: '-',
    activeSession: 'Déconnecté', role: 'Human Resources & Onboarding',
    currentTask: 'Système hors ligne pour maintenance planifiée.', meshConnections: []
  },
];

const ServerNode = ({ agent, index, total, onClick, isSelected }: { agent: AgentData, index: number, total: number, onClick: () => void, isSelected: boolean }) => {
  const isCyan = agent.color === 'cyan';
  const hexColor = isCyan ? '#2dd4bf' : '#c084fc';
  
  const yPos = (total - 1 - index) * 120; // 120px spacing
  const zPos = isSelected ? 80 : 0;
  
  return (
    <div 
      className="absolute left-1/2 top-1/2 w-[400px] h-[80px] -ml-[200px] -mt-[40px] cursor-pointer transition-transform duration-500 ease-out preserve-3d"
      style={{ 
        transform: `translateY(${yPos - (total * 120) / 2 + 60}px) translateZ(${zPos}px)`,
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Front Face */}
      <div 
        className="absolute left-1/2 top-1/2 w-[400px] h-[80px] -ml-[200px] -mt-[40px] border-2 bg-[#05050a]/90 backdrop-blur-md flex flex-col justify-between p-4 transition-all duration-500"
        style={{ 
          borderColor: isSelected ? hexColor : `${hexColor}40`,
          transform: 'translateZ(150px)',
          boxShadow: isSelected ? `0 0 30px ${hexColor}60, 0 0 15px ${hexColor}40 inset` : 'none'
        }}
      >
        <div style={{ color: hexColor }} className="font-mono text-xl tracking-[0.2em] font-medium">
          {agent.name}
        </div>
        <div className="flex justify-between items-end">
          <div className="flex gap-2.5">
            <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'animate-pulse' : ''}`} style={{ backgroundColor: agent.status === 'active' ? '#22c55e' : agent.status === 'idle' ? '#eab308' : agent.status === 'error' ? '#ef4444' : '#4b5563', boxShadow: agent.status === 'active' ? `0 0 8px #22c55e` : agent.status === 'error' ? `0 0 8px #ef4444` : 'none' }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hexColor, opacity: 0.4 }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hexColor, opacity: 0.15 }} />
          </div>
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500 relative" style={{ width: `${agent.progress}%`, backgroundColor: hexColor, boxShadow: `0 0 10px ${hexColor}` }}>
              <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Face */}
      <div 
        className="absolute left-1/2 top-1/2 w-[400px] h-[80px] -ml-[200px] -mt-[40px] border bg-[#020205]/90 transition-all duration-500"
        style={{ 
          transform: 'translateZ(-150px) rotateY(180deg)',
          borderColor: isSelected ? hexColor : 'rgba(255,255,255,0.1)',
          boxShadow: isSelected ? `0 0 20px ${hexColor}20 inset` : 'none'
        }}
      />

      {/* Top Face */}
      <div 
        className="absolute left-1/2 top-1/2 w-[400px] h-[300px] -ml-[200px] -mt-[150px] border bg-[#020205]/80 flex items-center justify-center overflow-hidden transition-all duration-500"
        style={{ 
          transform: 'translateY(-40px) rotateX(90deg)',
          borderColor: isSelected ? hexColor : 'rgba(255,255,255,0.1)',
          boxShadow: isSelected ? `0 0 40px ${hexColor}20 inset` : 'none'
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        <span className="font-mono text-6xl font-bold tracking-widest transform -rotate-45 transition-colors duration-500" style={{ color: isSelected ? hexColor : 'rgba(255,255,255,0.2)' }}>
          {agent.id.toUpperCase()}
        </span>
      </div>

      {/* Bottom Face */}
      <div 
        className="absolute left-1/2 top-1/2 w-[400px] h-[300px] -ml-[200px] -mt-[150px] border bg-[#020205]/90 transition-all duration-500"
        style={{ 
          transform: 'translateY(40px) rotateX(-90deg)',
          borderColor: isSelected ? hexColor : 'rgba(255,255,255,0.1)',
          boxShadow: isSelected ? `0 0 40px ${hexColor}20 inset` : 'none'
        }}
      />

      {/* Left Face */}
      <div 
        className="absolute left-1/2 top-1/2 w-[300px] h-[80px] -ml-[150px] -mt-[40px] border bg-[#030308]/90 transition-all duration-500"
        style={{ 
          transform: 'translateX(-200px) rotateY(-90deg)',
          borderColor: isSelected ? hexColor : 'rgba(255,255,255,0.1)',
          boxShadow: isSelected ? `0 0 20px ${hexColor}20 inset` : 'none'
        }}
      />

      {/* Right Face */}
      <div 
        className="absolute left-1/2 top-1/2 w-[300px] h-[80px] -ml-[150px] -mt-[40px] border bg-[#030308]/90 transition-all duration-500"
        style={{ 
          transform: 'translateX(200px) rotateY(90deg)',
          borderColor: isSelected ? hexColor : 'rgba(255,255,255,0.1)',
          boxShadow: isSelected ? `0 0 20px ${hexColor}20 inset` : 'none'
        }}
      />
    </div>
  );
};

const RackTower = ({ count }: { count: number }) => {
  const rackWidth = 440;
  const rackDepth = 340;
  const rackHeight = count * 120 + 40;
  
  return (
    <div className="absolute left-1/2 top-1/2 preserve-3d pointer-events-none"
         style={{ 
           width: rackWidth, 
           height: rackHeight, 
           marginLeft: -rackWidth / 2, 
           marginTop: -rackHeight / 2 
         }}>
      
      {/* Outer Wireframe */}
      {/* Front Frame */}
      <div className="absolute inset-0 border-2 border-[#2dd4bf]/20" style={{ transform: `translateZ(${rackDepth/2}px)` }} />
      {/* Back Frame */}
      <div className="absolute inset-0 border-2 border-[#2dd4bf]/20" style={{ transform: `translateZ(${-rackDepth/2}px)` }} />
      {/* Left Frame */}
      <div className="absolute top-0 left-1/2 border-2 border-[#2dd4bf]/20" style={{ width: rackDepth, height: rackHeight, marginLeft: -rackDepth/2, transform: `translateX(${-rackWidth/2}px) rotateY(90deg)` }} />
      {/* Right Frame */}
      <div className="absolute top-0 left-1/2 border-2 border-[#2dd4bf]/20" style={{ width: rackDepth, height: rackHeight, marginLeft: -rackDepth/2, transform: `translateX(${rackWidth/2}px) rotateY(90deg)` }} />
      
      {/* Shelves */}
      {Array.from({ length: count }).map((_, i) => {
        const serverY = (count - 1 - i) * 120 - (count * 120) / 2 + 60;
        const shelfY = serverY + 45; // Just below the server
        
        return (
          <div key={i} className="absolute left-1/2 top-1/2 border border-[#2dd4bf]/30 bg-[#0f172a]/40 backdrop-blur-sm"
               style={{ 
                 width: rackWidth - 4, 
                 height: rackDepth - 4, 
                 marginLeft: -(rackWidth - 4) / 2, 
                 marginTop: -(rackDepth - 4) / 2,
                 transform: `translateY(${shelfY}px) rotateX(90deg)`
               }} 
          />
        );
      })}
    </div>
  );
};

export default function Css3dApp() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: -15, y: -30 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const newAgents = [...prev];
        newAgents.forEach(agent => {
          if (agent.status === 'active') {
            agent.progress = agent.progress >= 100 ? 0 : agent.progress + Math.random() * 15;
          }
        });
        if (Math.random() > 0.6) {
          const senderIdx = Math.floor(Math.random() * newAgents.length);
          const receiverIdx = Math.floor(Math.random() * newAgents.length);
          if (senderIdx !== receiverIdx) {
            const sender = newAgents[senderIdx];
            const receiver = newAgents[receiverIdx];
            const msg = `Packet sent to ${receiver.id.toUpperCase()}`;
            sender.logs = [msg, ...sender.logs].slice(0, 15);
            receiver.logs = [`Received data from ${sender.id.toUpperCase()}`, ...receiver.logs].slice(0, 15);
          }
        }
        return newAgents;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;
    setRotation(prev => ({
      x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div 
      className="w-screen h-screen bg-[#030305] text-white flex overflow-hidden font-sans selection:bg-[#2dd4bf]/30"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ perspective: '1200px' }}
    >
      {/* 3D Scene Container */}
      <div 
        className="flex-1 relative cursor-move preserve-3d w-full h-full flex items-center justify-center"
      >
        <div 
          className="preserve-3d transition-transform duration-100 ease-linear"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Floor Grid */}
          <div 
            className="absolute left-1/2 top-1/2 w-[1000px] h-[1000px] -ml-[500px] -mt-[500px] border border-[#1e293b]/50"
            style={{
              transform: `translateY(${agents.length * 60 + 40}px) rotateX(90deg)`,
              backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              backgroundColor: '#020617'
            }}
          />

          {/* Main Tower */}
          <RackTower count={agents.length} />

          {/* Servers */}
          {agents.map((agent, i) => (
            <ServerNode 
              key={agent.id} 
              agent={agent} 
              index={i}
              total={agents.length}
              isSelected={selectedAgentId === agent.id}
              onClick={() => setSelectedAgentId(agent.id)} 
            />
          ))}
        </div>
      </div>

      {/* Overlay UI */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h1 className="text-sm font-mono tracking-[0.2em] text-white/80 flex items-center gap-3 bg-black/50 p-3 rounded-lg backdrop-blur-md border border-white/10">
          <Server className="w-4 h-4 text-[#2dd4bf]" />
          SERVER FACILITY <span className="text-[#2dd4bf]">-</span> CSS 3D
        </h1>
        <p className="text-xs text-white/40 mt-2 font-mono ml-1">Click + Drag to Rotate</p>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-96 bg-[#050508]/90 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col absolute right-0 top-0 bottom-0 z-30 shadow-2xl"
          >
            <button 
              onClick={() => setSelectedAgentId(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6 mt-2">
              <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-3xl ${selectedAgent.color === 'cyan' ? 'border-[#2dd4bf]/30 bg-[#2dd4bf]/10' : 'border-[#c084fc]/30 bg-[#c084fc]/10'}`}>
                {selectedAgent.emoji}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wider">{selectedAgent.name}</h2>
                <div className={`text-sm font-mono mt-1 ${selectedAgent.color === 'cyan' ? 'text-[#2dd4bf]' : 'text-[#c084fc]'}`}>
                  {selectedAgent.role}
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col overflow-y-auto pr-2 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {/* Status Row */}
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                <span className="text-white/40 text-[10px] font-mono tracking-wider">STATUT</span>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className={`w-2.5 h-2.5 rounded-full ${selectedAgent.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : selectedAgent.status === 'idle' ? 'bg-yellow-500' : selectedAgent.status === 'error' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gray-500'}`}></span>
                  {selectedAgent.status.toUpperCase()}
                </div>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">MODÈLE</div>
                  <div className="text-sm font-medium">{selectedAgent.model}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">UPTIME</div>
                  <div className="text-sm font-medium">{selectedAgent.uptime}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">DERNIÈRE ACTIVITÉ</div>
                  <div className="text-sm font-medium">{selectedAgent.lastActivity}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">LATENCE (MOY)</div>
                  <div className="text-sm font-medium">{selectedAgent.avgResponseTime}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">TOKENS (IN/OUT)</div>
                  <div className="text-sm font-medium">{selectedAgent.tokensIn}k / {selectedAgent.tokensOut}k</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">MESSAGES TRAITÉS</div>
                  <div className="text-sm font-medium">{selectedAgent.messagesProcessed}</div>
                </div>
              </div>

              {/* Full Width Info */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">SESSION ACTIVE</div>
                <div className="text-sm">{selectedAgent.activeSession}</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">TÂCHE EN COURS</div>
                <div className="text-sm text-white/80 leading-relaxed">{selectedAgent.currentTask}</div>
              </div>

              {/* Mesh Connections */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-white/40 text-[10px] mb-2 font-mono tracking-wider flex items-center gap-2">
                  <Network className="w-3 h-3" /> CONNEXIONS MESH
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.meshConnections.map(conn => (
                    <span key={conn} className={`px-2 py-1 bg-white/5 border rounded text-xs font-mono ${selectedAgent.color === 'cyan' ? 'border-[#2dd4bf]/30 text-[#2dd4bf]' : 'border-[#c084fc]/30 text-[#c084fc]'}`}>
                      {conn}
                    </span>
                  ))}
                  {selectedAgent.meshConnections.length === 0 && (
                    <span className="text-xs text-white/30 font-mono italic">Aucune connexion active</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
