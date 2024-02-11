import { useEffect, useState } from "react";
import Layout from "../components/shared/Layout";
import PageHeader from "../components/shared/PageHeader";

export default function Journal() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    // Function to fetch apps
    const fetchApps = async () => {
      try {
        const response = await fetch('https://jurni-ai-1c2c01e0a43e.herokuapp.com/api/connect/apps');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error("Fetching apps failed", error);
      }
    };

    // Call the function
    // fetchApps();
  }, []);
  return (
    <Layout>
      <PageHeader title={'Journal'} />
      <section class="py-4 overflow-hidden">
        <div class="container px-4 mx-auto">
          <div class="bg-white border rounded-xl">
            <div class="flex flex-wrap divide-y sm:divide-y-0 sm:divide-x">
              <div class="w-full sm:w-1/2">
                <div class="p-12 text-center">

                  {/* <img class="mb-7 mx-auto" src="dashy-assets/images/empty3.png" alt="" /> */}
                  <img class="mb-7 mx-auto" width="40%" src="  https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/320px-OpenAI_Logo.svg.png" alt="" />

                  <h3 class="mb-3 font-heading text-lg font-semibold">Jurni on ChatGPT</h3>
                  <p class="mb-7 text-neutral-500">You can start talking to Jurni through Jurni OpenAI Assistant.</p>
                  <a target="_blank" class="inline-flex flex-wrap items-center justify-center px-6 py-2.5 text-sm border hover:border-neutral-200 rounded-lg" href="https://chat.openai.com/g/g-BbANyPq2D-jurni-ai">
                    <span class="font-medium">Chat on ChatGPT</span>
                  </a>
                </div>
              </div>
              <div class="w-full sm:w-1/2">
                <div class="p-12 text-center">
                  {/* <img class="mb-7 mx-auto" src="dashy-assets/images/empty4.png" alt="" /> */}

                  <img class="mb-7 mx-auto" width="10%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1920px-Telegram_2019_Logo.svg.png" alt="" />

                  <h3 class="mb-3 font-heading text-lg font-semibold">Jurni on Telegram</h3>
                  <p class="mb-7 text-neutral-500">Create a goal for one of your teams that will appear in the team hub-that’s how everyone will know what to work on.</p>
                  <a class="inline-flex flex-wrap items-center justify-center px-6 py-2.5 text-sm border hover:border-neutral-200 rounded-lg" target="_blank" href="https://t.me/JurniAIBot">
                    <span class="font-medium">Chat on Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </Layout>
  )
}