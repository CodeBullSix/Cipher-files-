import fs from 'fs';

let content = `import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../types';
import { ApiService } from '../services/apiService';
import { 
  Share2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  X,
  Compass,
  Maximize2,
  Minimize2,
  RefreshCw,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onOpenCase: (caseId: string) => void;
  onOpenEntity?: (type: string, id: string) => void;
  onRewardXp: (amount: number, reason: string) => void;
  initialSelectedEntity?: string | null;
  onRandomRabbitHole?: () => void;
}

export const RabbitHoleGraph: React.FC<Props> = ({
  onOpenCase,
  onOpenEntity,
  onRewardXp,
  initialSelectedEntity,
  onRandomRabbitHole
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);

  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Initialize graph
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        let data;
        if (initialSelectedEntity && initialSelectedEntity.startsWith('case_files_')) {
          const cid = initialSelectedEntity.replace('case_files_', '');
          data = await ApiService.getGraphForCase(cid);
        } else if (initialSelectedEntity) {
          data = await ApiService.expandGraphNode(initialSelectedEntity);
        } else {
          data = await ApiService.getInitialGraphNodes();
        }
        setNodes(data.nodes || []);
        setLinks(data.edges || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [initialSelectedEntity]);

  const handleExpandNode = async (nodeId: string) => {
    sound.click();
    setLoading(true);
    try {
      const data = await ApiService.expandGraphNode(nodeId);
      
      setNodes(prev => {
        const newNodes = [...prev];
        const existingIds = new Set(newNodes.map(n => n.id));
        data.nodes.forEach((n: any) => {
          if (!existingIds.has(n.id)) {
            newNodes.push(n);
          }
        });
        return newNodes;
      });

      setLinks(prev => {
        const newLinks = [...prev];
        const existingIds = new Set(newLinks.map(l => l.id));
        data.edges.forEach((e: any) => {
          if (!existingIds.has(e.id)) {
            newLinks.push(e);
          }
        });
        return newLinks;
      });

      onRewardXp(10, "Expanded Rabbit Hole Nexus");

    } catch (err: any) {
      console.error(err);
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    sound.click();
    setLoading(true);
    setSelectedNode(null);
    setSelectedLink(null);
    try {
      const data = await ApiService.getInitialGraphNodes();
      setNodes(data.nodes || []);
      setLinks(data.edges || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Colors by node type
  const getNodeColor = (type: string, rating?: string) => {
    switch (type) {
      case 'case_files':
      case 'CASE':
        return '#10B981';
      case 'organisations':
      case 'AGENCY':
        return '#F59E0B';
      case 'locations':
      case 'LOCATION':
        return '#38BDF8';
      case 'events':
      case 'EVENT':
        return '#A855F7';
      case 'evidence_items':
      case 'DOCUMENT':
        return '#F43F5E';
      case 'people':
      case 'PERSON':
      default:
        return '#00E5FF';
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    if (nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr('viewBox', \`0 0 \${width} \${height}\`);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Filter nodes and links based on search and type
    const filteredNodes = nodes.filter(n => {
      const matchType = filterType === 'ALL' || n.type === filterType;
      const matchSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(filteredLinks)
        .id(d => d.id)
        .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));
      
    simulationRef.current = simulation;

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('stroke', d => d.verified ? '#10B981' : '#4B5563')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.verified ? 'none' : '4,4')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedLink(d);
        setSelectedNode(null);
        sound.click();
      });

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);
        setSelectedLink(null);
        sound.click();
      });

    node.append('circle')
      .attr('r', d => d.type === 'case_files' ? 14 : 10)
      .attr('fill', d => getNodeColor(d.type, d.rating))
      .attr('stroke', '#000')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.label)
      .attr('x', 14)
      .attr('y', 4)
      .style('font-family', 'monospace')
      .style('font-size', '10px')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node
        .attr('transform', d => \`translate(\${d.x},\${d.y})\`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, filterType, searchQuery]);

  const handleOpenEntity = () => {
    if (!selectedNode) return;
    if (selectedNode.type === 'case_files') {
      const id = selectedNode.id.replace('case_files_', '');
      onOpenCase(id);
    } else if (onOpenEntity) {
      // type might be 'people', 'organisations', 'locations'
      // id has format type_id
      const parts = selectedNode.id.split('_');
      const id = parts.pop()!;
      onOpenEntity(selectedNode.type, id);
    }
  };

  return (
    <div className="flex-1 w-full h-full relative flex flex-col bg-[#050505] overflow-hidden" ref={containerRef}>
      
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 w-[calc(100%-2rem)] max-w-4xl pointer-events-auto">
        <div className="flex items-center bg-[#0D0D0D]/95 border border-[#00E5FF]/30 p-1 rounded-sm shadow-xl flex-1 max-w-md">
          <div className="pl-3 pr-2 py-1.5 flex items-center border-r border-[#00E5FF]/20">
            <Search className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <input 
            type="text" 
            placeholder="Search nexus nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs mono w-full px-3 py-1.5"
          />
        </div>
        
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#0D0D0D]/95 border border-[#00E5FF]/30 text-[#00E5FF] text-xs mono font-bold px-3 py-2.5 outline-none shadow-xl cursor-pointer"
        >
          <option value="ALL">ALL CLASSIFICATIONS</option>
          <option value="case_files">CASE FILES</option>
          <option value="people">PEOPLE</option>
          <option value="organisations">ORGANISATIONS</option>
          <option value="locations">LOCATIONS</option>
          <option value="events">EVENTS</option>
        </select>

        <button 
          onClick={handleReset}
          className="bg-[#0D0D0D]/95 border border-white/20 hover:border-[#00E5FF]/50 text-white hover:text-[#00E5FF] p-2.5 shadow-xl transition-colors"
          title="Reset Graph"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {loading && (
          <div className="text-cyan-400 font-mono text-xs animate-pulse">
            TRANSMITTING...
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing"></svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col p-3 bg-[#0D0D0D]/95 border border-white/10 max-w-[220px] pointer-events-auto shadow-xl">
        <div className="text-[10px] font-bold mb-2 mono text-[#00E5FF] tracking-wider uppercase">
          MAP LEGEND
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Case File</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Person</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Organisation</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Location</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#A855F7]"></span>
          <span className="text-[9px] mono uppercase text-white/70">Event</span>
        </div>
      </div>

      {/* Selected Entity Inspector Drawer */}
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
          <h4 className="text-sm font-mono font-bold text-white mb-2">
            {selectedNode.label}
          </h4>
          
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => handleExpandNode(selectedNode.id)}
              className="w-full py-2 bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-400 text-xs font-mono font-bold transition-colors"
            >
              EXPAND CONNECTIONS
            </button>
            <button
              onClick={handleOpenEntity}
              className="w-full py-2 bg-[#00E5FF] hover:bg-[#33ebff] text-black text-xs font-mono font-black transition-colors"
            >
              VIEW DOSSIER
            </button>
          </div>
        </div>
      )}

      {/* Selected Edge Inspector Drawer */}
      {selectedLink && (
        <div className="absolute top-16 right-4 z-30 w-80 border border-amber-500/50 bg-[#0D0D0D]/95 backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-right-4 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span className="text-[9px] mono font-bold text-amber-400 uppercase tracking-wider">
              RELATIONSHIP INSPECTOR
            </span>
            <button onClick={() => setSelectedLink(null)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-500 block mb-1">SOURCE</span>
              <span className="text-cyan-400 font-bold">
                {typeof selectedLink.source === 'object' ? (selectedLink.source as any).label : selectedLink.source}
              </span>
            </div>
            
            <div className="py-2 border-y border-gray-800 flex flex-col items-center justify-center">
              <span className="text-[10px] text-amber-400 font-bold tracking-widest">{selectedLink.relationship}</span>
              <ArrowRight className="w-4 h-4 text-gray-500 my-1" />
              <span className="text-[10px] text-gray-500">{selectedLink.verified ? 'VERIFIED CONNECTION' : 'UNVERIFIED / DISPUTED'}</span>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">TARGET</span>
              <span className="text-cyan-400 font-bold">
                {typeof selectedLink.target === 'object' ? (selectedLink.target as any).label : selectedLink.target}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
