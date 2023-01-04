/**
 * get formatted date by timestamp
 */
export function getDate(time: number) {
  const d = time > 0 ? new Date(time) : new Date();
  const day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  const month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  const year = d.getFullYear();
  const hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
  const minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
  const second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  let millisecond =
    d.getMilliseconds() < 10 ? "0" + d.getMilliseconds() : d.getMilliseconds();
  if (millisecond < 100) {
    millisecond = "0" + millisecond;
  }
  return {
    time: +d,
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second,
    millisecond: millisecond
  };
}

/**
 * localStorage methods
 */
export function setStorage(key: string, value: string) {
  if (!window.localStorage) {
    return;
  }
  key = "wisdom_" + key;
  localStorage.setItem(key, value);
}
export function getStorage(key: string) {
  if (!window.localStorage) {
    return;
  }
  key = "wisdom_" + key;
  return localStorage.getItem(key);
}

/**
 * Generate a 6-digit unique string with prefix `"__vc_" + ${prefix}`
 */
export function getUniqueID(prefix = "") {
  return "__ws_" + prefix + Math.random().toString(36).substring(2, 8);
}

export function getCookie(k: string) {
  const cookieReg = new RegExp(`(^| )${k}=([^;]*)(;|$)`);
  const matches = document.cookie.match(cookieReg);

  return !matches ? "" : decodeURIComponent(matches[2]);
}

export function setCookie(
  k: string,
  v: any,
  domain?: string,
  path?: string,
  hour?: number
) {
  const ts = Date.now() + 3600 * (hour || 0);
  const expireKV = hour ? `; expires=${new Date(ts).toUTCString()}` : "";
  const pathKV = ` path=${path || "/"}`;
  const domainKV = domain ? ` domain=${domain};` : "";

  document.cookie = `${k}=${v}${expireKV};${pathKV};${domainKV}`;
}

export function clearCookie(k: string, domain?: string, path?: string) {
  const OVER_TIME = "Mon, 26 Jul 1997 05:00:00 GMT";
  document.cookie = `${k}=; expires=${OVER_TIME}; path=${path || "/"}; ${
    domain ? `domain=${domain};` : ""
  }`;
}
