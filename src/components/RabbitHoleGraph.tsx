import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../types';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/geminiService';
import { 
  Share2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  X,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onOpenCase: (caseId: string) => void;
  onRewardXp: (amount: number, reason: string) => void;
  initialSelectedEntity?: string | null;
  onRandomRabbitHole?: () => void;
}

export const RabbitHoleGraph: React.FC<Props> = ({
  onOpenCase,
  onRewardXp,
  initialSelectedEntity,
  onRandomRabbitHole
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [nodes] = useState<GraphNode[]>(StorageService.getGraphNodes());
  const [links] = useState<GraphLink[]>(StorageService.getGraphLinks());
  
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Path finder states
  const [pathStart, setPathStart] = useState<string>('jfk-assassination');
  const [pathEnd, setPathEnd] = useState<string>('operation-northwoods');
  const [activePath, setActivePath] = useState<string[]>([]);
  const [aiConnectionNarrative, setAiConnectionNarrative] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Colors by node type
  const getNodeColor = (type: string, rating?: string) => {
    switch (type) {
      case 'CASE':
        if (rating === 'CONFIRMED') return '#10B981';
        if (rating === 'DISPUTED') return '#F59E0B';
        if (rating === 'DEBUNKED') return '#FF4444';
        return '#00E5FF';
      case 'AGENCY': return '#F59E0B';
      case 'PERSON': return '#00E5FF';
      case 'LOCATION': return '#38BDF8';
      case 'EVENT': return '#A855F7';
      case 'DOCUMENT': return '#EC4899';
      default: return '#E0E0E0';
    }
  };

  // Build / update D3 simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Setup zoom container
    const g = svg.append('g').attr('class', 'graph-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Filter nodes
    const filteredNodes = nodes.filter(n => {
      if (filterType !== 'ALL' && n.type !== filterType) return false;
      if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links
      .filter(l => {
        const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return activeNodeIds.has(s) && activeNodeIds.has(t);
      })
      .map(d => Object.assign({}, d));

    const nodesData = filteredNodes.map(d => Object.assign({}, d));

    // Force simulation
    const simulation = d3.forceSimulation<any>(nodesData)
      .force('link', d3.forceLink<any, any>(filteredLinks).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-360))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Render links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        const s = typeof d.source === 'object' ? (d.source as any).id : d.source;
        const t = typeof d.target === 'object' ? (d.target as any).id : d.target;
        const isInActivePath = activePath.length > 1 && 
          activePath.includes(s) && 
          activePath.includes(t) && 
          Math.abs(activePath.indexOf(s) - activePath.indexOf(t)) === 1;
        
        return isInActivePath ? '#00E5FF' : 'rgba(0, 229, 255, 0.15)';
      })
      .attr('stroke-width', (d: any) => {
        const s = typeof d.source === 'object' ? (d.source as any).id : d.source;
        const t = typeof d.target === 'object' ? (d.target as any).id : d.target;
        const isInActivePath = activePath.length > 1 && 
          activePath.includes(s) && 
          activePath.includes(t) && 
          Math.abs(activePath.indexOf(s) - activePath.indexOf(t)) === 1;
        return isInActivePath ? 2.5 : 1;
      })
      .attr('stroke-dasharray', (d: any) => d.type === 'HYPOTHESIS' ? '4,4' : 'none');

    // Drag behavior
    const drag = d3.drag<SVGGElement, any>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Render nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'cursor-pointer')
      .call(drag as any)
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
        sound.playClick(850);
        StorageService.pushTrail(d.label, d.id, d.type);
      });

    // Outer glow for nodes
    node.append('circle')
      .attr('r', (d: any) => d.type === 'CASE' ? 24 : 16)
      .attr('fill', (d: any) => `${getNodeColor(d.type, d.rating)}10`)
      .attr('stroke', (d: any) => getNodeColor(d.type, d.rating))
      .attr('stroke-width', (d: any) => activePath.includes(d.id) ? 2.5 : 1)
      .attr('class', 'transition-all duration-300');

    // Inner node body
    node.append('circle')
      .attr('r', (d: any) => d.type === 'CASE' ? 14 : 9)
      .attr('fill', (d: any) => getNodeColor(d.type, d.rating))
      .attr('opacity', 0.85);

    // Node labels
    node.append('text')
      .text((d: any) => d.label)
      .attr('x', 0)
      .attr('y', (d: any) => (d.type === 'CASE' ? 34 : 25))
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e0e0')
      .attr('font-size', '10px')
      .attr('font-family', 'Courier New, monospace')
      .attr('font-weight', 'bold')
      .attr('class', 'select-none pointer-events-none');

    // Ticks
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, filterType, searchQuery, activePath]);

  // Handle entity preset from case navigation
  useEffect(() => {
    if (initialSelectedEntity) {
      const match = nodes.find(n => n.label.toLowerCase() === initialSelectedEntity.toLowerCase());
      if (match) {
        setSelectedNode(match);
      }
    }
  }, [initialSelectedEntity, nodes]);

  // Calculate shortest path
  const handleTracePath = () => {
    if (!pathStart || !pathEnd || pathStart === pathEnd) return;

    sound.playWarp();

    const adj = new Map<string, string[]>();
    links.forEach(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      if (!adj.has(s)) adj.set(s, []);
      if (!adj.has(t)) adj.set(t, []);
      adj.get(s)!.push(t);
      adj.get(t)!.push(s);
    });

    const queue: { id: string; path: string[] }[] = [{ id: pathStart, path: [pathStart] }];
    const visited = new Set<string>([pathStart]);
    let foundPath: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.id === pathEnd) {
        foundPath = current.path;
        break;
      }
      const neighbors = adj.get(current.id) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push({ id: n, path: [...current.path, n] });
        }
      }
    }

    setActivePath(foundPath);
    if (foundPath.length > 0) {
      onRewardXp(35, `Traced rabbit hole path: ${foundPath.length - 1} degrees of separation`);
    }
  };

  // AI Deep Synthesis
  const handleAiSynthesizeConnection = async () => {
    const nodeA = nodes.find(n => n.id === pathStart)?.label || pathStart;
    const nodeB = nodes.find(n => n.id === pathEnd)?.label || pathEnd;

    setIsAiLoading(true);
    sound.playClick(900);

    try {
      const result = await GeminiService.connectRabbitHole(nodeA, nodeB);
      setAiConnectionNarrative(result);
      onRewardXp(50, `Synthesized AI rabbit hole nexus between ${nodeA} and ${nodeB}`);
      sound.playUnlock();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Random node inspector jump
  const handleRandomGraphNode = () => {
    if (nodes.length === 0) return;
    const randIdx = Math.floor(Math.random() * nodes.length);
    const chosen = nodes[randIdx];
    setSelectedNode(chosen);
    sound.playWarp();
    StorageService.pushTrail(chosen.label, chosen.id, chosen.type);
    onRewardXp(20, `Discovered random entity: ${chosen.label}`);
  };

  // Random path tracer
  const handleRandomPathPair = () => {
    if (nodes.length < 2) return;
    const randStartIdx = Math.floor(Math.random() * nodes.length);
    let randEndIdx = Math.floor(Math.random() * nodes.length);
    while (randEndIdx === randStartIdx && nodes.length > 1) {
      randEndIdx = Math.floor(Math.random() * nodes.length);
    }
    const s = nodes[randStartIdx].id;
    const e = nodes[randEndIdx].id;
    setPathStart(s);
    setPathEnd(e);
    sound.playWarp();

    // Auto-trace path
    const adj = new Map<string, string[]>();
    links.forEach(l => {
      const src = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgt = typeof l.target === 'object' ? (l.target as any).id : l.target;
      if (!adj.has(src)) adj.set(src, []);
      if (!adj.has(tgt)) adj.set(tgt, []);
      adj.get(src)!.push(tgt);
      adj.get(tgt)!.push(src);
    });

    const queue: { id: string; path: string[] }[] = [{ id: s, path: [s] }];
    const visited = new Set<string>([s]);
    let foundPath: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.id === e) {
        foundPath = current.path;
        break;
      }
      const neighbors = adj.get(current.id) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push({ id: n, path: [...current.path, n] });
        }
      }
    }
    setActivePath(foundPath);
    onRewardXp(30, `Traced random nexus: ${nodes[randStartIdx].label} ➔ ${nodes[randEndIdx].label}`);
  };

  return (
    <div ref={containerRef} className="relative w-full h-[85vh] bg-[#050505] border border-white/10 overflow-hidden flex flex-col shadow-2xl bg-carbon">
      
      {/* Top Header & Floating Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Stamp & Title */}
        <div className="flex items-center gap-3 bg-[#0a0a0a]/95 border border-white/10 px-3.5 py-2 pointer-events-auto shadow-lg">
          <span className="classified-stamp text-[9px] mono">TOP SECRET</span>
          <span className="text-xs font-bold mono text-white uppercase tracking-wider">
            THE RABBIT HOLE ENGINE: MKULTRA // NETWORK
          </span>
          <span className="px-2 py-0.5 bg-[#00E5FF]/10 text-[9px] mono text-[#00E5FF] border border-[#00E5FF]/30">
            MAP_ACTIVE
          </span>
        </div>

        {/* Filter Pills & Random Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Random Node Button */}
          <button
            onClick={handleRandomGraphNode}
            className="px-2.5 py-1.5 bg-[#090D1A] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
            title="Inspect a random node on the network"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Random Node</span>
          </button>

          {/* Random Dossier Button */}
          {onRandomRabbitHole && (
            <button
              onClick={() => { onRandomRabbitHole(); sound.playWarp(); }}
              className="px-2.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
              title="Jump to a random case dossier"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Random Dossier</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1 bg-[#0a0a0a]/95 border border-white/10 p-1">
            {['ALL', 'CASE', 'AGENCY', 'PERSON', 'LOCATION', 'EVENT'].map((t) => (
              <button
                key={t}
                onClick={() => { setFilterType(t); sound.playClick(650); }}
                className={`px-2.5 py-1 text-[10px] mono font-bold uppercase transition-all ${
                  filterType === t 
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {t === 'ALL' ? 'ALL' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#0a0a0a]/95 border border-white/10 p-1 px-2.5">
            <Search className="w-3.5 h-3.5 text-[#00E5FF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter nodes..."
              className="bg-transparent text-xs mono text-white placeholder-white/40 focus:outline-none w-28 sm:w-36"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white text-xs">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing"></svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col p-3 bg-[#0D0D0D]/95 border border-white/10 max-w-[220px] pointer-events-auto">
        <div className="text-[10px] font-bold mb-2 mono text-[#00E5FF] tracking-wider uppercase">
          MAP LEGEND
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Primary Case / Person</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Agency / Institution</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Location / Facility</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4444]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Redacted / Debunked</span>
        </div>
      </div>

      {/* Bottom Floating Path Finder Bar */}
      <div className="absolute bottom-4 right-4 z-20 bg-[#0D0D0D]/95 border border-[#00E5FF]/30 p-3.5 max-w-md w-full pointer-events-auto shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] mono font-bold text-[#00E5FF] tracking-wider flex items-center gap-1.5 uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>RABBIT HOLE TRAIL TRACER</span>
          </span>
          {activePath.length > 0 && (
            <span className="text-[10px] mono text-[#10B981] font-bold">
              {activePath.length - 1} HOP(S) TRACED
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            value={pathStart}
            onChange={(e) => setPathStart(e.target.value)}
            className="bg-[#050505] border border-white/10 p-1.5 text-[11px] mono text-[#00E5FF] focus:outline-none"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
            ))}
          </select>

          <select
            value={pathEnd}
            onChange={(e) => setPathEnd(e.target.value)}
            className="bg-[#050505] border border-white/10 p-1.5 text-[11px] mono text-[#00E5FF] focus:outline-none"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTracePath}
            className="flex-1 py-1.5 px-3 bg-[#00E5FF] hover:bg-[#33ebff] text-black text-xs mono font-black transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          >
            <span>TRACE NEXUS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRandomPathPair}
            className="py-1.5 px-2.5 bg-[#090D1A] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs mono font-bold flex items-center gap-1 transition-all"
            title="Pick two random nodes and trace nexus"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Random Pair</span>
          </button>

          <button
            onClick={handleAiSynthesizeConnection}
            disabled={isAiLoading}
            className="py-1.5 px-3 bg-[#050505] border border-[#00E5FF]/40 hover:border-[#00E5FF] text-[#00E5FF] text-xs mono font-bold flex items-center gap-1 transition-all"
            title="AI Cross-Synthesis"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>{isAiLoading ? 'Synthesizing...' : 'AI Brief'}</span>
          </button>
        </div>

        {/* Active Path Visual String */}
        {activePath.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 text-[9px] mono text-white/70 flex items-center gap-1 flex-wrap">
            <span className="text-[#00E5FF] font-bold">CHAIN:</span>
            {activePath.map((nodeId, idx) => {
              const label = nodes.find(n => n.id === nodeId)?.label || nodeId;
              return (
                <React.Fragment key={nodeId}>
                  <span className="bg-[#050505] px-1.5 py-0.5 text-white border border-white/10">
                    {label}
                  </span>
                  {idx < activePath.length - 1 && <span className="text-[#00E5FF]">➔</span>}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* AI Synthesis Brief Box */}
        {aiConnectionNarrative && (
          <div className="mt-3 p-3 bg-[#050505] border border-[#00E5FF]/40 text-xs mono text-white/90 max-h-40 overflow-y-auto leading-relaxed">
            <div className="flex items-center justify-between text-[10px] text-[#00E5FF] font-bold mb-1">
              <span>DECLASSIFIED NEXUS BRIEF:</span>
              <button onClick={() => setAiConnectionNarrative(null)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="text-white/80 whitespace-pre-wrap font-sans text-xs">
              {aiConnectionNarrative}
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute top-16 right-4 z-30 w-80 border border-[#00E5FF]/50 bg-[#0D0D0D]/95 backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-right-4 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span className="text-[9px] mono font-bold text-[#00E5FF] uppercase tracking-wider">
              NODE INSPECTOR // {selectedNode.type}
            </span>
            <button onClick={() => setSelectedNode(null)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-sm font-mono font-bold text-white mb-1">
            {selectedNode.label}
          </h4>

          {selectedNode.description && (
            <p className="text-xs text-white/70 font-sans mb-3 leading-relaxed">
              {selectedNode.description}
            </p>
          )}

          {selectedNode.type === 'CASE' && selectedNode.caseId && (
            <button
              onClick={() => {
                if (selectedNode.caseId) onOpenCase(selectedNode.caseId);
              }}
              className="w-full py-2 px-3 bg-[#00E5FF] hover:bg-[#33ebff] text-black text-xs mono font-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all mt-2"
            >
              <span>OPEN FULL CASE DOSSIER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick set for Rabbit hole path */}
          <div className="mt-3 pt-2 border-t border-white/10 flex gap-2 text-[10px] mono">
            <button
              onClick={() => { setPathStart(selectedNode.id); sound.playClick(600); }}
              className="flex-1 py-1 px-2 bg-[#050505] border border-white/10 text-white/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 text-center"
            >
              Set as Start
            </button>
            <button
              onClick={() => { setPathEnd(selectedNode.id); sound.playClick(600); }}
              className="flex-1 py-1 px-2 bg-[#050505] border border-white/10 text-white/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 text-center"
            >
              Set as End
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
