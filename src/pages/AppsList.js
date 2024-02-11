import { useEffect, useState } from "react";
import Layout from "../components/shared/Layout";
import PageHeader from "../components/shared/PageHeader";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from '../callApi';
import Dropzone from 'react-dropzone'
import { useLoading } from "../components/useLoading";
import { redirect, useParams } from "react-router-dom"; // Import useParams

export default function AppList() {
  const [apps, setApps] = useState([]);
  const { load: loadImportData, isLoading: isLoadingImportData, LoaderComponent: ImportDataLoader } = useLoading();

  const { callApi, uploadFile } = useApi();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleDrop = async (acceptedFiles, app) => {

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]); // For now, let's assume we're only uploading a single file

    try {
      const response = loadImportData(uploadFile("/apps/upload",
        formData,
        { app: app.id, action: app.action }
      ));

      response.then(e => {
        redirect('/lifegraph/viewer')
      })

      // Handle successful upload
      // setLoading(false)

      //console.log(response.data);

    } catch (error) {
      // Handle errors
      console.error("Error uploading the file:", error);
    }
  }



  const fetchApps = async (query) => {
    try {
      const data = await callApi(`/apps`);
      setApps(data)
      return data
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    // Call the function
    fetchApps();
  }, []);


  return (
    <Layout>
      <PageHeader title={'Connect Data'} icon={'data-center.svg'} description={'Connect your social accounts and apps to your life map'} />

      <section class="py-4 overflow-hidden">
        <div class="container px-4 mx-auto">
          <div class="p-6 bg-white border rounded-xl">
            <div class="flex flex-wrap justify-between mb-5 -m-2">
              <div class="w-auto p-2">
                <h3 class="font-heading text-lg font-semibold">Integrate 100+ Apps</h3>
              </div>
              <div class="w-auto p-2"><a class="text-xs text-transparent font-semibold uppercase bg-clip-text bg-gradient-purple-left" href="#">View all</a></div>
            </div>
            <div class="flex flex-wrap -m-2">

              {apps.map((app) => (
                <div className="w-full sm:w-1/2 md:w-1/3 p-2" key={app.name}>
                  <div className="p-4 h-full bg-white border hover:border-neutral-200 rounded-lg cursor-pointer">
                    <div className="flex flex-wrap items-center justify-between -m-2">
                      <div className="w-auto p-2">
                        <div className="flex flex-wrap items-center -m-1.5">
                          <div className="w-auto p-1.5">
                            <img src={`dashy-assets/images/${app.icon}`} alt={app.name} />
                          </div>
                          <div className="flex-1 p-1.5">
                            <h3 className="font-heading mb-0.5 font-semibold">{app.name}</h3>
                            {/* You can add a description field to your apps if needed */}
                            <p className="text-xs text-neutral-500">{app.description || 'description'}</p>
                          </div>
                        </div>
                      </div>
                      <div class="w-auto p-2">

                        {app.type == 'file' ? (
                          <div id={app.id}>
                            <Dropzone key={app.id} onDrop={(files) => handleDrop(files, app)}>
                              {({ getRootProps, getInputProps, open }) => (
                                <div {...getRootProps()}>
                                  <input id={app.id} {...getInputProps()} />

                                  {isLoadingImportData ? (
                                    ImportDataLoader
                                  ) : (
                                    <button onClick={open} class="inline-flex flex-wrap items-center justify-center px-1.5 py-1.5 w-full font-medium text-sm text-center text-neutral-50 hover:text-neutral-100 bg-neutral-600 hover:bg-opacity-95 rounded-lg focus:ring-4 focus:ring-neutral-400" >
                                      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.35937 4C9.35937 3.58579 9.02359 3.25 8.60937 3.25C8.19516 3.25 7.85937 3.58579 7.85937 4H9.35937ZM7.85937 12C7.85937 12.4142 8.19516 12.75 8.60937 12.75C9.02359 12.75 9.35937 12.4142 9.35937 12H7.85937ZM12.6094 8.75C13.0236 8.75 13.3594 8.41421 13.3594 8C13.3594 7.58579 13.0236 7.25 12.6094 7.25V8.75ZM4.60938 7.25C4.19516 7.25 3.85938 7.58579 3.85938 8C3.85937 8.41421 4.19516 8.75 4.60937 8.75L4.60938 7.25ZM7.85937 4V8H9.35937V4H7.85937ZM7.85937 8V12H9.35937V8H7.85937ZM12.6094 7.25H8.60937V8.75H12.6094V7.25ZM8.60937 7.25L4.60938 7.25L4.60937 8.75H8.60937L8.60937 7.25Z" fill="#F9FAFB"></path>
                                      </svg>


                                    </button>)}
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        ) : (
                          <a href={`${apiBaseUrl}/connect/authorize?auth=${app.auth}&app=${app.id}&action=${app.action}`} class="inline-flex flex-wrap items-center justify-center px-1.5 py-1.5 w-full font-medium text-sm text-center text-neutral-50 hover:text-neutral-100 bg-neutral-600 hover:bg-opacity-95 rounded-lg focus:ring-4 focus:ring-neutral-400" >
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.35937 4C9.35937 3.58579 9.02359 3.25 8.60937 3.25C8.19516 3.25 7.85937 3.58579 7.85937 4H9.35937ZM7.85937 12C7.85937 12.4142 8.19516 12.75 8.60937 12.75C9.02359 12.75 9.35937 12.4142 9.35937 12H7.85937ZM12.6094 8.75C13.0236 8.75 13.3594 8.41421 13.3594 8C13.3594 7.58579 13.0236 7.25 12.6094 7.25V8.75ZM4.60938 7.25C4.19516 7.25 3.85938 7.58579 3.85938 8C3.85937 8.41421 4.19516 8.75 4.60937 8.75L4.60938 7.25ZM7.85937 4V8H9.35937V4H7.85937ZM7.85937 8V12H9.35937V8H7.85937ZM12.6094 7.25H8.60937V8.75H12.6094V7.25ZM8.60937 7.25L4.60938 7.25L4.60937 8.75H8.60937L8.60937 7.25Z" fill="#F9FAFB"></path>
                            </svg>


                          </a>
                        )}


                        {/* <a href={`${apiBaseUrl}/connect/authorize?auth=${app.auth}&app=${app.id}&action=${app.action}`} class="inline-flex flex-wrap items-center justify-center px-1.5 py-1.5 w-full font-medium text-sm text-center text-neutral-50 hover:text-neutral-100 bg-neutral-600 hover:bg-opacity-95 rounded-lg focus:ring-4 focus:ring-neutral-400" >
                          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.35937 4C9.35937 3.58579 9.02359 3.25 8.60937 3.25C8.19516 3.25 7.85937 3.58579 7.85937 4H9.35937ZM7.85937 12C7.85937 12.4142 8.19516 12.75 8.60937 12.75C9.02359 12.75 9.35937 12.4142 9.35937 12H7.85937ZM12.6094 8.75C13.0236 8.75 13.3594 8.41421 13.3594 8C13.3594 7.58579 13.0236 7.25 12.6094 7.25V8.75ZM4.60938 7.25C4.19516 7.25 3.85938 7.58579 3.85938 8C3.85937 8.41421 4.19516 8.75 4.60937 8.75L4.60938 7.25ZM7.85937 4V8H9.35937V4H7.85937ZM7.85937 8V12H9.35937V8H7.85937ZM12.6094 7.25H8.60937V8.75H12.6094V7.25ZM8.60937 7.25L4.60938 7.25L4.60937 8.75H8.60937L8.60937 7.25Z" fill="#F9FAFB"></path>
                          </svg>


                        </a> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

    </Layout>
  )
}