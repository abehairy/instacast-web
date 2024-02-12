import { useState, useEffect } from 'react';
import { MdAutoAwesome, MdPerson } from 'react-icons/md';
import { useApi } from '../callApi';
import { MdAttachFile } from 'react-icons/md';
import FileUploader from './FileUploader';
import VoicePlayer from "./VoicePlayer";
import VoiceRecoder from "./VoiceRecoder";

export default function ChatComponent({ podcastID, podcastIntro, ...props }) {
  const [messages, setMessages] = useState([{ type: 'ai', content: podcastIntro.text, voice_id: 'intro' }]);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(false);

  const [prompts, setPrompts] = useState(props.prompts || []);

  const { callApi, uploadFile } = useApi(props.demo);


  const onClickPrompt = (prompt) => {
    setInputCode(prompt)
  }



  const handleRecordingComplete = (file) => {
    console.log(file)
    setMessages(prevMessages => [...prevMessages, { type: 'human', content: inputCode || document.getElementById('chat-input').value, voice_file: file }]);
    //setMessages(prevMessages => [...prevMessages, { type: 'ai', content: '', voice_id: 'intro_background' }]);

    setLoading(true)
    const formData = new FormData();
    formData.append('file', file); // For now, let's assume we're only uploading a single file

    const response = uploadFile("/podcast/speak",
      formData,
      { podcast_id: podcastID }
    );

    response.then(e => {
      setMessages(prevMessages => [...prevMessages, { type: 'ai', content: e.text, voice_id: e.voice_id }]);

      console.log(e)
      setLoading(false)

    })




  }


  const handleFileUpload = (file) => {
    setFile(file)
  }

  const handleSendWithFile = async (file) => {
    setLoading(true);
    setMessages(prevMessages => [...prevMessages, { type: 'human', content: inputCode || document.getElementById('chat-input').value }]);
    setMessages(prevMessages => [...prevMessages, { type: 'ai', content: '' }]);

    const formData = new FormData();
    formData.append('file', file);

    await uploadFile(
      `${props.demo || ''}/ask`,
      formData,
      { message: inputCode || document.getElementById('chat-input').value }).then(async e => {
        let content = e.data
        if (props.onResponse) {
          content = props.onResponse(e.data)

        }

        setMessages(prevMessages => {
          // Copy all messages except the last
          const messagesCopy = [...prevMessages];
          // Update the content of the last message
          messagesCopy[messagesCopy.length - 1] = {
            ...messagesCopy[messagesCopy.length - 1],
            content: content
          };
          return messagesCopy;
        });

        setLoading(false)
        setInputCode('');


      }).catch(e => {
        setLoading(false)
        setInputCode('');


      })

  }
  const handleSend = async () => {
    // if (file)
    //   return handleSendWithFile(file)
    setLoading(true);
    setMessages(prevMessages => [...prevMessages, { type: 'human', content: inputCode || document.getElementById('chat-input').value }]);
    setMessages(prevMessages => [...prevMessages, { type: 'ai', content: '' }]);


    await callApi(
      `${props.demo || ''}/ask`,
      { 'method': 'POST' },
      { message: inputCode || document.getElementById('chat-input').value }).then(async e => {
        let content = e.data
        if (props.onResponse) {
          content = props.onResponse(e.data)
        }
        setMessages(prevMessages => {
          // Copy all messages except the last
          const messagesCopy = [...prevMessages];
          // Update the content of the last message
          messagesCopy[messagesCopy.length - 1] = {
            ...messagesCopy[messagesCopy.length - 1],
            content: content
          };
          return messagesCopy;
        });

        setLoading(false)
        setInputCode('');


      }).catch(e => {
        setInputCode('');

        alert('error')
        setLoading(false)

      })

  }


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (inputCode.length == 0) {
        setInputCode(document.getElementById('chat-input').value = $(node).text())

      }
      handleSend();
      // Perform any other actions you want on Enter key press here
    }
  }

  const handleChange = (Event) => {
    setInputCode(Event.target.value);
  };



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



            {props.showPrompts && (

              <div class="grid md:grid-cols-2 gap-4">
                {prompts.map((prompt, index) => (

                  <div key={index} class="bg-white p-4 rounded-lg border hover:border-gray-400 ">
                    <a onClick={() => onClickPrompt(prompt.name)} href='#' >
                      <h3 className="mt-4 font-heading text-lg font-semibold text-center">{prompt.name}</h3>

                      <p className="mt-2 text-sm text-gray-600 text-center">{prompt.description}</p>
                    </a>


                  </div>

                ))}
              </div>

            )}

          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex w-full items-center mb-4 ${message.type === 'ai' ? 'flex-row-reverse' : ''}`}>
            <div className={`message-bubble ${message.type === 'ai' ? '' : message.type} flex p-5 ${message.type === 'human' ? 'bg-gray-100' : 'bg-gray-200'} rounded-lg w-full items-center`}>
              <div className={`avatar flex items-center justify-center ${message.type === 'human' ? '' : ''} h-10 w-10 mr-4 flex-shrink-0`}>
                {message.type === 'human' ? <MdPerson className="text-brand-500 w-5 h-5" /> : <img className='avatar' width={'80'} src='dashy-assets/images/host1.png' alt='' />}
              </div>

              <div className="flex-grow flex items-center">
                {message.type === 'ai' && !message.content && <div className="loading-dot"></div>}
                <span className="text-navy-700 font-semibold text-sm md:text-md leading-6 md:leading-6" style={{ whiteSpace: 'pre-wrap' }}>{message.content}
                  {message.voice_id && <VoicePlayer audioUrl={apiUrl + '/podcast/file?podcast_id=' + podcastID + '&uuid=' + message.voice_id} />}
                  {message.voice_file && <VoicePlayer audioFile={message.voice_file} />}

                </span>

              </div>
            </div>
          </div>
        ))}

        <div className={`${props.textInputCss || ''} flex flex-col mt-5 ml-[15px] xl:ml-15 justify-self-end`}>
          <div className="flex justify-between items-center mb-2 w-full"> {/* Make this div full width */}
            {/* <div className="icon-button bg-gray-100 text-black border-solid border-black border border-1 rounded mr-2.5 p-2">
              <FileUploader onFileSelect={handleFileUpload} />


            </div> */}
            <input
              id="chat-input"
              autoComplete='off'
              className="input-box border border-gray-200 rounded-full p-3.5 mr-2.5 text-sm font-medium flex-grow text-navy-700 placeholder-gray-500 focus:border-none" // Add flex-grow
              type="text"
              placeholder={props.placeholder || "Type your message here..."}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              value={inputCode}
            />

            <VoiceRecoder onRecordingComplete={handleRecordingComplete} />


            {/* <button
              className="py-3 px-4 text-sm bg-black text-neutral-50 hover:bg-gradient-healthcare-dark rounded-lg transition duration-300 rounded-full w-40 h-13 font-medium"
              onClick={handleSend}
              disabled={loading}
            >

              {loading ? 'Loading...' : <span><img width='25px' src='/dashy-assets/images/send.svg' alt='Send' className="inline-block" /></span>}
            </button> */}
          </div>

          <div className="flex justify-center flex-col md:flex-row items-center mt-2">
            <span className="text-xs text-center text-gray-500">
              {podcastID}
              InstaCast may produce inaccurate information
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