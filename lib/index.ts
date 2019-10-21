import axios from 'axios';

const axiosCached = (...args: any[]) => {
  throw new Error('unimplemented');
};

axiosCached.get = (...args: any[]) => {
  // @ts-ignore
  const response = axios.get(...args);

  const onHandler = async (callback: Function) => {
    callback({ cache: true, data: { foo: 'hey there' } });

    response.then(callback);
    return response
  };
  response.on = onHandler;

  return response;
};

export default axiosCached;
