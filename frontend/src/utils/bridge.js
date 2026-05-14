export const getPythonApi = () => {
  return new Promise((resolve) => {
    if (window.pywebview && window.pywebview.api) {
      resolve(window.pywebview.api);
    } else {
      window.addEventListener('pywebviewready', () => {
        resolve(window.pywebview.api);
      });
    }
  });
};

export const callPython = async (method, ...args) => {
  const api = await getPythonApi();
  if (api[method]) {
    return await api[method](...args);
  }
  throw new Error(`Method ${method} not found on Python API`);
};
