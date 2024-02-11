import React, { useEffect, useState, useRef } from "react";
import { redirect, useParams } from "react-router-dom"; // Import useParams
import Layout from "../components/shared/Layout";
import PageHeader from "../components/shared/PageHeader";
import { useApi } from '../callApi';
import { data } from "autoprefixer";
import { useLoading } from "../components/useLoading";


export default function AppSetup() {
  const { app, sub, action } = useParams(); // Retrieve the `app` parameter from the URL
  const [currentApp, setCurrentApp] = useState({});
  const [dataList, setDataList] = useState([]);
  const [summary, setSummary] = useState('');
  const [nodes, setNodes] = useState([]);
  const { load: loadImportData, isLoading: isLoadingImportData, LoaderComponent: ImportDataLoader } = useLoading();
  const { load: loadSecondData, isLoading: isLoadingSecondData, LoaderComponent: SecondDataLoader } = useLoading();

  const { callApi } = useApi();

  const onImport = async () => {
    return loadImportData(importData()).then(e => {
      redirect('/lifegraph')
    })
  }
  const importData = async () => {
    return await callApi(
      `/connect/load?app=${app}&sub=${sub}&action=${action}`,
      { 'method': 'POST' },
      { data: dataList });
  };
  const fetchData = async () => {
    return await callApi(`/connect/fetch?app=${app}&sub=${sub}&action=${action}`);

  };
  const summarizeData = async (data) => {
    return await callApi(
      `/connect/summarize?app=${app}&sub=${sub}&action=${action}`,
      { 'method': 'POST' },
      data);
  };
  const extractData = async (data) => {
    return await callApi(
      `/connect/extract?app=${app}&sub=${sub}&action=${action}`,
      { 'method': 'POST' },
      data);
  };

  const getAppDetails = async (app) => {
    return await callApi(`/apps/${app}`);
  };
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (app) {
        (getAppDetails(app))
          .then((appDetails) => {
            setCurrentApp(appDetails)
            return loadSecondData(fetchData());
          })
          .then((response) => {
            const data = response.data
            setDataList(data);
            // After fetchData, execute summarizeData
            summarizeData(response).then(summaryData => {
              console.log('got summary', summaryData);
              setSummary(summaryData);


            }).catch(error => {
              console.error('Error in summarizeData:', error);
            });

            // After fetchData, also execute extractData
            extractData(response).then(nodesData => {
              console.log('got nodes', nodesData);
              setNodes(nodesData);
            }).catch(error => {
              console.error('Error in extractData:', error);
            });


          })

      }
      hasRun.current = true;

    }
  }, []); // The useEffect will re-run when `app` changes


  return (
    <Layout>


      <PageHeader title={'Connect ' + (currentApp.name)} icon={currentApp.icon} />




      <div class="flex flex-wrap -mx-4 -mb-4 md:mb-0">
        <div class="w-full md:w-1/2 px-4 mb-4 md:mb-0">


          {isLoadingSecondData ?
            (
              SecondDataLoader) : (
              dataList.length > 0 && (
                <section class="py-4 overflow-hidden">
                  <div class="container px-4 mx-auto">
                    <div class="px-6 pt-5 pb-7 bg-white overflow-hidden border rounded-xl">
                      <h3 class="text-lg font-semibold">Summary Report</h3>
                      <p class="text-xsm mb-6 text-neutral-500">Things that will be pulled from {currentApp.name}</p>

                      <p>Found ({dataList.length}) entries in your {currentApp.name}</p>
                      <p className="bg-gray-200 px-6 pb-7 pb-5 rounded-xl">
                        {summary?.summary || 'loading summary ...'}
                      </p>
                      <ul class="mb-7">
                        {currentApp?.actions?.map((action) => (
                          <li class="flex flex-wrap items-center justify-between mb-4">
                            <div class="flex flex-wrap items-center mr-4">
                              <div class="mr-2 w-3.5 h-3.5 rounded-full bg-yellow-500"></div><span class="font-medium">{action.name}</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10" cy="10" r="10" fill="#564AF7"></circle>
                              <path d="M5.91602 10.5833L8.24935 12.9166L14.0827 7.08325" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </li>
                        ))}




                      </ul>

                      {isLoadingImportData ? (
                        ImportDataLoader
                      ) : (
                        <a onClick={onImport} class="inline-flex flex-wrap items-center justify-center px-5 py-3 w-full text-center text-neutral-50 font-medium bg-gradient-purple-left hover:bg-gradient-purple-left-dark rounded-lg transition duration-300" href="#">
                          <svg class="mr-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.74935 2.6665C8.74935 2.25229 8.41356 1.9165 7.99935 1.9165C7.58513 1.9165 7.24935 2.25229 7.24935 2.6665H8.74935ZM7.24935 13.3332C7.24935 13.7474 7.58513 14.0832 7.99935 14.0832C8.41356 14.0832 8.74935 13.7474 8.74935 13.3332H7.24935ZM13.3327 8.74984C13.7469 8.74984 14.0827 8.41405 14.0827 7.99984C14.0827 7.58562 13.7469 7.24984 13.3327 7.24984V8.74984ZM2.66602 7.24984C2.2518 7.24984 1.91602 7.58562 1.91602 7.99984C1.91602 8.41405 2.2518 8.74984 2.66602 8.74984L2.66602 7.24984ZM7.24935 2.6665V13.3332H8.74935V2.6665H7.24935ZM13.3327 7.24984L2.66602 7.24984L2.66602 8.74984L13.3327 8.74984V7.24984Z" fill="currentColor"></path>
                          </svg><span class="font-medium">Import Data</span></a>

                      )}


                    </div>
                  </div>
                </section>)

            )

          }



        </div>


        <div class="w-full md:w-1/2 px-4 mb-4 md:mb-0">
          <section class="py-4 overflow-hidden">
            <div class="container px-4 mx-auto">
              {/* {JSON.stringify(nodes)} */}
              {nodes.map((row) => (

                <div class="mb-2.5 bg-neutral-50 border border-neutral-100 rounded-xl">
                  <div class="p-4">
                    <div class="w-full overflow-x-auto">
                      <table class="w-full min-w-max">
                        <tbody>
                          <tr>
                            <td class="pr-4 pb-6">
                              <div class="flex flex-wrap items-center -m-2">
                                <div class="w-auto p-2"><img class="h-9" src="dashy-assets/images/avatar29.png" alt="" /></div>
                                <div class="w-auto p-2"><span class="block text-sm font-semibold">{row.name}</span><span class="block text-xs text-neutral-500">{row.description}</span></div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td class="pr-4">
                              <div class="flex flex-wrap items-center"><a class="px-4 py-3 font-medium text-xs border hover:border-neutral-200 rounded-lg" href="#">Edit Profile</a><a class="px-4 py-3 font-medium text-xs text-neutral-400 rounded-lg" href="#">Delete</a></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </section>
        </div>

      </div>


    </Layout>
  )
}