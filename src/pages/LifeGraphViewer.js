import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import Layout from '../components/shared/Layout';
import PageHeader from '../components/shared/PageHeader';
import { useApi } from '../callApi';
import { InfinitySpin } from 'react-loader-spinner';

const LifeGraphViewer = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(false);

  const { callApi } = useApi();


  useEffect(() => {
    //setGraphData({ nodes: mockNodes, links: mockLinks })

    setIsLoading(true)
    async function fetchData() {
      try {
        // This endpoint should return only top-level nodes like "People", "Places", etc.
        const response = await callApi('/lifegraph/top');
        const data = response
        console.log(data)
        setGraphData(data);
        setIsLoading(false)

      } catch (error) {
        setIsLoading(false)

        console.error("Error fetching the graph data:", error);
      }
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       // This endpoint should return only top-level nodes like "People", "Places", etc.
  //       const response = await fetch('http://0.0.0.0:8000/api/lifegraph/top-level-nodes');
  //       const data = await response.json();

  //       //Define initial positions for top - level nodes
  //       const nodeSpacing = 200;  // adjust this based on your preference
  //       data.nodes.forEach((node, idx, array) => {
  //         node.x = (idx - array.length / 2) * nodeSpacing;
  //         node.y = 400 + (idx - array.length / 2) * nodeSpacing;

  //         // Fix the position of top-level nodes
  //         node.fx = node.x;
  //         node.fy = node.y;
  //       });

  //       console.log(data)
  //       setGraphData(data);
  //     } catch (error) {
  //       console.error("Error fetching the graph data:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);


  // const handleNodeClick = node => {
  //   console.log(`Clicked on node: ${node.id}`);
  // };

  const handleNodeClick = async node => {
    console.log(`Clicked on node: ${node.id}`);
    return

    try {
      // This endpoint should return nodes related to the clicked node type (e.g., specific people for "People").
      const response = await fetch(`http://0.0.0.0:8000/api/lifegraph/nodes/${node.id}`);
      const data = await response.json();

      // Merge the new data with the existing data
      setGraphData(prevData => ({
        nodes: [...prevData.nodes, ...data.nodes],
        links: [...prevData.links, ...data.links]
      }));
    } catch (error) {
      console.error(`Error fetching related nodes for ${node.id}:`, error);
    }
  };

  // const nodeCanvasObject = (node, ctx, globalScale) => {
  //   const label = node.label;
  //   const fontSize = 12 / globalScale;
  //   ctx.font = `${fontSize}px Arial`;
  //   const textWidth = ctx.measureText(label).width;

  //   // Adjust the nodeRadius based on text width
  //   const nodeRadius = Math.max(30, textWidth / 2 + 10); // The '10' adds some padding

  //   // Draw a big circle for the node
  //   ctx.beginPath();
  //   ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);

  //   // Use the node's color or a default one
  //   ctx.fillStyle = node.color || 'skyblue';
  //   ctx.fill();

  //   // Text settings
  //   ctx.textAlign = 'center';
  //   ctx.textBaseline = 'middle';
  //   ctx.fillStyle = 'white';  // font color
  //   ctx.fillText(label, node.x, node.y);
  // };


  // const nodeCanvasObject = (node, ctx, globalScale) => {
  //   const label = node.label;
  //   const fontSize = 12 / globalScale;
  //   ctx.font = `${fontSize}px Arial`;
  //   const textWidth = ctx.measureText(label).width;
  //   //const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

  //   ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  //   //ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

  //   ctx.textAlign = 'center';
  //   ctx.textBaseline = 'middle';
  //   ctx.fillStyle = node.color;
  //   ctx.fillText(label, node.x, node.y);
  // };

  const isLeafNode = (nodeId, links) => {
    console.log(nodeId, links)
    // Filter links where the node is the source or target
    const relatedLinks = links.filter(link => link.source.id === nodeId || link.target.id === nodeId);

    console.log(relatedLinks)
    // If the node has no outgoing links and only one or zero incoming links, it's a leaf node
    const outgoingLinks = relatedLinks.filter(link => link.source.id === nodeId);
    const incomingLinks = relatedLinks.filter(link => link.target.id === nodeId);

    return outgoingLinks.length === 0 && incomingLinks.length <= 1;
  }

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.label;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(label).width;

    // Define circle radius based on label length, with some padding
    const radius = Math.max(10);  // 10 for padding

    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color || 'lightgray'; // node color or default to lightgray
    ctx.fill();

    // Draw node label in the circle
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';  // text color
    ctx.fillText(label, node.x, node.y);
  };
  const linkCanvasObject = (link, ctx, globalScale) => {
    // Fetch the start and end points of the link
    const start = link.source;
    const end = link.target;

    // Draw the link line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';  // Adjust link color if needed
    ctx.lineWidth = 0.3;  // Adjust line width if needed
    link.distance = 10
    ctx.stroke();

    // Find the midpoint of the link for placing the label
    const middleX = (start.x + end.x) / 2;
    const middleY = (start.y + end.y) / 2;

    // Define the relation label
    const label = link.label || link.type; // Use a default name if not provided in the link object

    // Set font settings for the label
    const fontSize = 10 / globalScale;
    ctx.font = `${fontSize}px Arial`;

    // Draw the relation label at the midpoint of the link
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';  // Adjust text color if needed
    ctx.fillText(label, middleX, middleY);
  };


  return (
    <Layout>
      <PageHeader title={'Life Graph'} icon={'lifegraph.svg'} />

      <section class="py-4 overflow-hidden">
        <div class="container px-4 mx-auto">
          <div class="relative">
            <ul class="relative z-10 inline-flex flex-wrap items-center -m-5">
              <li class="p-5"><a class="group relative flex-col items-center text-sm text-transparent font-medium bg-clip-text bg-gradient-purple-left" href="/lifegraph/viewer"><span class="inline-block pb-5">Graph View</span>
                <div class="h-0.5 bg-gradient-purple-left"></div></a></li>
              <li class="p-5"><a class="group relative flex-col items-center text-sm text-neutral-600 hover:text-transparent font-medium bg-clip-text hover:bg-gradient-purple-left" href="/lifegraph/list"><span class="inline-block pb-5">List View</span>
                <div class="h-0.5 bg-transparent group-hover:bg-gradient-purple-left"></div></a></li>
            </ul>
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-100"></div>
          </div>
        </div>
      </section>
      {isLoading && <InfinitySpin
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
    </Layout>
  );
};

export default LifeGraphViewer;
