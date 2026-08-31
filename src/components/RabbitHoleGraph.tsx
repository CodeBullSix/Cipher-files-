import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../types';
import { ApiService } from '../services/apiService';
import { 
  Share2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  X,
  RefreshCw,
  Target,
  FileText,
  MapPin,
  Building,
  User,
  Calendar,
  Layers,
  Folder
} from 'lucide-react';
import { sound } from '../utils/audio';

interface RabbitHoleGraphProps {
  onOpenCase: (id: string) => void;
  onReputationEarned: (amount: number, reason: string, persist?: boolean) => void;
  onOpenEntity?: (type: string, id: string) => void;
  initialSelectedEntity?: string | null;
  onRandomRabbitHole?: () => void;
}

export const RabbitHoleGraph: React.FC<RabbitHoleGraphProps> = ({ 
  onOpenCase, 
  onReputationEarned, 
  onOpenEntity, 
  initialSelectedEntity,
  onRandomRabbitHole
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);


  // Refs for D3
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const linkGroupRef = useRef<any>(null);
  const nodeGroupRef = useRef<any>(null);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'case_files': return '#10B981';
      case 'people': return '#00E5FF';
      case 'organisations': return '#F59E0B';
      case 'locations': return '#38BDF8';
      case 'events': return '#A855F7';
      default: return '#6B7280';
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
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
        setNodes(data.nodes);
        setLinks(data.edges);
      } catch (err: any) {
        console.error(err);
        setError(err.message === "AUTHENTICATION REQUIRED" ? "AUTHENTICATION REQUIRED" : "Failed to load nexus data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [initialSelectedEntity]);

  const handleReset = async () => {
    sound.click();
    setSelectedNode(null);
    setSelectedLink(null);
    setSearchQuery('');
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getInitialGraphNodes();
      setNodes(data.nodes);
      setLinks(data.edges);
    } catch (err: any) {
      setError(err.message === "AUTHENTICATION REQUIRED" ? "AUTHENTICATION REQUIRED" : "Failed to reset nexus data.");
    } finally {
      setLoading(false);
    }
  };

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

      onReputationEarned(10, "Expanded Rabbit Hole Nexus", true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleRandomNode = () => {
    sound.playWarp();
    if (nodes.length > 0) {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setSelectedNode(randomNode);
      setSelectedLink(null);
      
      // Center the node
      if (randomNode.x && randomNode.y && svgRef.current) {
        const svg = d3.select(svgRef.current);
        const width = containerRef.current?.clientWidth || 800;
        const height = containerRef.current?.clientHeight || 600;
        svg.transition().duration(750).call(
          d3.zoom().transform as any, 
          d3.zoomIdentity.translate(width / 2 - randomNode.x, height / 2 - randomNode.y)
        );
      }
    }
  };

  // Initialize SVG and Simulation ONCE
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clean up initial
    
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Setup zoom container
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (e) => {
        g.attr('transform', e.transform);
      });
    svg.call(zoom);

    // Initial transform
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));

    linkGroupRef.current = g.append('g').attr('class', 'links');
    nodeGroupRef.current = g.append('g').attr('class', 'nodes');

    simulationRef.current = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('collide', d3.forceCollide().radius(30))
      .force('x', d3.forceX().strength(0.05))
      .force('y', d3.forceY().strength(0.05));

    return () => {
      simulationRef.current?.stop();
    };
  }, []); // Run once on mount

  // Update D3 when data changes
  useEffect(() => {
    if (!simulationRef.current || !linkGroupRef.current || !nodeGroupRef.current) return;
    if (nodes.length === 0) return;

    const simulation = simulationRef.current;
    
    // Process filter
    const filteredNodes = filterType === 'ALL' ? nodes : nodes.filter(n => n.type === filterType || n.type === 'case_files');
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });



    // Data join for links
    let link = linkGroupRef.current.selectAll('line')
      .data(filteredLinks, (d: any) => d.id);
      
    link.exit().remove();
    
    const linkEnter = link.enter().append('line')
      .attr('stroke', (d: any) => d.verified ? 'rgba(0, 229, 255, 0.2)' : 'rgba(245, 158, 11, 0.4)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d: any) => d.verified ? 'none' : '4,4')
      .attr('cursor', 'pointer');

    link = linkEnter.merge(link);
    
    link.on('click', (event: any, d: any) => {
      sound.click();
      setSelectedLink(d);
      setSelectedNode(null);
    });

    // Data join for nodes
    let node = nodeGroupRef.current.selectAll('g.node-group')
      .data(filteredNodes, (d: any) => d.id);
      
    node.exit().remove();

    const nodeEnter = node.enter().append('g')
      .attr('class', 'node-group')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    // Background circles
    nodeEnter.append('circle')
      .attr('r', 20)
      .attr('fill', '#050505')
      .attr('stroke', (d: any) => getNodeColor(d.type))
      .attr('stroke-width', 2);

    // Icons
    nodeEnter.append('text')
      .attr('class', 'icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d: any) => getNodeColor(d.type))
      .attr('font-size', '14px')
      .attr('font-family', 'monospace')
      .text((d: any) => {
        switch (d.type) {
          case 'case_files': return '📁';
          case 'people': return '👤';
          case 'organisations': return '🏢';
          case 'locations': return '📍';
          case 'events': return '📅';
          default: return '❓';
        }
      });

    // Labels
    nodeEnter.append('text')
      .attr('class', 'label')
      .text((d: any) => d.label)
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('y', 30)
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)');

    node = nodeEnter.merge(node);
    
    node.on('click', (event: any, d: any) => {
      sound.click();
      setSelectedNode(d);
      setSelectedLink(null);
    });

    // Apply Search Highlighting
    node.selectAll('circle')
      .attr('stroke', (d: any) => getNodeColor(d.type))
      .attr('stroke-width', 2);

    node.selectAll('text.label')
      .attr('fill', (d: any) => {
        if (selectedNode?.id === d.id) return '#00E5FF';
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return '#00E5FF';
        return '#fff';
      });

    // Run simulation
    simulation.nodes(filteredNodes);
    (simulation.force('link') as any).links(filteredLinks);
    
    simulation.alpha(0.3).restart();

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
        
      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [nodes, links, filterType]);


  // Purely visual updates for selection and search (avoiding simulation restart)
  useEffect(() => {
    if (!nodeGroupRef.current) return;
    const node = nodeGroupRef.current.selectAll('.node');
    if (node.empty()) return;

    node.selectAll('circle')
      .attr('stroke', (d: any) => {
        if (selectedNode?.id === d.id) return '#fff';
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return '#fff';
        return getNodeColor(d.type);
      })
      .attr('stroke-width', (d: any) => {
        if (selectedNode?.id === d.id) return 4;
        if (searchQuery && (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())) return 4;
        return 2;
      });
  }, [selectedNode, searchQuery]);

  const handleOpenEntity = () => {
    if (!selectedNode) return;
    if (selectedNode.type === 'case_files') {
      const id = selectedNode.id.replace('case_files_', '');
      onOpenCase(id);
    } else if (onOpenEntity) {
      const parts = selectedNode.id.split('_');
      const id = parts.pop()!;
      onOpenEntity(selectedNode.type, id);
    }
  };

  return (
    <div className="flex-1 w-full h-full relative flex flex-col bg-cipher-base overflow-hidden rounded-xl border border-gray-800" ref={containerRef}>
      
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 w-[calc(100%-2rem)] pointer-events-auto">
        
        <select 
          value={filterType}
          onChange={(e) => { sound.click(); setFilterType(e.target.value); }}
          className="bg-cipher-elevated/95 border border-white/20 text-white text-[10px] font-mono p-2 rounded shadow-xl outline-none hover:border-cipher-accent/50 transition-colors"
        >
          <option value="ALL">ALL NODES</option>
          <option value="case_files">CASES</option>
          <option value="people">PEOPLE</option>
          <option value="organisations">ORGANISATIONS</option>
          <option value="locations">LOCATIONS</option>
          <option value="events">EVENTS</option>
          <option value="evidence">EVIDENCE</option>
        </select>

        <div className="flex items-center bg-cipher-elevated/95 border border-cipher-accent/30 p-1 rounded-sm shadow-xl min-w-[200px] max-w-sm flex-1">
          <div className="pl-3 pr-2 py-1.5 flex items-center border-r border-cipher-accent/20">
            <Search className="w-4 h-4 text-cipher-accent" />
          </div>
          <input 
            type="text" 
            placeholder="Highlight visible nodes..." aria-label="Highlight visible nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs mono w-full px-3 py-1.5"
          />
        </div>
        

        <button 
          onClick={handleRandomNode}
          className="bg-cipher-elevated/95 border border-white/20 hover:border-purple-400 hover:text-purple-400 text-white p-2.5 shadow-xl transition-colors flex items-center gap-2"
          title="Random Node"
        >
          <Target className="w-4 h-4" />
          <span className="text-[10px] font-mono font-bold hidden sm:inline">RANDOM NODE</span>
        </button>

        {onRandomRabbitHole && (
          <button 
            onClick={onRandomRabbitHole}
            className="bg-cipher-elevated/95 border border-white/20 hover:border-emerald-400 hover:text-emerald-400 text-white p-2.5 shadow-xl transition-colors flex items-center gap-2"
            title="Random Dossier"
          >
            <Folder className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold hidden sm:inline">RANDOM DOSSIER</span>
          </button>
        )}

        <button 
          onClick={handleReset}
          className="bg-cipher-elevated/95 border border-white/20 hover:border-cipher-accent/50 text-white hover:text-cipher-accent p-2.5 shadow-xl transition-colors"
          title="Reset Graph"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {loading && (
          <div className="text-cipher-accent font-mono text-xs animate-pulse bg-cyan-900/20 px-3 py-2 border border-cipher-accent/30">
            TRANSMITTING...
          </div>
        )}
      </div>
      
      {/* States Overlay */}
      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-cipher-base/90 backdrop-blur-sm pointer-events-none">
          <div className="border border-red-500/50 bg-red-950/80 p-6 max-w-md text-center shadow-2xl">
            <h3 className="text-red-400 font-mono font-bold text-sm mb-2">
              {error === 'AUTHENTICATION REQUIRED' ? 'AUTHENTICATION REQUIRED' : 'GRAPH CONNECTION FAILURE'}
            </h3>
            <p className="text-red-200/70 text-xs font-mono">
              {error === 'AUTHENTICATION REQUIRED' 
                ? 'Your secure session token is missing or expired. Please login to access the Knowledge Graph.' 
                : error}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && nodes.length === 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-cipher-base/50 backdrop-blur-sm pointer-events-none">
          <div className="border border-cipher-accent/50 bg-cipher-elevated/90 p-6 max-w-md text-center shadow-2xl rounded-xl">
            <h3 className="text-cipher-accent font-mono font-bold text-sm mb-2">NO RECORDS FOUND</h3>
            <p className="text-white/60 text-xs font-sans">No documented connections are currently available.</p>
          </div>
        </div>
      )}
      
      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing"></svg>


      {/* Selected Entity Inspector Drawer */}
      {selectedNode && (
        <div className="absolute bottom-0 sm:bottom-auto left-0 sm:left-auto sm:top-20 right-0 sm:right-4 z-30 w-full sm:w-80 max-h-[50vh] sm:max-h-[80vh] overflow-y-auto border-t sm:border border-cipher-accent/50 bg-cipher-elevated/95 rounded-t-xl sm:rounded-none backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-right-4 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span className="text-[9px] mono font-bold text-cipher-accent uppercase tracking-wider">
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
              className="w-full py-2 bg-cyan-950/40 border border-cipher-accent/40 hover:bg-cyan-900/60 text-cipher-accent text-[11px] font-mono font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              EXPAND CONNECTIONS
            </button>

            <button
              onClick={handleOpenEntity}
              className="w-full py-2 mt-2 bg-cipher-accent hover:bg-cipher-accent-hover text-black text-[11px] font-mono font-black transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              VIEW DOSSIER
            </button>
          </div>

        </div>
      )}

      {/* Selected Edge Inspector Drawer */}
      {selectedLink && (
        <div className="absolute bottom-0 sm:bottom-auto left-0 sm:left-auto sm:top-24 sm:right-4 z-30 w-full sm:w-80 border-t sm:border border-amber-500/50 bg-cipher-elevated/95 backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-150 pb-8 sm:pb-4 rounded-t-xl sm:rounded">
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
              <span className="text-cipher-accent font-bold">
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
              <span className="text-cipher-accent font-bold">
                {typeof selectedLink.target === 'object' ? (selectedLink.target as any).label : selectedLink.target}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
