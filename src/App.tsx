/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Cpu, Network, Database, Shield, X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Edges } from '@react-three/drei';
import * as THREE from 'three';

type AgentStatus = 'active' | 'idle' | 'processing' | 'error';

interface AgentData {
  id: string;
  name: string;
  status: AgentStatus;
  progress: number;
  color: 'cyan' | 'purple';
  logs: string[];
}

const INITIAL_AGENTS: AgentData[] = [
  { id: 'a1', name: 'AI AGENT 01', status: 'active', progress: 85, color: 'cyan', logs: ['System initialized', 'Connecting to swarm...', 'Handshake successful'] },
  { id: 'a2', name: 'AI AGENT 02', status: 'processing', progress: 42, color: 'purple', logs: ['Analyzing dataset alpha', 'Optimizing weights...', 'Epoch 45/100'] },
  { id: 'a3', name: 'AI AGENT 03', status: 'idle', progress: 0, color: 'cyan', logs: ['Awaiting instructions', 'System nominal'] },
  { id: 'a4', name: 'AI AGENT 04', status: 'active', progress: 92, color: 'cyan', logs: ['Routing traffic', 'Firewall updated', 'Monitoring port 8080'] },
  { id: 'a5', name: 'AI AGENT 05', status: 'processing', progress: 15, color: 'purple', logs: ['Generating response', 'Querying DB...', 'Parsing results'] },
  { id: 'a6', name: 'AI AGENT 06', status: 'idle', progress: 100, color: 'purple', logs: ['Task completed', 'Standing by', 'Resources freed'] },
];

// Dimensions
const W = 4.5;
const H = 0.9;
const D = 3.5;
const GAP = 0.5;
const SPACING = H + GAP;

