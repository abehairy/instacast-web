import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import Layout from '../components/shared/Layout';
import PageHeader from '../components/shared/PageHeader';
import { useApi } from '../callApi';
import ReactFlow, { Background, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const LifeGraphFlow = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const { callApi } = useApi();
  const nodes = [
    { id: 'A', data: { label: 'Pre-submission Meeting' }, position: { x: 250, y: 50 } },
    { id: 'B', data: { label: 'Submit Dossier' }, position: { x: 250, y: 150 } },
    { id: 'C', data: { label: 'Initial Review' }, position: { x: 250, y: 250 } },
    { id: 'D', data: { label: 'Application Accepted' }, position: { x: 250, y: 350 } },
    { id: 'E', data: { label: 'Application Rejected' }, position: { x: 250, y: 450 } },
    { id: 'F', data: { label: 'Pharmacoeconomic Study' }, position: { x: 450, y: 150 } },
    { id: 'G', data: { label: 'Approve for Registration' }, position: { x: 450, y: 250 } },
    { id: 'H', data: { label: 'Re-Submission' }, position: { x: 450, y: 350 } },
    { id: 'I', data: { label: 'Additional Studies Required' }, position: { x: 450, y: 450 } },
    { id: 'J', data: { label: 'Re-evaluation' }, position: { x: 650, y: 150 } },
    { id: 'K', data: { label: 'Market Authorization Granted' }, position: { x: 650, y: 250 } }
  ];

  const edges = [
    { id: 'edge1', source: 'A', target: 'B', animated: true },
    { id: 'edge2', source: 'B', target: 'C', label: 'File Dossier' },
    { id: 'edge3', source: 'C', target: 'D', label: 'Review' },
    { id: 'edge4', source: 'C', target: 'E', label: 'Review', animated: true },
    { id: 'edge5', source: 'E', target: 'H', label: 'Rejection' },
    { id: 'edge6', source: 'D', target: 'F', label: 'Acceptance' },
    { id: 'edge7', source: 'F', target: 'G', label: 'Positive Outcome' },
    { id: 'edge8', source: 'G', target: 'K', label: 'Approval' },
    { id: 'edge9', source: 'H', target: 'B', label: 'Re-Submission' },
    { id: 'edge10', source: 'I', target: 'J', label: 'Additional Studies Required' },
    { id: 'edge11', source: 'J', target: 'I', label: 'Negative Outcome' },
    { id: 'edge12', source: 'J', target: 'G', label: 'Positive Outcome' }
  ];



  useEffect(() => {
    setGraphData({ nodes, edges })
    async function fetchData() {
      try {
        // This endpoint should return only top-level nodes like "People", "Places", etc.
        const response = await callApi('/lifegraph/top');
        const data = response

        const nodes = data.nodes.map((node, index) => ({
          id: node.id.toString(),
          data: { label: node.label },
          position: { x: 100 * index, y: 100 * index / 2 }, // Example positioning
          // style: { backgroundColor: node.color || 'lightgray' }
        }));


        const edges = data.links.map(link => ({
          id: `e${link.source}-${link.target}`,
          source: link.source.toString(),
          target: link.target.toString(),
          label: link.label
        }));

        setGraphData({ nodes: nodes, edges: edges });
      } catch (error) {
        console.error("Error fetching the graph data:", error);
      }
    }

    // fetchData();
  }, []);

  const convertToReactFlowFormat = (data) => {



    console.log(nodes, edges)

    return { nodes, edges };
  };

  const handleNodeClick = async node => {
    console.log(`Clicked on node: ${node.id}`);
    return

  };


  return (
    <Layout>
      <PageHeader title={'Life Graph'} />
      <div className="graph-chat-container">
        <div style={{ width: '400px', height: '400px' }} className="graph-component">
          <ReactFlow
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeClick={handleNodeClick}
            style={{ width: '500px', height: '500px' }} // Set your desired size
          >
            <Background color="#aaa" gap={16} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </Layout>
  );



};

export default LifeGraphFlow;
