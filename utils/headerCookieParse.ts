import { TCookies } from "../types";

export function headerCookieParse(cookiesString: string | undefined): TCookies {
  const cookies: TCookies = {};
  cookiesString &&
    cookiesString.split(";").forEach((cookie: string) => {
      const [key, value] = cookie.split("=").map((c) => c.trim());
      cookies[key] = value;
    });
  return cookies;
}
