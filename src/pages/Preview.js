import React, { useEffect, useState, useRef } from "react";
import { useApi } from '../callApi';
import { Radio } from 'react-loader-spinner';
import VoicePlayer from "../components/VoicePlayer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { redirect, useParams } from "react-router-dom"; // Import useParams
import { Helmet } from "react-helmet-async";

import { faSave, faShareAlt } from '@fortawesome/free-solid-svg-icons';


export default function Preview() {
  const { podcastID, sessionID } = useParams(); // Retrieve the `app` parameter from the URL

  const apiUrl = process.env.REACT_APP_API_URL;
  // State to track window width
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Effect hook to listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);





  const [isDataLoading, setIsDataLoading] = useState(false);
  const { callApi } = useApi(true);

  const [podcast, setPodcast] = useState();



  const sharePodcast = async () => {
    let url = apiUrl.replace('api', '') + 'preview/innerview/' + sessionID
    alert(url)
    let title = 'Check my podcast with an AI Host on instacast.live !'
    if (navigator.share) {
      // Web Share API is available
      try {
        await navigator.share({
          title: title,
          // text: title,
          url: url
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content', error);
      }
    } else {
      // Fallback, open a new window with a social media share URL
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
  };

  const getPodcast = (podcast_id) => {

    setIsDataLoading(true)

    const response = callApi("/podcast/details?podcast_id=" + podcast_id);
    response.then(e => {
      setPodcast(e)
      setIsDataLoading(false)

    })

  }

  useEffect(() => {

    getPodcast(podcastID)

  }, []);






  return (
    <div>
      <Helmet>
        <title>{`${podcast?.name}`}</title>
        <link rel="apple-touch-icon" href={`https://instacast.live${podcast?.icon?.replace('.png', '-small.png')}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://instacast.live/preview/${podcastID}/${sessionID}`} />
        <meta property="og:title" content={`${podcast?.name}`} />
        <meta property="og:description" content={`${podcast?.description}`} />
        <meta property="og:image" content={`https://instacast.live${podcast?.icon?.replace('.png', '-small.png')}`} />
        <meta property="og:image:width" content="614" />
        <meta property="og:image:height" content="430" />
        <meta property="twitter:card" content={`https://instacast.live${podcast?.icon?.replace('.png', '-small.png')}`} />
        <meta property="twitter:url" content={`https://instacast.live/preview/${podcastID}/${sessionID}`} />
        <meta property="twitter:title" content={`${podcast?.name}`} />
        <meta property="twitter:description" content={`${podcast?.description}`} />
        <meta property="twitter:image" content={`https://instacast.live/${podcast?.icon}`} />
      </Helmet>

      <div className="relative min-h-screen">
        <div style={{
          backgroundImage: "url('/dashy-assets/images/bg.gif')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }} className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Semi-transparent header */}
        <header className="relative py-6 md:py-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
          <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <img width={'60px'} src='/dashy-assets/logos/mic.png' alt='InstaCast Logo' className="h-10 md:h-12 mr-3" />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">InstaCast</h1>
                <p className="text-gray-500">AI Host to Share Your Story With The World</p>
              </div>
            </div>

          </div>
        </header>





        {
          sessionID && podcast && (
            <div className="relative pt-16 md:pt-24">
              <div className="container mx-auto text-center p-8">
                <div className="grid md:grid-cols-1 gap-4">

                  <div className="flex flex-col items-center w-full">
                    {/* Podcast card container */}
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

                      {/* Podcast image/artwork */}
                      <img src={podcast?.icon} alt="Podcast Artwork" className="w-full h-64 object-cover rounded-lg" />

                      {/* Podcast details */}
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold">{podcast?.name}</h3>
                        <p className="text-sm text-gray-600">Hosted by {podcast?.hostName}</p>
                      </div>

                      <VoicePlayer audioUrl={apiUrl + '/podcast/file?session_id=' + sessionID + '&uuid=final_compilation'} />


                      <span>

                        <div className="mt-4 flex space-x-2 justify-center">
                          <button onClick={sharePodcast} className={`py-2 px-4 text-sm text-white bg-black rounded-lg transition duration-300 font-medium ${isDataLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`} disabled={isDataLoading}>
                            <FontAwesomeIcon icon={faShareAlt} />

                            Share Podcast

                          </button>



                          <a href={`${apiUrl}/podcast/file?session_id=${sessionID}&uuid=final_compilation`} download="podcast.mp3" className="py-2 px-4 text-sm text-white bg-blue-500 rounded-lg transition duration-300 font-medium hover:bg-blue-600">
                            Download MP3
                          </a>
                        </div>
                      </span>

                    </div>
                  </div>

                </div>


              </div>

            </div>
          )
        }



      </div >
    </div>

  );

}