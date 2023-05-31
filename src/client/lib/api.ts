export const baseFetch = async (url: string, options: any = {}) => {
  return fetch(`${location.origin}${location.pathname}${url}`, options).then(
    (res) => res.json()
  );
};

export const getTimezoneList = async () => {
  return baseFetch("api/project/timezone/lists").then((res) => {
    return res.map((item) => {
      return {
        label: item.tz_name,
        value: item.tz
      };
    });
  });
};
