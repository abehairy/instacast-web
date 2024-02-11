import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/shared/Layout";
import PageHeader from "../components/shared/PageHeader";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from '../callApi';
import { InfinitySpin } from 'react-loader-spinner';
import StudioComponent from "../components/StudioComponent";
import GraphComponent from "../components/GraphComponent";
import ModalComponent from "../components/ModalComponent";

export default function Landing() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apps = [
    {
      'name': 'Linkedin Connections CSV',
      'id': 'linkedinconnections',
      'auth': 'linkedinconnections',
      'icon': 'docs.png',
      'description': 'Get trends about  lifegraph to your note',
      'loader_class_name': 'Csv',
      'loader_module_name': 'csv',
      'loader_action': 'load',
      'type': 'file'

    },

    {
      'name': 'Facebook Timeline',
      'id': 'facebook',
      'auth': 'facebook',
      'icon': 'facebook.svg',
      'description': 'Get trends about  lifegraph to your timeline',
      'fetcher_class_name': 'Facebook',
      'fetcher_module_name': 'facebook',
      'loader_class_name': 'Content',
      'loader_module_name': 'content',
      'loader_action': 'load',

    },
    {
      'name': 'Google Contacts',
      'id': 'google-contacts',
      'auth': 'google-oauth2',
      'icon': 'google-contacts.svg',
      'description': 'Connect Google Contacts to your lifemap',
      'fetcher_class_name': 'Google',
      'fetcher_module_name': 'google',
      'action': 'get_contacts'
    },
    {
      'name': 'Google Calendar',
      'id': 'google-calendar',
      'auth': 'google-oauth2',
      'icon': 'google-calendar.svg',
      'description': 'Connect Google Calendar to your lifemap',
      'fetcher_class_name': 'Google',
      'fetcher_module_name': 'google',
      'action': 'get_calendar_events',
      'loader_class_name': 'Calendar',
      'loader_module_name': 'calendar',
      'loader_action': 'load'
    },
    {
      'name': 'Linkedin Posts',
      'id': 'CustomLinkedIn',
      'auth': 'CustomLinkedIn',
      'icon': 'linkedin.svg',
      'description': 'Connect Linkedin Calendar to your lifemap',
      'fetcher_class_name': 'LinkedIn',
      'fetcher_module_name': 'linkedin',
      'action': 'fetch_posts'
    }]


  const { callApi } = useApi();
  const hasRun = useRef(false);

  const [lifeboard, setLifeBoard] = useState({})

  const fetchData = async () => {
    return await callApi(`/x`);

  };


  useEffect(() => {
    if (!hasRun.current) {

      setIsDataLoading(true)
      const a = fetchData().then(e => {
        setLifeBoard(e?.data)
        setIsDataLoading(false)


      }).catch(e => {
        setIsDataLoading(false)

      })
      hasRun.current = true;

    }
  }, []);

  return (
    <div>
      <section class="py-4 bg-gray bg-gradient-purple-left text-white">
        <div class="container px-4 mx-auto">
        </div>
      </section>
      <header className="bg-white py-6 md:py-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:px-6">
          {/* Left column for logo and headline */}
          <div className="flex items-center">
            <img src='/dashy-assets/logos/dashy-circle2-logo.png' alt='Jurni Logo' className="h-10 md:h-12 mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 font-jurni">Jurni</h1>
              <p className="text-gray-500 text-base">Connect with Jurni and explore your life's data.</p>
            </div>
          </div>
          {/* Right column for CTA */}
          <div>
            <a target="_blank" href="https://twitter.com/messages/compose?recipient_id=3435143933" class="twitter-dm-button"
              data-screen-name="@_ahmedbehairy" className="inline-block bg-black text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition ease-in-out duration-150">
              <img width='30px' src='/dashy-assets/images/x.png' alt='x' className="inline-block" />
              Get Early Access
            </a>
          </div>
        </div>
      </header>
      {/* < section className="">
        <div className="  mx-auto">
          <div className="bg-white border">
            <div className="px-6 pt-6 pb-7">
              <div className="flex flex-wrap items-center mb-3.5 -m-2">
                <div className="w-auto p-2">
                </div>
                <div className="w-auto p-2">

                </div>
              </div>
              <p className="text-center">
                <a className='inline-block text-xl' href='#'>
                  <img width="32px" src='/dashy-assets/logos/dashy-circle2-logo.png' alt='' />
                  <b className="font-jurni">Jurni</b>

                </a>
              </p>

            </div>
          </div>
        </div>
      </section> */}
      <div class="flex flex-wrap -mx-4 -mb-4 md:mb-0">
        <div class="w-full md:w-1/2 px-4 mb-4 md:mb-0 border border-gray-300  shadow-sm p-4">
          {/* <PageHeader title={'Ask Jurni about your life'} icon={'ask.svg'} /> */}

          <section class="py-4 overflow-hidden">
            <div class="container px-4 mx-auto">
              <div class="relative">
                <ul class="relative z-10 inline-flex flex-wrap items-center -m-5">
                  <li class="p-5"><a class="group relative flex-col items-center text-sm text-transparent font-medium bg-clip-text bg-gradient-purple-left" href="#"><span class="inline-block pb-5">Ask Jurni</span>
                    <div class="h-0.5 bg-gradient-purple-left"></div></a></li>
                  <li class="p-5"><a class="group relative flex-col items-center text-sm text-neutral-600 hover:text-transparent font-medium bg-clip-text hover:bg-gradient-purple-left" href="#"><span class="inline-block pb-5">LifeBoard</span>
                    <div class="h-0.5 bg-transparent group-hover:bg-gradient-purple-left"></div></a></li>
                </ul>
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-100"></div>
              </div>
            </div>
          </section>
          <StudioComponent showPrompts={true} demo='/demo' />
        </div>
        <div class="w-full md:w-1/2 px-4 mb-4 md:mb-0 border border-gray-300 shadow-sm p-4">
          <PageHeader title={'Life Graph'} description={'This is where the magic happens, you can visualize how your data is connected'} icon={'lifegraph.svg'} >

            <div class="flex mt-2">
              <img className="mr-2 " width={'20'} src='/dashy-assets/images/linkedin.svg' alt='linkendin' />
              <img className="mr-2 grayscale" width={'20'} src='/dashy-assets/images/google-calendar.svg' alt='calendar' />
              <a href="#" onClick={() => setIsModalOpen(true)}>
                <img width={'20'} src='/dashy-assets/images/add.svg' alt='add' />
              </a>

            </div>
          </PageHeader>


          <GraphComponent demo='/demo' />

        </div>
      </div>
      {isDataLoading && (<InfinitySpin
        width='200'
        color="#7b60e8"
      />)




      }
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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


                          <a href={`/connect/authorize?auth=${app.auth}&app=${app.id}&action=${app.action}`} class="inline-flex flex-wrap items-center justify-center px-1.5 py-1.5 w-full font-medium text-sm text-center text-neutral-50 hover:text-neutral-100 bg-neutral-600 hover:bg-opacity-95 rounded-lg focus:ring-4 focus:ring-neutral-400" >
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.35937 4C9.35937 3.58579 9.02359 3.25 8.60937 3.25C8.19516 3.25 7.85937 3.58579 7.85937 4H9.35937ZM7.85937 12C7.85937 12.4142 8.19516 12.75 8.60937 12.75C9.02359 12.75 9.35937 12.4142 9.35937 12H7.85937ZM12.6094 8.75C13.0236 8.75 13.3594 8.41421 13.3594 8C13.3594 7.58579 13.0236 7.25 12.6094 7.25V8.75ZM4.60938 7.25C4.19516 7.25 3.85938 7.58579 3.85938 8C3.85937 8.41421 4.19516 8.75 4.60937 8.75L4.60938 7.25ZM7.85937 4V8H9.35937V4H7.85937ZM7.85937 8V12H9.35937V8H7.85937ZM12.6094 7.25H8.60937V8.75H12.6094V7.25ZM8.60937 7.25L4.60938 7.25L4.60937 8.75H8.60937L8.60937 7.25Z" fill="#F9FAFB"></path>
                            </svg>


                          </a>



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

      </ModalComponent>



    </div>
  )
}