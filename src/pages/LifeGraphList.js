import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import Layout from '../components/shared/Layout';
import PageHeader from '../components/shared/PageHeader';
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from '../callApi';
import Card from '../components/Card';


const LifeGraphList = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const { getAccessTokenSilently } = useAuth0();
  const { callApi } = useApi();

  async function fetchData() {
    try {
      const data = await callApi('/lifegraph/top', {}, null, { limit: 100 });

      setGraphData(data);
    } catch (error) {
      console.error("Error fetching the graph data:", error);
    }
  }



  useEffect(() => {

    fetchData();
  }, []);


  return (
    <Layout>
      <PageHeader title={'Life Graph'} />

      <section class="py-4 overflow-hidden">
        <div class="container px-4 mx-auto">
          <div class="relative">
            <ul class="relative z-10 inline-flex flex-wrap items-center -m-5">
              <li class="p-5"><a class="group relative flex-col items-center text-sm text-transparent font-medium bg-clip-text bg-gradient-purple-left" href="/lifegraph/viewer"><span class="inline-block pb-5">Graph View</span>
                <div class="h-0.5 bg-gradient-purple-left"></div></a></li>
              <li class="p-5"><a class="group relative flex-col items-center text-sm text-neutral-600 hover:text-transparent font-medium bg-clip-text hover:bg-gradient-purple-left" href="/lifegraph/list"><span class="inline-block pb-5">List View</span>
                <div class="h-0.5 bg-transparent group-hover:bg-gradient-purple-left"></div></a></li>
              {/* <li class="p-5"><a class="group relative flex-col items-center text-sm text-neutral-600 hover:text-transparent font-medium bg-clip-text hover:bg-gradient-purple-left" href="#"><span class="inline-block pb-5">Downloads</span>
                <div class="h-0.5 bg-transparent group-hover:bg-gradient-purple-left"></div></a></li>
              <li class="p-5"><a class="group relative flex-col items-center text-sm text-neutral-600 hover:text-transparent font-medium bg-clip-text hover:bg-gradient-purple-left" href="#"><span class="inline-block pb-5">Licenses</span>
                <div class="h-0.5 bg-transparent group-hover:bg-gradient-purple-left"></div></a></li>
              <li class="p-5"><a class="group relative flex-col items-center text-sm text-neutral-600 hover:text-transparent font-medium bg-clip-text hover:bg-gradient-purple-left" href="#"><span class="inline-block pb-5">Settings</span>
                <div class="h-0.5 bg-transparent group-hover:bg-gradient-purple-left"></div></a></li> */}
            </ul>
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-100"></div>
          </div>
        </div>
      </section>

      <section class="py-4 overflow-hidden">

        <div class="container px-4 mx-auto">
          <div class="flex flex-wrap -m-3">
            {graphData.nodes.map((graph) => (
              <Card node={graph}></Card>
              // <div class="w-full sm:w-1/3 p-3">
              //   <div class="p-6 h-full bg-white border rounded-lg">
              //     <div class="flex items-center justify-center w-10 h-10 mb-7 bg-gradient-purple-left rounded-full">
              //       <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              //         <path d="M10.0833 2.80029H10.8333C10.8333 2.58703 10.7425 2.38386 10.5837 2.24159C10.4248 2.09932 10.2129 2.0314 10.0009 2.05483L10.0833 2.80029ZM19.1996 11.9166L19.9451 11.999C19.9685 11.787 19.9006 11.5751 19.7584 11.4163C19.6161 11.2574 19.4129 11.1666 19.1996 11.1666V11.9166ZM10.0833 11.9166H9.33333C9.33333 12.3308 9.66912 12.6666 10.0833 12.6666V11.9166ZM18.7805 8.24994V8.99994C19.024 8.99994 19.2523 8.88176 19.3929 8.68298C19.5334 8.48419 19.5688 8.22954 19.4876 7.99999L18.7805 8.24994ZM13.75 8.24994H13C13 8.66416 13.3358 8.99994 13.75 8.99994V8.24994ZM13.75 3.21955L13.9999 2.51242C13.7704 2.43129 13.5157 2.46662 13.317 2.6072C13.1182 2.74777 13 2.97608 13 3.21955H13.75ZM3.5 10.9999C3.5 7.13998 6.41658 3.9602 10.1657 3.54575L10.0009 2.05483C5.50018 2.55237 2 6.36688 2 10.9999H3.5ZM11 18.4999C6.85786 18.4999 3.5 15.1421 3.5 10.9999H2C2 15.9705 6.02944 19.9999 11 19.9999V18.4999ZM18.4542 11.8342C18.0397 15.5834 14.86 18.4999 11 18.4999V19.9999C15.6331 19.9999 19.4476 16.4998 19.9451 11.999L18.4542 11.8342ZM19.1996 11.1666H10.0833V12.6666H19.1996V11.1666ZM10.8333 11.9166V2.80029H9.33333V11.9166H10.8333ZM18.7805 7.49994H13.75V8.99994H18.7805V7.49994ZM14.5 8.24994V3.21955H13V8.24994H14.5ZM13.5001 3.92668C15.6305 4.67968 17.3203 6.36946 18.0734 8.49989L19.4876 7.99999C18.5836 5.4423 16.5576 3.41644 13.9999 2.51242L13.5001 3.92668Z" fill="white"></path>
              //       </svg>
              //     </div>
              //     <h3 class="font-heading mb-3 text-lg font-semibold">
              //       <a href={"/lifegraph/" + graph.label}> {graph.label} ({graph.type}</a>
              //     </h3>
              //     <p class="text-neutral-500">{graph.properties.description || '..'}</p>
              //     <small class="text-neutral-700">{new Date(graph.last_updated).toDateString()}</small>
              //   </div>
              // </div>

            ))}


          </div>
        </div>
      </section>

    </Layout>
  );
};

export default LifeGraphList;
