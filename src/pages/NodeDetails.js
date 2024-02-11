import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom"; // Import useParams

import Layout from '../components/shared/Layout';
import PageHeader from '../components/shared/PageHeader';
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from '../callApi';


const NodeDetails = () => {
  const { node, sub } = useParams(); // Retrieve the `app` parameter from the URL
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const { getAccessTokenSilently } = useAuth0();
  const callApi = useApi();


  const callAskLifeApi = async (query) => {
    try {
      const response = await callApi(`/lifegraph/ask?cypher_query=${query}`);
      // const data = await response.text();
      console.log(data);
      return data
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    async function fetchData() {
      try {
        // This endpoint should return only top-level nodes like "People", "Places", etc.
        const data = await callApi('/lifegraph/top');

        setGraphData(data);

        // for (const node of data.nodes) {
        //   node.summary = await callAskLifeApi(`give a bio summary of ${node.label}`)
        // }
      } catch (error) {
        console.error("Error fetching the graph data:", error);
      }
    }

    fetchData();
    //callAskLifeApi()
  }, []);


  return (
    <Layout>
      <PageHeader title={node} />


      <section class="py-4 overflow-hidden">
        <div class="container px-4 mx-auto">
          <div class="p-6 bg-white border rounded-lg">
            <div class="flex flex-wrap -m-2.5">
              <div class="w-full sm:w-1/2 p-2.5">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <h3 class="font-heading mb-2 text-lg font-semibold">Payment activity</h3>
                    <p class="mb-6 text-neutral-500">It is a long established fact that is a reader will be distracted by content of a page when looking at its layout.</p>
                  </div>
                  <div class="block"><a class="inline-flex flex-wrap items-center justify-center px-5 py-3 text-center text-neutral-50 font-medium bg-gradient-purple-left hover:bg-gradient-purple-left-dark rounded-lg transition duration-300" href="#"><span class="mr-3 font-medium">Get Started</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33333 3.3335L14 8.00016M14 8.00016L9.33333 12.6668M14 8.00016L2 8.00016" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg></a></div>
                </div>
              </div>
              <div class="w-full sm:w-1/2 p-2.5">
                <div class="flex flex-wrap -m-3">
                  <div class="w-full sm:w-1/2 p-3">
                    <div class="p-3 bg-neutral-100 rounded-lg">
                      <div class="flex items-center justify-center mb-4 w-8 h-8 bg-white rounded-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.13823 5.57769C8.31921 5.78626 8.635 5.80863 8.84357 5.62765C9.05214 5.44667 9.07451 5.13088 8.89353 4.92231L8.13823 5.57769ZM5.86178 8.42231C5.6808 8.21374 5.36501 8.19137 5.15644 8.37235C4.94787 8.55333 4.9255 8.86912 5.10648 9.07769L5.86178 8.42231ZM7.5 4.08333C7.5 3.80719 7.27614 3.58333 7 3.58333C6.72386 3.58333 6.5 3.80719 6.5 4.08333H7.5ZM6.5 9.91666C6.49999 10.1928 6.72385 10.4167 6.99999 10.4167C7.27613 10.4167 7.49999 10.1928 7.5 9.91668L6.5 9.91666ZM11.75 7C11.75 9.62335 9.62335 11.75 7 11.75V12.75C10.1756 12.75 12.75 10.1756 12.75 7H11.75ZM7 11.75C4.37665 11.75 2.25 9.62335 2.25 7H1.25C1.25 10.1756 3.82436 12.75 7 12.75V11.75ZM2.25 7C2.25 4.37665 4.37665 2.25 7 2.25V1.25C3.82436 1.25 1.25 3.82436 1.25 7H2.25ZM7 2.25C9.62335 2.25 11.75 4.37665 11.75 7H12.75C12.75 3.82436 10.1756 1.25 7 1.25V2.25ZM7 6.5C6.6017 6.5 6.26371 6.39147 6.03991 6.24227C5.81262 6.09074 5.75 5.93631 5.75 5.83333H4.75C4.75 6.37469 5.07913 6.8036 5.48521 7.07432C5.89479 7.34737 6.43181 7.5 7 7.5V6.5ZM5.75 5.83333C5.75 5.73036 5.81262 5.57593 6.03991 5.4244C6.26371 5.2752 6.6017 5.16667 7 5.16667V4.16667C6.43181 4.16667 5.89479 4.3193 5.48521 4.59235C5.07913 4.86307 4.75 5.29198 4.75 5.83333H5.75ZM7 5.16667C7.54442 5.16667 7.95484 5.36634 8.13823 5.57769L8.89353 4.92231C8.47175 4.43623 7.75107 4.16667 7 4.16667V5.16667ZM7 7.5C7.3983 7.5 7.73629 7.60853 7.96009 7.75773C8.1874 7.90927 8.25001 8.06369 8.25001 8.16667H9.25001C9.25001 7.62531 8.92087 7.1964 8.51479 6.92568C8.10521 6.65263 7.56819 6.5 7 6.5V7.5ZM6.5 4.08333V4.66667H7.5V4.08333H6.5ZM6.50001 9.33332L6.5 9.91666L7.5 9.91668L7.50001 9.33334L6.50001 9.33332ZM7.00001 8.83333C6.45559 8.83333 6.04517 8.63366 5.86178 8.42231L5.10648 9.07769C5.52826 9.56377 6.24895 9.83333 7.00001 9.83333L7.00001 8.83333ZM8.25001 8.16667C8.25001 8.26964 8.18739 8.42407 7.9601 8.5756C7.7363 8.7248 7.39832 8.83333 7.00001 8.83333V9.83333C7.56821 9.83333 8.10522 9.6807 8.5148 9.40765C8.92088 9.13693 9.25001 8.70802 9.25001 8.16667H8.25001ZM6.5 4.66667L6.50001 9.33333L7.50001 9.33333L7.5 4.66667L6.5 4.66667Z" fill="#495460"></path>
                        </svg>
                      </div>
                      <p class="mb-0.5 text-xs font-medium text-neutral-400">Income</p>
                      <h3 class="font-heading font-semibold">$38,570</h3>
                    </div>
                  </div>
                  <div class="w-full sm:w-1/2 p-3">
                    <div class="p-3 bg-neutral-100 rounded-lg">
                      <div class="flex items-center justify-center mb-4 w-8 h-8 bg-white rounded-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 2.91699L5.60355 2.56344L5.45711 2.41699H5.25V2.91699ZM6.41667 4.08366L6.06311 4.43721L6.20956 4.58366H6.41667V4.08366ZM9.41667 5.83366C9.41667 6.1098 9.64052 6.33366 9.91667 6.33366C10.1928 6.33366 10.4167 6.1098 10.4167 5.83366H9.41667ZM2.25 9.91699V4.08366H1.25V9.91699H2.25ZM2.91667 3.41699H5.25V2.41699H2.91667V3.41699ZM4.89645 3.27055L6.06311 4.43721L6.77022 3.73011L5.60355 2.56344L4.89645 3.27055ZM6.41667 4.58366H8.75V3.58366H6.41667V4.58366ZM8.75 4.58366C9.11819 4.58366 9.41667 4.88214 9.41667 5.25033H10.4167C10.4167 4.32985 9.67048 3.58366 8.75 3.58366V4.58366ZM2.25 4.08366C2.25 3.71547 2.54848 3.41699 2.91667 3.41699V2.41699C1.99619 2.41699 1.25 3.16318 1.25 4.08366H2.25ZM1.25 9.91699C1.25 10.8375 1.99619 11.5837 2.91667 11.5837V10.5837C2.54848 10.5837 2.25 10.2852 2.25 9.91699H1.25ZM9.41667 5.25033V5.83366H10.4167V5.25033H9.41667ZM4.58333 7.00033C4.58333 6.63214 4.88181 6.33366 5.25 6.33366V5.33366C4.32953 5.33366 3.58333 6.07985 3.58333 7.00033H4.58333ZM5.25 6.33366H11.0833V5.33366H5.25V6.33366ZM11.0833 6.33366C11.4515 6.33366 11.75 6.63214 11.75 7.00033H12.75C12.75 6.07985 12.0038 5.33366 11.0833 5.33366V6.33366ZM11.75 7.00033V9.91699H12.75V7.00033H11.75ZM11.75 9.91699C11.75 10.2852 11.4515 10.5837 11.0833 10.5837V11.5837C12.0038 11.5837 12.75 10.8375 12.75 9.91699H11.75ZM11.0833 10.5837H2.91667V11.5837H11.0833V10.5837ZM2.91667 11.5837C3.83714 11.5837 4.58333 10.8375 4.58333 9.91699H3.58333C3.58333 10.2852 3.28486 10.5837 2.91667 10.5837V11.5837ZM4.58333 9.91699V7.00033H3.58333V9.91699H4.58333Z" fill="#495460"></path>
                        </svg>
                      </div>
                      <p class="mb-0.5 text-xs font-medium text-neutral-400">Down Payment</p>
                      <h3 class="font-heading font-semibold">$42,365</h3>
                    </div>
                  </div>
                  <div class="w-full sm:w-1/2 p-3">
                    <div class="p-3 bg-neutral-100 rounded-lg">
                      <div class="flex items-center justify-center mb-4 w-8 h-8 bg-white rounded-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.33333 5.83333V5.33333C2.05719 5.33333 1.83333 5.55719 1.83333 5.83333H2.33333ZM11.6667 5.83333H12.1667C12.1667 5.55719 11.9428 5.33333 11.6667 5.33333V5.83333ZM11.6667 12.25V12.75C11.9428 12.75 12.1667 12.5261 12.1667 12.25H11.6667ZM2.33333 12.25H1.83333C1.83333 12.5261 2.05719 12.75 2.33333 12.75V12.25ZM5.16667 8.16667C5.16667 7.89052 4.94281 7.66667 4.66667 7.66667C4.39052 7.66667 4.16667 7.89052 4.16667 8.16667H5.16667ZM4.16667 9.91667C4.16667 10.1928 4.39052 10.4167 4.66667 10.4167C4.94281 10.4167 5.16667 10.1928 5.16667 9.91667H4.16667ZM7.5 8.16667C7.5 7.89052 7.27614 7.66667 7 7.66667C6.72386 7.66667 6.5 7.89052 6.5 8.16667H7.5ZM6.5 9.91667C6.5 10.1928 6.72386 10.4167 7 10.4167C7.27614 10.4167 7.5 10.1928 7.5 9.91667H6.5ZM9.83333 8.16667C9.83333 7.89052 9.60948 7.66667 9.33333 7.66667C9.05719 7.66667 8.83333 7.89052 8.83333 8.16667H9.83333ZM8.83333 9.91667C8.83333 10.1928 9.05719 10.4167 9.33333 10.4167C9.60948 10.4167 9.83333 10.1928 9.83333 9.91667H8.83333ZM1.75 11.75C1.47386 11.75 1.25 11.9739 1.25 12.25C1.25 12.5261 1.47386 12.75 1.75 12.75V11.75ZM12.25 12.75C12.5261 12.75 12.75 12.5261 12.75 12.25C12.75 11.9739 12.5261 11.75 12.25 11.75V12.75ZM1.75 5.33333C1.47386 5.33333 1.25 5.55719 1.25 5.83333C1.25 6.10948 1.47386 6.33333 1.75 6.33333V5.33333ZM12.25 6.33333C12.5261 6.33333 12.75 6.10948 12.75 5.83333C12.75 5.55719 12.5261 5.33333 12.25 5.33333V6.33333ZM1.54693 3.62643C1.29459 3.73858 1.18094 4.03406 1.29309 4.2864C1.40525 4.53874 1.70073 4.65239 1.95307 4.54024L1.54693 3.62643ZM7 1.75L7.20307 1.29309C7.07379 1.23564 6.92621 1.23564 6.79693 1.29309L7 1.75ZM12.0469 4.54024C12.2993 4.65239 12.5948 4.53874 12.7069 4.2864C12.8191 4.03406 12.7054 3.73858 12.4531 3.62643L12.0469 4.54024ZM2.33333 6.33333H11.6667V5.33333H2.33333V6.33333ZM11.1667 5.83333V12.25H12.1667V5.83333H11.1667ZM11.6667 11.75H2.33333V12.75H11.6667V11.75ZM2.83333 12.25V5.83333H1.83333V12.25H2.83333ZM4.16667 8.16667V9.91667H5.16667V8.16667H4.16667ZM6.5 8.16667V9.91667H7.5V8.16667H6.5ZM8.83333 8.16667V9.91667H9.83333V8.16667H8.83333ZM1.75 12.75H12.25V11.75H1.75V12.75ZM1.75 6.33333H12.25V5.33333H1.75V6.33333ZM1.95307 4.54024L7.20307 2.20691L6.79693 1.29309L1.54693 3.62643L1.95307 4.54024ZM6.79693 2.20691L12.0469 4.54024L12.4531 3.62643L7.20307 1.29309L6.79693 2.20691Z" fill="#495460"></path>
                        </svg>
                      </div>
                      <p class="mb-0.5 text-xs font-medium text-neutral-400">Bank Debit</p>
                      <h3 class="font-heading font-semibold">$28,148</h3>
                    </div>
                  </div>
                  <div class="w-full sm:w-1/2 p-3">
                    <div class="p-3 bg-neutral-100 rounded-lg">
                      <div class="flex items-center justify-center mb-4 w-8 h-8 bg-white rounded-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.75 12.25L1.30279 12.0264C1.21652 12.1989 1.23719 12.4057 1.3559 12.5577C1.4746 12.7097 1.67017 12.7799 1.85847 12.7381L1.75 12.25ZM7 1.75L7.44721 1.52639C7.36252 1.357 7.18939 1.25 7 1.25C6.81061 1.25 6.63748 1.357 6.55279 1.52639L7 1.75ZM12.25 12.25L12.1415 12.7381C12.3298 12.7799 12.5254 12.7097 12.6441 12.5577C12.7628 12.4057 12.7835 12.1989 12.6972 12.0264L12.25 12.25ZM7.5 6.41667C7.5 6.14052 7.27614 5.91667 7 5.91667C6.72386 5.91667 6.5 6.14052 6.5 6.41667H7.5ZM2.19721 12.4736L7.44721 1.97361L6.55279 1.52639L1.30279 12.0264L2.19721 12.4736ZM6.55279 1.97361L11.8028 12.4736L12.6972 12.0264L7.44721 1.52639L6.55279 1.97361ZM12.3585 11.7619L7.10847 10.5952L6.89153 11.5714L12.1415 12.7381L12.3585 11.7619ZM6.89153 10.5952L1.64153 11.7619L1.85847 12.7381L7.10847 11.5714L6.89153 10.5952ZM7.5 11.0833V6.41667H6.5V11.0833H7.5Z" fill="#495460"></path>
                        </svg>
                      </div>
                      <p class="mb-0.5 text-xs font-medium text-neutral-400">Money Transfer</p>
                      <h3 class="font-heading font-semibold">$10,674</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default NodeDetails;
