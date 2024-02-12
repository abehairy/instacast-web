import { useAuth0 } from "@auth0/auth0-react";

export function useApi(publicapi) {
  let { getAccessTokenSilently } = {}
  if (!publicapi) getAccessTokenSilently = useAuth0();
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const callApi = async (endpoint, options = {}, body = null, queryParams = {}) => {
    try {
      let accessToken = null;
      if (!publicapi)
        accessToken = await getAccessTokenSilently();


      // Append query parameters to the endpoint
      const urlParams = new URLSearchParams(queryParams).toString();
      const url = `${apiBaseUrl}${endpoint}${urlParams ? `?${urlParams}` : ''}`;

      // Set up the fetch options
      const fetchOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      // Add the body to the fetch options if it's a POST request
      if (body && options.method === 'POST') {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      return await response.json();
    } catch (error) {
      console.error('Error making API call', error);
      throw error;
    }
  };

  const uploadFile = async (endpoint, fileData, queryParams = {}) => {
    try {
      let accessToken = null;
      if (!publicapi)
        accessToken = await getAccessTokenSilently();

      // Append query parameters to the endpoint
      const urlParams = new URLSearchParams(queryParams).toString();
      const url = `${apiBaseUrl}${endpoint}${urlParams ? `?${urlParams}` : ''}`;

      // Set up fetch options for file upload
      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: fileData, // Directly use FormData here
      };

      const response = await fetch(url, fetchOptions);
      return await response.json();
    } catch (error) {
      console.error('Error uploading file', error);
      throw error;
    }
  };

  return { callApi, uploadFile }
}
