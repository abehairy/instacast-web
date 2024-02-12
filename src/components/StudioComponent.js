import { useState, useEffect } from 'react';
import { MdAutoAwesome, MdPerson } from 'react-icons/md';
import { useApi } from '../callApi';
import { MdAttachFile } from 'react-icons/md';
import FileUploader from './FileUploader';
import VoicePlayer from "./VoicePlayer";
import VoiceRecoder from "./VoiceRecoder";
import { Puff } from 'react-loader-spinner'

export default function ChatComponent({ podcast, sessionID, ...props }) {
  const [messages, setMessages] = useState([{ type: 'ai', content: podcast.introText, voice_id: 'intro' }]);
  const apiUrl = process.env.REACT_APP_API_URL;


  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(false);



  const { callApi, uploadFile } = useApi(true);



  const handleRecordingComplete = (file) => {
    console.log(file)
    setMessages(prevMessages => [...prevMessages, { type: 'human', content: '', voice_file: file }]);

    setLoading(true)
    const formData = new FormData();
    formData.append('file', file); // For now, let's assume we're only uploading a single file


    const response = uploadFile("/podcast/speak",
      formData,
      {
        session_id: sessionID,
        podcast_id: podcast.id

      }
    );

    response.then(e => {
      setMessages(prevMessages => [...prevMessages, { type: 'ai', content: e.text, voice_id: e.voice_id }]);

      console.log(e)
      setLoading(false)

    }).catch(e => {
      alert(JSON.stringify(e))
    })


  }




  return (
    <div className="flex flex-col w-full relative">
      <div className="chat-content flex flex-col mx-auto w-full min-h-[75vh] 2xl:min-h-[85vh] max-w-6xl">
        {messages.length == 0 && (
          <div class="container mx-auto text-center p-8">

            {props.title && (
              <span>
                <h1 class="text-2xl font-bold text-neutral mb-8">{props.title || ''}</h1>
                <h3 class="text-xl text-neutral mt-0 mb-8">{props.subtitle || ''}</h3>
              </span>
            )
            }





          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex w-full items-center mb-4 ${message.type === 'ai' ? 'flex-row-reverse' : ''}`}>
            <div className={`message-bubble ${message.type === 'ai' ? '' : message.type} flex p-5 ${message.type === 'human' ? 'bg-gray-100' : 'bg-gray-200'} rounded-lg w-full items-center`}>
              <div className={`flex flex-col items-center mr-4 flex-shrink-0 items-center justify-center ${message.type === 'human' ? '' : ''} h-10 w-10 mr-4 flex-shrink-0`}>
                {message.type === 'human' ? (
                  <>
                    <MdPerson className="text-brand-500 w-10 h-10" />
                    <span className="text-xs text-center mt-1">You</span>
                  </>
                ) : (
                  <>
                    <img className='w-10 h-10 rounded-full' src={podcast.hostImage} alt='Host' />
                    <span className="text-xs text-center mt-1 font-bold">{podcast.hostName}</span>
                  </>
                )}
              </div>

              <div className="flex-grow flex items-center">
                {message.type === 'ai' && !message.content && <div className="loading-dot"></div>}
                <span className="text-navy-700 font-semibold text-sm md:text-md leading-6 md:leading-6" style={{ whiteSpace: 'pre-wrap' }}>{message.content}
                  {message.voice_id && <VoicePlayer audioUrl={apiUrl + '/podcast/file?session_id=' + sessionID + '&uuid=' + message.voice_id} />}
                  {message.voice_file && <VoicePlayer audioFile={message.voice_file} />}

                </span>

              </div>
            </div>
          </div>
        ))}

        <div className={`${props.textInputCss || ''} flex flex-col mt-5 ml-[15px] xl:ml-15 justify-self-end`}>
          <div className="flex justify-between items-center mb-2 w-full">

            {loading && (<Puff
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />)}
            {!loading && (<VoiceRecoder onRecordingComplete={handleRecordingComplete} />)}

          </div>

          <div className="flex text-white justify-center flex-col md:flex-row items-center mt-2">
            <span className="text-xs text-center text-white">
              AI Host may produce inaccurate information
              about people, places, or facts.
            </span>
            <span className="text-xs text-navy-700 font-medium underline">
              InstaCast Nov 12 Version
            </span>
          </div>
        </div>


      </div>
    </div>
  );
}