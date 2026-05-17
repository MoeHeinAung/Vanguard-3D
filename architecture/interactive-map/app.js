let network = null;
const graphData = {
    "nodes": [
        { "id": "ui_dashboard", "label": "Dashboard", "group": "frontend", "path": "frontend/src/App.jsx", "description": "Main entry hub for the user interface." },
        { "id": "ui_draws", "label": "Draws Page", "group": "frontend", "path": "frontend/src/pages/DrawsPage.jsx", "description": "Interface for managing lottery draw lifecycles." },
        { "id": "ui_sales", "label": "Sales Page", "group": "frontend", "path": "frontend/src/pages/SalesPage.jsx", "description": "Interface for ticket entry and real-time validation." },
        { "id": "ui_offload", "label": "Offload Page", "group": "frontend", "path": "frontend/src/pages/OffloadPage.jsx", "description": "Interface for managing liability offloading to master dealers." },
        { "id": "ui_report", "label": "Report Page", "group": "frontend", "path": "frontend/src/pages/ReportPage.jsx", "description": "Financial and operational reporting view." },
        
        { "id": "bridge_api", "label": "API Bridge", "group": "bridge", "path": "main.py", "description": "The pywebview JS-to-Python bridge. Orchestrates all backend calls." },
        
        { "id": "svc_draw", "label": "Draw Service", "group": "service", "path": "backend/services/draw_service.py", "description": "Business logic for draw timing, status updates, and settlement triggers." },
        { "id": "svc_agent", "label": "Agent Service", "group": "service", "path": "backend/services/agent_service.py", "description": "Manages agent hierarchies and commission logic." },
        { "id": "svc_sale", "label": "Sale Service", "group": "service", "path": "backend/services/sale_service.py", "description": "Logic for parsing and persisting ticket sales." },
        { "id": "svc_settlement", "label": "Settlement Service", "group": "service", "path": "backend/services/settlement_service.py", "description": "Core engine for payout calculations and revenue aggregation." },
        
        { "id": "repo_draw", "label": "Draw Repository", "group": "repository", "path": "backend/repositories/draw_repository.py", "description": "SQL-based data access for draw records." },
        { "id": "repo_agent", "label": "Agent Repository", "group": "repository", "path": "backend/repositories/agent_repository.py", "description": "SQL-based data access for agent records." },
        
        { "id": "db_vanguard", "label": "Vanguard DB", "group": "database", "path": "backend/database/vanguard.db", "description": "SQLite database storage (WAL mode)." },
        { "id": "db_pool", "label": "Connection Pool", "group": "infra", "path": "backend/database/pool.py", "description": "Thread-safe connection manager for pywebview multi-threading." },
        
        { "id": "util_parser", "label": "Ticket Parser", "group": "infra", "path": "backend/utils/ticket_parser.py", "description": "Domain utility for parsing complex ticket input strings." }
    ],
    "edges": [
        { "from": "ui_dashboard", "to": "ui_draws", "label": "Navigate" },
        { "from": "ui_dashboard", "to": "ui_sales", "label": "Navigate" },
        { "from": "ui_dashboard", "to": "ui_offload", "label": "Navigate" },
        
        { "from": "ui_draws", "to": "bridge_api", "label": "Bridge Call" },
        { "from": "ui_sales", "to": "bridge_api", "label": "Bridge Call" },
        { "from": "ui_offload", "to": "bridge_api", "label": "Bridge Call" },
        
        { "from": "bridge_api", "to": "svc_draw", "label": "Invoke" },
        { "from": "bridge_api", "to": "svc_agent", "label": "Invoke" },
        { "from": "bridge_api", "to": "svc_sale", "label": "Invoke" },
        { "from": "bridge_api", "to": "svc_settlement", "label": "Invoke" },
        
        { "from": "svc_draw", "to": "repo_draw", "label": "Data Access" },
        { "from": "svc_agent", "to": "repo_agent", "label": "Data Access" },
        { "from": "svc_sale", "to": "db_pool", "label": "Query" },
        { "from": "svc_settlement", "to": "db_pool", "label": "Calculate" },
        
        { "from": "repo_draw", "to": "db_pool", "label": "Pooled Connection" },
        { "from": "repo_agent", "to": "db_pool", "label": "Pooled Connection" },
        
        { "from": "db_pool", "to": "db_vanguard", "label": "SQLite I/O" },
        
        { "from": "svc_sale", "to": "util_parser", "label": "Parse Input" }
    ]
};

const colors = {
    frontend: '#8b5cf6',
    bridge: '#06b6d4',
    service: '#10b981',
    repository: '#f59e0b',
    database: '#f43f5e',
    infra: '#64748b'
};

function init() {
    try {
        const nodes = new vis.DataSet(graphData.nodes.map(node => ({
            ...node,
            color: {
                background: colors[node.group] || '#64748b',
                border: 'rgba(255,255,255,0.1)',
                highlight: {
                    background: colors[node.group],
                    border: '#fff'
                }
            },
            font: { color: '#fff', size: 14, face: 'Inter' },
            shape: 'dot',
            size: 25
        })));

        const edges = new vis.DataSet(graphData.edges.map(edge => ({
            ...edge,
            arrows: 'to',
            color: { color: 'rgba(255,255,255,0.2)', highlight: '#06b6d4' },
            font: { color: '#94a3b8', size: 10, align: 'middle' },
            smooth: { type: 'curvedCW', roundness: 0.2 }
        })));

        const container = document.getElementById('network-container');
        const data = { nodes, edges };
        const options = {
            nodes: {
                borderWidth: 2,
                shadow: true
            },
            edges: {
                width: 1,
                shadow: true
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -100,
                    centralGravity: 0.01,
                    springLength: 150,
                    springConstant: 0.08
                },
                maxVelocity: 50,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: { iterations: 150 }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200
            }
        };

        network = new vis.Network(container, data, options);

        network.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = graphData.nodes.find(n => n.id === nodeId);
                showDetails(node);
            } else {
                hideDetails();
            }
        });

        // Search functionality
        document.getElementById('node-search').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (!term) return;
            
            const foundNode = graphData.nodes.find(n => 
                n.label.toLowerCase().includes(term) || 
                n.id.toLowerCase().includes(term)
            );
            
            if (foundNode) {
                network.focus(foundNode.id, { scale: 1.2, animation: true });
                showDetails(foundNode);
            }
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            network.fit({ animation: true });
            hideDetails();
        });

        document.getElementById('close-panel').addEventListener('click', hideDetails);

    } catch (error) {
        console.error("Failed to initialize graph:", error);
    }
}

function showDetails(node) {
    const panel = document.getElementById('info-panel');
    document.getElementById('component-name').textContent = node.label;
    document.getElementById('component-layer').textContent = node.group;
    document.getElementById('component-path').textContent = node.path;
    document.getElementById('component-description').textContent = node.description;
    
    // Find dependencies
    const deps = graphData.edges
        .filter(e => e.from === node.id)
        .map(e => graphData.nodes.find(n => n.id === e.to)?.label)
        .filter(Boolean);
        
    const list = document.getElementById('component-dependencies');
    list.innerHTML = deps.length > 0 
        ? deps.map(d => `<li>${d}</li>`).join('')
        : '<li>None</li>';

    panel.classList.remove('hidden');
}

function hideDetails() {
    document.getElementById('info-panel').classList.add('hidden');
}

window.addEventListener('load', init);
