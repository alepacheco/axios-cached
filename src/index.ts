import axios from 'axios';

const saveToCache = async (url: string, response: any) => {
  const cache = await caches.open('axios-cached');

  cache.put(url, response);
};

const getFromCache = async (request: string) => {
  const cache = await caches.open('axios-cached');

  return cache.match(request);
};

const cachedGet = (url: string, ...args: any[]) => {
  // @ts-ignore
  const response = axios.get(url, ...args).then(response => {
    saveToCache(url, response.data);

    return response;
  });

  const onHandler = async (callback: any): Promise<any> => {
    callback(await getFromCache(url));

    response.then(callback);
    return response;
  };

  // @ts-ignore
  response.on = onHandler;

  return response as Promise<any> & { on: Function};
};

export default cachedGet;
