import { useState, useEffect } from 'react';
import { useApi } from '../callApi';
import { ForceGraph2D } from 'react-force-graph';
import { InfinitySpin } from 'react-loader-spinner';

export default function GraphComponent(props) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi(props.demo);

  useEffect(() => {

    setLoading(true)
    async function fetchData() {
      try {
        const response = await callApi(`${props.demo || ''}/lifegraph/top`);
        const data = response
        console.log(data)
        setGraphData(data);
        setLoading(false)

      } catch (error) {
        setLoading(false)

        console.error("Error fetching the graph data:", error);
      }
    }

    fetchData();
  }, []);


  return (
    <>
      {loading && <InfinitySpin
        width='200'
        color="#7b60e8"
      />}

      <div className="graph-chat-container">

        <div className="graph-component">
          <ForceGraph2D
            graphData={graphData}
            nodeAutoColorBy="type"
            nodeLabel={'label'}
            // onNodeClick={handleNodeClick}
            // nodeCanvasObject={nodeCanvasObject}
            // linkCanvasObject={linkCanvasObject}
            enableZoomPanInteraction={true}
            enableNodeDrag={true}
          />
        </div>

      </div>
    </>
  );
}