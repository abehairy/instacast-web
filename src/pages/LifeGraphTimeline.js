import React, { useEffect, useRef } from 'react';
import Layout from '../components/shared/Layout';
import PageHeader from '../components/shared/PageHeader';
import { useApi } from '../callApi';

const LifeGraphTimeline = () => {
  const { callApi } = useApi();
  const timelineRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await callApi('/lifegraph/top?limit=100');
        const data = response;

        const timelineData = convertNeo4jDataToTimelineJS(data);
        new window.TL.Timeline(timelineRef.current, timelineData);
      } catch (error) {
        console.error("Error fetching the graph data:", error);
      }
    }

    fetchData();
  }, []);

  const convertNeo4jDataToTimelineJS = (data) => {
    const timelineData = {
      title: {
        text: {
          headline: "Life Graph",
          text: "A timeline view of events"
        }
      },
      events: []
    };

    data.nodes.forEach(node => {
      console.log(node)
      // Check if actual_Date is only a year or a full date
      var d = node.properties?.actual_date;

      const dateParts = (d || '2023-10-10').split('-'); // assuming the date is in 'YYYY-MM-DD' format
      const eventDate = {
        year: dateParts[0],
        month: dateParts[1] || '01', // Default to January if month is not provided
        day: dateParts[2] || '01'   // Default to the first day if day is not provided
      };

      const event = {
        start_date: eventDate,
        text: {
          headline: node.label,
          text: `Details for ${node.label}`
        }
      };

      timelineData.events.push(event);
    });

    return timelineData;
  };

  return (
    <Layout>
      <PageHeader title={'Life Graph'} />
      <div className="graph-chat-container">
        <div ref={timelineRef} id="timeline-embed" style={{ width: '100%', height: '600px' }} />
      </div>
    </Layout>
  );
};

export default LifeGraphTimeline;
