import networkx as nx
from sqlalchemy.orm import Session
from backend import models, schemas

def get_reputation_network_graph(db: Session) -> schemas.ReputationGraphSchema:
    """
    Constructs a NetworkX directed graph from agent database records and reputation edges.
    Calculates PageRank score for each agent representing reputation network influence.
    Serializes output into nodes/edges schemas compatible with D3/SVG graph libraries.
    """
    agents = db.query(models.Agent).all()
    edges = db.query(models.ReputationEdge).all()
    
    G = nx.DiGraph()
    
    # Add nodes to graph
    for agent in agents:
        # Avoid loading retired/archived agents into the active collaboration network
        if agent.status == "retired":
            continue
        G.add_node(agent.id, db_obj=agent)
        
    # Add edges to graph
    for edge in edges:
        # Only add edge if both nodes are active in graph
        if edge.source_agent_id in G and edge.target_agent_id in G:
            # Graph weight combines interaction count and success rate
            weight = (edge.interaction_count * 0.1) * edge.success_rate
            G.add_edge(
                edge.source_agent_id, 
                edge.target_agent_id, 
                weight=max(0.1, weight),
                db_edge=edge
            )
            
    # Calculate PageRank influence scores
    influence_scores = {}
    if len(G) > 0:
        try:
            # Calculate pagerank based on edge weights
            influence_scores = nx.pagerank(G, weight="weight")
        except Exception:
            # Fallback if graph is completely disconnected
            influence_scores = {node: 1.0 / len(G) for node in G.nodes()}
            
    # Format graph output
    out_nodes = []
    out_edges = []
    
    for node_id in G.nodes():
        agent = G.nodes[node_id]["db_obj"]
        score = agent.trust_score.trust_score if agent.trust_score else 600
        influence = influence_scores.get(node_id, 0.0)
        
        # Scale influence score to make it highly legible (e.g., multiplier)
        influence_scaled = round(influence * 100, 2)
        
        out_nodes.append(
            schemas.GraphNode(
                id=agent.id,
                label=agent.name,
                status=agent.status,
                trust_score=score,
                career_stage=agent.career_stage,
                framework=agent.framework,
                influence=influence_scaled
            )
        )
        
    for u, v in G.edges():
        db_edge = G.edges[u, v]["db_edge"]
        out_edges.append(
            schemas.GraphEdge(
                source=u,
                target=v,
                weight=db_edge.interaction_count,
                success_rate=db_edge.success_rate
            )
        )
        
    return schemas.ReputationGraphSchema(nodes=out_nodes, edges=out_edges)
