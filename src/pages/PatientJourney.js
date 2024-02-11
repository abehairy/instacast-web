import React, { useEffect, useState, useRef } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useApi } from '../callApi';
import { InfinitySpin } from 'react-loader-spinner';
import StudioComponent from "../components/StudioComponent";
import MermaidChart from "../components/MermaidChart";
import Uploader from "../components/Uploader";
import Select from "react-select";

export default function Demo() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dalle3Image, setDalle3Image] = useState();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedProductType, setSelectedProductType] = useState({ value: 'pharmaceutical', label: 'Pharmaceutical' });
  const productTypeOptions = [
    { value: 'pharmaceutical', label: 'Pharmaceutical' },
    { value: 'biotechnology', label: 'Biotechnology' },
    { value: 'medicalDevice', label: 'Medical Device' },
    { value: 'herbal', label: 'Herbal' },
    { value: 'veterinary', label: 'Veterinary' }
    // ...add other product types as needed
  ];
  const regulatoryTools = [
    {
      'name': 'FDA Drug Registration',
      'id': 'fda-drug',
      'description': 'Navigate FDA drug registration pathways',
      'icon': 'fda.svg',
    },
    {
      'name': 'EMA Drug Approval',
      'id': 'ema-drug',
      'description': 'Explore EMA drug approval processes',
      'icon': 'ema.svg',
    },
    // Additional regulatory tools/resources...
  ];

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      });
  }, []);

  const [isResponseReceived, setIsResponseReceived] = useState(false); // New state variable
  const [chart, setChart] = useState(`
journey
    title Type 2 Diabetes Patient Journey in Egypt
    section Initial Symptoms
      Notice symptoms: 5: Patient
      Consult family and friends, possibly traditional remedies: 3: Patient, Family
      Visit a local pharmacy for advice: 4: Pharmacist
    section Seeking Medical Help
      Visit a general practitioner (GP) at a public clinic or private practice: 5: Patient
      Initial consultation and fasting blood sugar test: 5: GP
      Diagnosis with Type 2 Diabetes: 5: GP
    section Treatment Planning
      Discuss treatment options, often medication initially: 5: GP
      Possible referral to a specialist (Endocrinologist) in urban areas or for complicated cases: 3: GP
      Developing a basic treatment plan: 4: GP
    section Treatment Access and Initiation
      Prescription for medication (e.g., Metformin): 5: GP
      Purchase medication from pharmacy, considering out-of-pocket costs: 4: Patient, Pharmacy
      Basic lifestyle advice (diet, exercise): 3: GP, Nurse
    section Ongoing Management
      Follow-up visits with GP, possibly irregular due to access or cost: 3: Patient, GP
      Self-monitoring of blood glucose, if affordable: 3: Patient
      Dealing with complications or referral to specialists as needed: 3: GP, Specialist
    section Long-term Complications Management
      Screening for complications at public hospitals or private clinics: 3: Specialist
      Adjustments in treatment, exploring traditional and alternative remedies: 3: Patient, GP, Specialist
      Continued emphasis on lifestyle management with possible support from family: 4: Patient, Family

  `);

  const onNodeClick = (node) => {
    document.getElementById('chat-input').value = $(node).text()
  }

  const generateImage = async (prompt) => {
    await callApi(
      `/demo/dalle3`,
      { 'method': 'POST' },
      { message: prompt }).then(async e => {
        setDalle3Image(e)
      });
  }




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
    <div>
      <header className="bg-white py-6 md:py-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <img src='/dashy-assets/logos/InstaCast-icon.png' alt='InstaCast Logo' className="h-10 md:h-12 mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 font-jurni">InstaCast</h1>
              <p className="text-gray-500 text-base">Navigate drug regulatory pathways effortlessly</p>
            </div>
          </div>
          <div>
            <a href="https://twitter.com/messages/compose?recipient_id=3435143933" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-black text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition ease-in-out duration-150">
              Get Early Access
            </a>
          </div>
        </div>
      </header>
      <section className="container mx-auto px-4 md:px-6 py-6">
        <PageHeader title={'Explore Regulatory Pathways'} description={'A comprehensive tool for navigating through drug registration and approval processes across the globe.'} />
        <div className="flex flex-wrap -mx-4 mb-4 justify-center items-center"> {/* Flex container for both filters */}
          <div className="w-full md:w-1/2 px-4 mb-4"> {/* Half width for medium and up screens */}
            <div className="flex justify-between items-center p-4 bg-white border hover:border-gray-400 rounded-lg">
              {/* Country Selector */}
              <label htmlFor="country-selector" className="flex items-center mr-4">
                <img src={"/dashy-assets/logos/globe.png"} alt="Select a country" className="mr-2 h-6 w-6" />
                <span className="text-gray-600">Country:</span>
              </label>
              <Select
                id="country-selector"
                options={countries}
                value={selectedCountry}
                onChange={(selectedOption) => setSelectedCountry(selectedOption)}
                className="flex-grow"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4 mb-4"> {/* Half width for medium and up screens */}
            <div className="flex justify-between items-center p-4 bg-white border hover:border-gray-400 rounded-lg">
              {/* Product Type Selector */}
              <label htmlFor="product-type-selector" className="flex items-center mr-4">
                <img src={"/dashy-assets/logos/pharmacy.png"} alt="Select a product type" className="mr-2 h-6 w-6" /> {/* Placeholder icon, replace with actual */}
                <span className="text-gray-600">Product Type:</span>
              </label>
              <Select
                id="product-type-selector"
                options={productTypeOptions}
                value={selectedProductType}
                onChange={(selectedOption) => setSelectedProductType(selectedOption)}
                className="flex-grow"
              />
            </div>
          </div>
        </div>
      </section>

      <div className={`flex flex-wrap ${isResponseReceived ? '-mx-4 -mb-1 md:mb-0' : ''}`}>


        <PageHeader title={'Possible Regulatory Pathway'} description={''} icon={'lifegraph.svg'} />

        <MermaidChart key={chart.length} chart={chart} onNodeClick={onNodeClick} />

        {isResponseReceived && (
          <div className="w-1/2 px-4 mb-4 md:mb-0 border border-gray-300 shadow-sm p-4">
            <PageHeader title={'Possible Regulatory Pathway'} description={''} icon={'lifegraph.svg'} />
            <MermaidChart key={chart.length} chart={chart} onNodeClick={onNodeClick} />
          </div>
        )}
      </div>
      {isDataLoading && (
        <InfinitySpin width='200' color="#7b60e8" />
      )}
    </div>

  )
}