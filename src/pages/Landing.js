import React, { useEffect, useState, useRef } from "react";
import PageHeader from "../components/shared/PageHeader";
import { useApi } from '../callApi';
import { InfinitySpin } from 'react-loader-spinner';
import ModalComponent from "../components/ModalComponent";
import Select from "react-select";

export default function Landing() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

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

  // Updated to reflect InstaCast's focus
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

  const { callApi } = useApi();
  const hasRun = useRef(false);


  useEffect(() => {
    if (!hasRun.current) {

      hasRun.current = true;
    }
  }, []);

  return (
    <div>
      <header className="bg-white py-6 md:py-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <img width={'60px'} src='/dashy-assets/logos/InstaCast-icon.png' alt='InstaCast Logo' className="h-10md:h-12 mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">InstaCast</h1>
              <p className="text-gray-500 text-base">Navigate drug regulatory pathways effortlessly</p>
            </div>
          </div>
          <div>
            <a href="#get-started" className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition ease-in-out duration-150">
              Get Started
            </a>
          </div>
        </div>
      </header>
      <main>
        <section className="container mx-auto px-4 md:px-6 py-6">
          <PageHeader title={'Explore Regulatory Pathways'} description={'A comprehensive tool for navigating through drug registration and approval processes across the globe.'} />
          <div className="flex flex-wrap -mx-4 mb-4">
            <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
              <div className="p-6 bg-white border hover:border-gray-400 rounded-lg cursor-pointer">
                <img src={"/dashy-assets/logos/globe.png"} alt="" className="mx-auto h-12 w-12" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-center">Market</h3>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  <Select
                    options={countries}
                    value={selectedCountry}
                    onChange={(selectedOption) => setSelectedCountry(selectedOption)}
                  />

                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
              <div className="p-6 bg-white border hover:border-gray-400 rounded-lg cursor-pointer">
                <img src={"/dashy-assets/logos/pharmacy.png"} alt="" className="mx-auto h-12 w-12" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-center">Product Type</h3>
                <p className="mt-2 text-sm text-gray-600 text-center">Choose Product Type</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
              <div className="p-6 bg-white border hover:border-gray-400 rounded-lg cursor-pointer">
                <img src={"/dashy-assets/logos/regulatory.png"} alt="" className="mx-auto h-12 w-12" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-center">Regulatory Goal</h3>
                <p className="mt-2 text-sm text-gray-600 text-center">Choose market</p>
              </div>
            </div>

          </div>
          <hr />
          <br />
          <div className="flex flex-wrap -mx-4 mb-4">
            {regulatoryTools.map((tool) => (
              <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4" key={tool.id}>
                <div className="p-6 bg-white border hover:border-gray-400 rounded-lg cursor-pointer">
                  <img src={"/assets/images / ${tool.icon}"} alt={tool.name} className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 font-heading text-lg font-semibold text-center">{tool.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 text-center">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="get-started" className="py-6 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center text-2xl font-semibold mb-4">Get Started with InstaCast</h2>
            <p className="text-center text-gray-600 mb-6">Sign up to access detailed guides, regulatory updates, and personalized support for navigating drug regulatory pathways.
            </p>
            <div className="flex justify-center">
              <a href="/signup" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition ease-in-out duration-150">
                Sign Up
              </a>
              <a href="/login" className="ml-4 border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition ease-in-out duration-150">
                Log In
              </a>
            </div>
          </div>
        </section>
        {isDataLoading && (
          <div className="flex justify-center items-center h-64">
            <InfinitySpin width="200" color="#4F46E5" />
          </div>
        )}
      </main>
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PageHeader title={'Connect Regulatory Data'} description={'Connect with global regulatory databases to streamline your drug development process'} />

      </ModalComponent>
    </div>
  );
}