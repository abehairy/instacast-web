import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidChart = ({ chart, onNodeClick }) => {
  const [isMermaidInitialized, setIsMermaidInitialized] = useState(false);
  const mermaidRef = useRef(null);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      theme: 'default',
      themeVariables: {
        primaryColor: '#4B9CD3',
        primaryBorderColor: '#1B75BB',
        primaryTextColor: '#333333',
        lineColor: '#1B75BB',
        textColor: '#333333',
        mainBkg: '#E1EFFF',
        edgeLabelBackground: '#e8e8e8',
      },
      startOnLoad: false
    });

    setIsMermaidInitialized(true);
  }, []);

  // Attach event listeners to nodes
  const addNodeEventListeners = () => {
    const nodes = mermaidRef.current.querySelectorAll('.node');
    console.log(nodes)

    nodes.forEach(node => {
      node.classList.add('hover:bg-black', 'hover:border-blue-500', 'hover:bg-blue-100', 'cursor-pointer');

      node.addEventListener('click', () => {
        node.style.cursor = 'pointer'; // Optional: change cursor on hover
        console.log(node)

        if (onNodeClick) {
          console.log(node)
          onNodeClick(node);
        }
      });
    });
  };

  // Render Mermaid chart
  useEffect(() => {
    if (isMermaidInitialized && mermaidRef.current) {

      try {
        mermaidRef.current.innerHTML = chart;
        mermaid.init({}, mermaidRef.current);
        setTimeout(addNodeEventListeners, 500)


      } catch (err) {
        console.error('Mermaid rendering error:', err);
      }
    }
  }, [chart, isMermaidInitialized]);

  return <div className="mermaid" ref={mermaidRef}></div>;
};

export default MermaidChart;
