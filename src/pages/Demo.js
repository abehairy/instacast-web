import React, { useEffect, useState, useRef } from "react";
import { useApi } from '../callApi';
import { Radio } from 'react-loader-spinner';
import StudioComponent from "../components/StudioComponent";
import VoicePlayer from "../components/VoicePlayer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSave, faShareAlt } from '@fortawesome/free-solid-svg-icons';


export default function Demo() {
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
  const [animationStep, setAnimationStep] = useState(0);
  const [podcastSaved, setpodcastSaved] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const [sessionID, setSessionID] = useState();
  const [podcast, setPodcast] = useState();
  const [podcasts, setPodcasts] = useState([])

  const startPodcast = (podcast) => {
    if (!podcast.id)
      return

    setAnimationStep(1); // Start the animation
    setTimeout(() => setAnimationStep(2), 2000); // Change text after 2 seconds
    setTimeout(() => setAnimationStep(3), 4000); // Change text after another 2 seconds

    setIsDataLoading(true)

    const response = callApi("/podcast/start?podcast_id=" + podcast.id);
    response.then(e => {
      setTimeout(() => setAnimationStep(0), 6000); // Reset or start the podcast after another 2 seconds

      setSessionID(e.session_id)
      podcast.introText = e.text
      setPodcast(podcast)
      setIsDataLoading(false)

    })

  }

  const savePodcast = () => {

    setIsDataLoading(true)

    const response = callApi("/podcast/save?session_id=" + sessionID);
    response.then(e => {
      setpodcastSaved(true)
      setIsDataLoading(false)

    })

  }

  const getPodcasts = () => {

    setIsDataLoading(true)

    const response = callApi("/podcast/list");
    response.then(e => {
      setPodcasts(e)
      setIsDataLoading(false)

    })

  }

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

  const didInteract = (interacted) => {
    setUserInteracted(interacted)
  }

  useEffect(() => {

    getPodcasts()

  }, []);





  return (
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
          {/* <div>
            <a href="https://twitter.com/messages/compose?recipient_id=3435143933" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-black text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition ease-in-out duration-150">
              Get Early Access
            </a>
          </div> */}
        </div>
      </header>




      {!sessionID && !animationStep && (
        <div className="relative pt-16 md:pt-24">
          <div className="container mx-auto text-center p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {podcasts.map((podcast, index) => (
                <div class="bg-white p-4 rounded-lg border hover:opacity-80 border-black hover:border-4 hover:border-black-400">
                  <a onClick={() => startPodcast(podcast)} href="#" className="flex flex-col items-center space-y-4">
                    <img src={podcast.icon} alt={podcast.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="flex items-center w-full">
                      <div style={{ flex: 1 }}>
                        <h3 className="text-lg font-semibold">{podcast.name}</h3>
                        <p className="text-xs text-gray-500" style={{}}>Hosted By AI <b>{podcast.hostName}</b></p>
                      </div>
                      <img src={podcast.hostImage} alt="AI Host: Alloy" className="w-10 h-10 rounded-full mr-4" />
                    </div>
                    <p className="text-sm text-gray-600">{podcast.description}</p>
                    <button disabled={isDataLoading} onClick={startPodcast} className="mt-8 py-3 px-4 text-sm text-white bg-black rounded-lg transition duration-300 w-40 h-13 font-medium">
                      <h2 className="text-lg">{!isDataLoading ? 'Start Podcast' : ''}</h2>
                      <Radio
                        visible={isDataLoading}
                        colors={['#ffff', '#ffff', '#ffff']}
                        width="50"
                        height="50"
                        wrapperStyle={{ 'display': 'inline-block' }}
                      />
                    </button>
                  </a>
                </div>

              ))}
            </div>









          </div>


        </div>
      )}



      {animationStep > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <p className="text-white text-2xl">
            {animationStep === 1 && "Preparing studio..."}
            {animationStep === 2 && "Your host is getting setup..."}
            {animationStep === 3 && "Get your mic ready..."}
          </p>
        </div>
      )}


      {/*Mobile View */}

      {
        isMobile && sessionID && !animationStep && (
          <div className="relative pt-0 md:pt-0">
            <div className="container mx-auto text-center p-8">
              <div className="grid md:grid-cols-1 gap-4">

                <div className="flex flex-col items-center w-full">
                  <div className="bg-white p-6 rounded-lg shadow-md w-full">

                    <img src={podcast.icon} alt="Podcast Artwork" className="w-full h-32 object-cover rounded-lg" />

                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">{podcast.name}</h3>
                      <p className="text-sm text-gray-600">Hosted by {podcast.hostName}</p>
                    </div>

                    {userInteracted && (
                      <span>
                        {podcastSaved && <VoicePlayer audioUrl={apiUrl + '/podcast/file?session_id=' + sessionID + '&uuid=final_compilation'} />}

                        <div className="mt-4 flex space-x-2 justify-center">
                          {podcastSaved && <button onClick={sharePodcast} className={`py-2 px-4 text-sm text-white bg-black rounded-lg transition duration-300 font-medium ${isDataLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`} disabled={isDataLoading}>
                            <FontAwesomeIcon icon={faShareAlt} />

                            Share Podcast

                          </button>}
                          <button onClick={savePodcast} className={`py-2 px-4 text-sm text-white bg-black rounded-lg transition duration-300 font-medium ${isDataLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`} disabled={isDataLoading}>
                            {isDataLoading ? (
                              <Radio visible={true} colors={['#ffff', '#ffff', '#ffff']} width="50" height="50" wrapperStyle={{ display: 'inline-block' }} />
                            ) : (

                              'Save Podcast'
                            )}
                          </button>

                          {podcastSaved &&
                            <a href={`${apiUrl}/podcast/file?session_id=${sessionID}&uuid=final_compilation`} download="podcast.mp3" className="py-2 px-4 text-sm text-white bg-blue-500 rounded-lg transition duration-300 font-medium hover:bg-blue-600">
                              Download MP3
                            </a>}
                        </div>
                      </span>
                    )}





                  </div>
                </div>
                <div className="max-w-md mx-auto text-center ">
                  <StudioComponent podcast={podcast} sessionID={sessionID} didInteract={didInteract} />

                </div>



              </div>


            </div>

          </div>
        )
      }

      {/*Desktop View */}

      {
        !isMobile && sessionID && !animationStep && (
          <div className="relative pt-16 md:pt-24">
            <div className="container mx-auto text-center p-8">
              <div className="grid md:grid-cols-2 gap-4">

                <StudioComponent podcast={podcast} sessionID={sessionID} didInteract={didInteract} />
                <div className="flex flex-col items-center w-full">
                  {/* Podcast card container */}
                  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

                    {/* Podcast image/artwork */}
                    <img src={podcast.icon} alt="Podcast Artwork" className="w-full h-64 object-cover rounded-lg" />

                    {/* Podcast details */}
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">{podcast.name}</h3>
                      <p className="text-sm text-gray-600">Hosted by {podcast.hostName}</p>
                    </div>

                    {podcastSaved && <VoicePlayer audioUrl={apiUrl + '/podcast/file?session_id=' + sessionID + '&uuid=final_compilation'} />}

                    {userInteracted && (
                      <span>

                        <div className="mt-4 flex space-x-2 justify-center">
                          {podcastSaved && <button onClick={sharePodcast} className={`py-2 px-4 text-sm text-white bg-black rounded-lg transition duration-300 font-medium ${isDataLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`} disabled={isDataLoading}>
                            <FontAwesomeIcon icon={faShareAlt} />

                            Share Podcast

                          </button>}
                          <button onClick={savePodcast} className={`py-2 px-4 text-sm text-white bg-black rounded-lg transition duration-300 font-medium ${isDataLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`} disabled={isDataLoading}>
                            {isDataLoading ? (
                              <Radio visible={true} colors={['#ffff', '#ffff', '#ffff']} width="50" height="50" wrapperStyle={{ display: 'inline-block' }} />
                            ) : (

                              'Save Podcast'
                            )}
                          </button>

                          {podcastSaved &&
                            <a href={`${apiUrl}/podcast/file?session_id=${sessionID}&uuid=final_compilation`} download="podcast.mp3" className="py-2 px-4 text-sm text-white bg-blue-500 rounded-lg transition duration-300 font-medium hover:bg-blue-600">
                              Download MP3
                            </a>}
                        </div>
                      </span>
                    )}
                  </div>
                </div>

              </div>


            </div>

          </div>
        )
      }



    </div >
  );

}