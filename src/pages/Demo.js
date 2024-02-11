import React, { useEffect, useState, useRef } from "react";
import { useApi } from '../callApi';
import { Radio } from 'react-loader-spinner';
import StudioComponent from "../components/StudioComponent";
import VoicePlayer from "../components/VoicePlayer";


export default function Demo() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { callApi, uploadFile } = useApi('demo');
  const [animationStep, setAnimationStep] = useState(0);
  const [podcastSaved, setpodcastSaved] = useState(false);

  const [podcastID, setPodcastID] = useState();
  const [podcastIntro, setPodcastIntro] = useState();

  const startPodcast = () => {

    setAnimationStep(1); // Start the animation
    setTimeout(() => setAnimationStep(2), 2000); // Change text after 2 seconds

    setIsDataLoading(true)

    const response = callApi("/podcast/start");
    response.then(e => {
      setTimeout(() => setAnimationStep(3), 4000); // Change text after another 2 seconds
      setTimeout(() => setAnimationStep(0), 6000); // Reset or start the podcast after another 2 seconds

      setPodcastID(e.podcast_id)
      setPodcastIntro(e)
      setIsDataLoading(false)

    })

  }

  const savePodcast = () => {

    // setAnimationStep(1); // Start the animation
    // setTimeout(() => setAnimationStep(2), 2000); // Change text after 2 seconds

    setIsDataLoading(true)

    const response = callApi("/podcast/save?podcast_id=" + podcastID);
    response.then(e => {
      // setTimeout(() => setAnimationStep(3), 4000); // Change text after another 2 seconds
      // setTimeout(() => setAnimationStep(0), 6000); // Reset or start the podcast after another 2 seconds
      setpodcastSaved(true)
      setIsDataLoading(false)

    })

  }

  const handleRecordingComplete = (file) => {
    console.log(file)

    setIsDataLoading(true)
    const formData = new FormData();
    formData.append('file', file); // For now, let's assume we're only uploading a single file

    const response = uploadFile("/podcast/speak",
      formData,
      { app: '' }
    );

    response.then(e => {
      // setFhirResponse(e)
      setIsDataLoading(false)

    })




  }


  const prompts = [
    {
      'name': 'The InnerView Podcast',
      'id': 'storytelling',
      'hostName': 'Alloy',
      'description': 'Share your personal or fictional stories and captivate listeners with your narrative skills.',
      'icon': '/dashy-assets/images/innerview-thumbnail.png',
      'hostImage': '/dashy-assets/images/host1.png',
    },
    {
      'name': 'Adventure Time',
      'id': 'life-lessons',
      'hostName': 'Alloy',

      'description': 'Bedtime stories and beyond.',
      'icon': '/dashy-assets/images/adventure-host.png',
      'hostImage': '/dashy-assets/images/host1.png',
    },
    {
      'name': 'Tech Talk',
      'id': 'tech-talk',
      'hostName': 'Alloy',

      'description': 'Dive into the latest in technology, from gadgets to software, and what the future may hold.',

      'icon': '/dashy-assets/images/tech-thumbnail.png',
      'hostImage': '/dashy-assets/images/tech-host.png',
    },
    {
      'name': 'Health & Wellness',
      'id': 'health-wellness',
      'description': 'Explore topics on health, wellness, fitness, and mental well-being with experts and enthusiasts.',

      'icon': '/dashy-assets/images/wellness-thumbnail.png',
      'hostImage': '/dashy-assets/images/wellness-host.png',
      'hostName': 'Ted'
    }
  ];




  const handleChatResponse = (data) => {
    // Check if data is not empty and is a string
    if (typeof data === 'string' && data.trim() !== '') {
      // Regular expression to find the Mermaid syntax
      const mermaidRegex = /```mermaid([^`]+)```/;

      // Extract the Mermaid syntax using the regular expression
      const mermaidMatch = data.match(mermaidRegex);

      if (mermaidMatch && mermaidMatch[1]) {
        // Extracted Mermaid syntax
        const mermaidSyntax = mermaidMatch[1].trim();

        // Set the chart here using your state management or any other method
        setChart(mermaidSyntax); // Replace 'setChart' with your method or state setter
        setIsResponseReceived(true)
        //generateImage(data)
        return data.replace(mermaidRegex, '').trim();
      } else {
        console.log("No valid Mermaid syntax found in the response.");
      }
    } else {
      console.log("Invalid data received in handleChatResponse");
    }
  }



  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay */}
      <div style={{
        backgroundImage: "url('/dashy-assets/images/bg.gif')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
      }} className="absolute inset-0 w-full h-full">
        {/* Dark overlay */}
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
          <div>
            <a href="https://twitter.com/messages/compose?recipient_id=3435143933" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-black text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition ease-in-out duration-150">
              Get Early Access
            </a>
          </div>
        </div>
      </header>



      {!podcastID && !animationStep && (
        <div className="relative pt-16 md:pt-24">
          <div className="container mx-auto text-center p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {prompts.map((prompt, index) => (
                <div class="bg-white p-4 rounded-lg border hover:opacity-80 border-black hover:border-4 hover:border-black-400">
                  <a onClick={() => startPodcast(prompt.name)} href="#" className="flex flex-col items-center space-y-4">
                    <img src={prompt.icon} alt={prompt.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="flex items-center w-full">
                      <div style={{ flex: 1 }}>
                        <h3 className="text-lg font-semibold">{prompt.name}</h3>
                        <p className="text-xs text-gray-500" style={{}}>Hosted By AI <b>{prompt.hostName}</b></p>
                      </div>
                      <img src={prompt.hostImage} alt="AI Host: Alloy" className="w-10 h-10 rounded-full mr-4" />
                    </div>
                    <p className="text-sm text-gray-600">{prompt.description}</p>
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


      {
        podcastID && !animationStep && (
          <div className="relative pt-16 md:pt-24">
            <div className="container mx-auto text-center p-8">
              <div className="grid md:grid-cols-2 gap-4">

                <StudioComponent podcastIntro={podcastIntro} podcastID={podcastID} />
                <div className="flex flex-col w-full relative">
                  <div className="chat-content flex flex-col mx-auto w-full min-h-[75vh] 2xl:min-h-[85vh] max-w-6xl">
                    <div class="container mx-auto text-center p-8 bg-white p-4 rounded-lg border hover:border-gray-400 ">


                      {podcastSaved && <VoicePlayer audioUrl={'http://0.0.0.0:8000/podcast/file?podcast_id=' + podcastID + '&uuid=final_compilation'} />}
                      <a href={'http://0.0.0.0:8000/podcast/file?podcast_id=' + podcastID + '&uuid=final_compilation'} download={''} className="download-button">
                        <button type="button">
                          Download MP3
                        </button>
                      </a>
                      <button disabled={isDataLoading} onClick={savePodcast} className="mt-8 py-3 px-4 text-sm text-white bg-black rounded-lg transition duration-300 w-40 h-13 font-medium">
                        <h2 className="text-lg">{!isDataLoading ? 'Save Podcast' : ''}</h2>
                        <Radio
                          visible={isDataLoading}
                          colors={['#ffff', '#ffff', '#ffff']}
                          width="50"
                          height="50"
                          wrapperStyle={{ 'display': 'inline-block' }}
                        />
                      </button>
                    </div>
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