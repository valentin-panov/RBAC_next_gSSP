import React from "react";
import { GetServerSidePropsContext } from "next";
import { headerCookieParse } from "utils";
import { profileService } from "../services";

const Admin: React.FC = () => {
  console.log("FIND_ME_Admin");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Admin Space</h1>
      <button onClick={() => (window.location.href = "/")}>
        Back to index
      </button>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Example logic block. May be FEATURE_TOGGLE or AUTHORISATION_CHECK or etc.

  // Get cookies and try to find the token
  const cookies = headerCookieParse(context.req.headers.cookie);
  const token = cookies["access_token"];
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    const profile = await profileService(token);
    // case of invalid token came from the frontend side
    if (profile.statusCode == 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    } else if (profile.role !== "admin") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return { props: {} };
}

export default Admin;
