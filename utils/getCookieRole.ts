export function getCookieRole() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("role="))
    ?.split("=")[1];
  return cookieValue || "customer";
}