// 3D Server Component
const ServerNode = ({ agent, index, total, onClick, isSelected }: { agent: AgentData, index: number, total: number, onClick: () => void, isSelected: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isCyan = agent.color === 'cyan';
  const hexColor = isCyan ? '#2dd4bf' : '#c084fc';
  
  // Stack from top to bottom (index 0 is highest)
  const baseY = (total - 1 - index) * SPACING + H / 2 + 0.5;

  useFrame((state) => {
    if (groupRef.current) {
      // Smoothly pull out the selected server
      const targetZ = isSelected ? 0.8 : 0;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
      
      // Subtle vibration if processing
      if (agent.status === 'processing') {
        groupRef.current.position.x = (Math.random() - 0.5) * 0.02;
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, baseY, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Main Server Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial 
          color="#05050a" 
          metalness={0.6} 
          roughness={0.4}
          emissive={hexColor}
          emissiveIntensity={isSelected ? 0.15 : 0.02}
        />
        <Edges scale={1.001} threshold={15} color={hexColor} opacity={isSelected ? 1 : 0.5} transparent />
        
        {/* Front Panel UI (HTML overlay perfectly mapped to the 3D face) */}
        <Html transform position={[0, 0, D/2 + 0.001]} scale={0.01} zIndexRange={[100, 0]}>
          <div 
            className="flex flex-col justify-between p-6 box-border cursor-pointer transition-colors duration-300"
            style={{ 
              width: `${W * 100}px`, 
              height: `${H * 100}px`,
              backgroundColor: isSelected ? 'rgba(2, 6, 23, 0.95)' : 'rgba(2, 6, 23, 0.8)',
              borderTop: `2px solid ${hexColor}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ color: hexColor }} className="font-mono text-2xl tracking-[0.2em] font-medium">
              {agent.name}
            </div>
            <div className="flex justify-between items-end">
              <div className="flex gap-2.5">
                <div className={`w-3 h-3 rounded-full ${agent.status !== 'idle' ? 'animate-pulse' : ''}`} style={{ backgroundColor: hexColor, boxShadow: agent.status !== 'idle' ? `0 0 12px ${hexColor}` : 'none' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hexColor, opacity: 0.4 }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hexColor, opacity: 0.15 }} />
              </div>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500 relative" style={{ width: `${agent.progress}%`, backgroundColor: hexColor, boxShadow: `0 0 10px ${hexColor}` }}>
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </Html>

        {/* Top Face Graphic */}
        <Html transform position={[0, H/2 + 0.001, 0]} rotation={[-Math.PI/2, 0, 0]} scale={0.01} zIndexRange={[0, 0]}>
          <div 
            className="flex items-center justify-center opacity-10 pointer-events-none"
            style={{ 
              width: `${W * 100}px`, 
              height: `${D * 100}px`,
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          >
            <span className="font-mono text-8xl font-bold tracking-widest text-white transform -rotate-45">
              {agent.id.toUpperCase()}
            </span>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

// The Wireframe Rack Structure
const RackTower = ({ count }: { count: number }) => {
  const rackHeight = count * SPACING + 0.5;
  const rackY = rackHeight / 2 + 0.25;

  return (
    <group>
      {/* Outer Wireframe Bounding Box */}
      <mesh position={[0, rackY, 0]}>
        <boxGeometry args={[W + 0.4, rackHeight, D + 0.4]} />
        <meshBasicMaterial visible={false} />
        <Edges color="#2dd4bf" opacity={0.3} transparent />
      </mesh>

      {/* Inner Shelves */}
      {Array.from({ length: count }).map((_, i) => {
        const y = (count - 1 - i) * SPACING + 0.5 - GAP/2;
        return (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[W + 0.3, 0.05, D + 0.3]} />
            <meshStandardMaterial color="#0f172a" />
            <Edges color="#2dd4bf" opacity={0.2} transparent />
          </mesh>
        );
      })}
    </group>
  );
};

export default function App() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const newAgents = [...prev];
        
        newAgents.forEach(agent => {
          if (agent.status !== 'idle') {
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

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const towerHeight = agents.length * SPACING;

  return (
    <div className="w-screen h-screen bg-[#030305] text-white flex overflow-hidden font-sans selection:bg-[#2dd4bf]/30">
      
      {/* 3D Canvas Area */}
      <div className="flex-1 relative cursor-crosshair">
        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [10, towerHeight / 2 + 2, 12], fov: 45 }}>
          <color attach="background" args={['#030305']} />
          <fog attach="fog" args={['#030305', 15, 40]} />
          
          <ambientLight intensity={0.3} />
          <pointLight position={[0, towerHeight + 2, 5]} intensity={1.5} color="#ffffff" />
          <spotLight position={[8, towerHeight, 8]} angle={0.4} penumbra={1} intensity={2} color="#2dd4bf" castShadow />
          <spotLight position={[-8, towerHeight, 8]} angle={0.4} penumbra={1} intensity={2} color="#c084fc" castShadow />

          {/* Floor */}
          <gridHelper args={[100, 100, '#1e293b', '#020617']} position={[0, 0, 0]} />
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#020617" roughness={0.8} />
          </mesh>

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

          <OrbitControls 
            makeDefault 
            target={[0, towerHeight / 2, 0]}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Keep above floor
            minDistance={5}
            maxDistance={30}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none">
          <h1 className="text-sm font-mono tracking-[0.2em] text-white/80 flex items-center gap-3 bg-black/50 p-3 rounded-lg backdrop-blur-md border border-white/10">
            <Server className="w-4 h-4 text-[#2dd4bf]" />
            SERVER FACILITY <span className="text-[#2dd4bf]">-</span> TOWER 01
          </h1>
          <p className="text-xs text-white/40 mt-2 font-mono ml-1">Left Click + Drag to Rotate | Scroll to Zoom</p>
        </div>
      </div>

      {/* Details Panel (Slide in from right) */}
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

            <div className="flex items-center gap-4 mb-8 mt-2">
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${selectedAgent.color === 'cyan' ? 'border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-[#2dd4bf]' : 'border-[#c084fc]/30 bg-[#c084fc]/10 text-[#c084fc]'}`}>
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wider">{selectedAgent.name}</h2>
                <div className="flex items-center gap-2 text-sm text-white/50 font-mono mt-1">
                  <span className={`w-2 h-2 rounded-full ${selectedAgent.status === 'active' ? 'bg-green-500' : selectedAgent.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
                  {selectedAgent.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-1 flex flex-col">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">CPU LOAD</div>
                  <div className="text-2xl font-light">{Math.round(selectedAgent.progress)}%</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1 font-mono tracking-wider">MEMORY</div>
                  <div className="text-2xl font-light">{(selectedAgent.progress * 0.64).toFixed(1)} GB</div>
                </div>
              </div>

              {/* Network Graph Placeholder */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/5 h-32 flex flex-col">
                <div className="text-white/40 text-[10px] mb-2 font-mono flex items-center gap-2 tracking-wider">
                  <Network className="w-3 h-3" /> NETWORK I/O
                </div>
                <div className="flex-1 flex items-end gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className={`flex-1 rounded-t-sm ${selectedAgent.color === 'cyan' ? 'bg-[#2dd4bf]/40' : 'bg-[#c084fc]/40'}`} style={{ height: `${Math.random() * 100}%` }}></div>
                  ))}
                </div>
              </div>

              {/* Logs */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="text-white/40 text-[10px] mb-2 font-mono flex items-center gap-2 tracking-wider">
                  <Database className="w-3 h-3" /> SYSTEM LOGS
                </div>
                <div className="bg-black/50 rounded-lg p-4 border border-white/5 flex-1 font-mono text-[10px] leading-relaxed text-white/60 space-y-2 overflow-y-auto">
                  {selectedAgent.logs.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-white/30 shrink-0">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                      <span className={selectedAgent.color === 'cyan' ? 'text-[#2dd4bf]/80' : 'text-[#c084fc]/80'}>{log}</span>
                    </div>
                  ))}
                  <div className="animate-pulse">_</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
