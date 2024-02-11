import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/shared/Layout";
import PageHeader from "../components/shared/PageHeader";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from '../callApi';
import { InfinitySpin } from 'react-loader-spinner';

export default function Journal() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { callApi } = useApi();
  const hasRun = useRef(false);

  const [lifeboard, setLifeBoard] = useState({})

  const fetchData = async () => {
    return await callApi(`/lifeboard`);

  };

  const taskStats = {
    totalTasks: '5,943',
    runningTasks: '51',
    pendingTasks: '3,305',
    confirmedPayments: '$194k',
    pendingPayments: '$37k',
    completionRate: '76%',
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
    <Layout>
      <PageHeader showHeader={true} title={'Lifeboard'} icon={'dashboard.svg'} />

      {isDataLoading ? (<InfinitySpin
        width='200'
        color="#7b60e8"
      />) : (
        < section className="py-4 overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="bg-white overflow-hidden border rounded-xl">
              <div className="px-6 pt-6 pb-7">
                <div className="flex flex-wrap items-center mb-3.5 -m-2">
                  <div className="w-auto p-2">
                    <img src={user.picture} alt="User Avatar" />
                  </div>
                  <div className="w-auto p-2">
                    <p className="text-xl font-medium">{user.name}</p>
                    <p className="text-sm text-neutral-500 font-medium">{user.email}</p>
                  </div>
                </div>
                <p className="text-md font-medium">
                  {/* {userInfo.bio} {JSON.stringify(lifeboard)} */}
                  {lifeboard.short_summary}
                </p>
                <hr className="p-2 mt-2" />
                <p className="text-sm font-medium">
                  {/* {userInfo.bio} {JSON.stringify(lifeboard)} */}
                  {lifeboard.full_summary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )


      }




    </Layout >
  )
}