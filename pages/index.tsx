import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import Products from "../components/products";
import * as process from "node:process";
import { TIndexProps, TProduct, TProfileResponse, TRole } from "types";
import { headerCookieParse, logout } from "utils";
import { profileService } from "services"; // This gets called on every request on the server side
import Users from "components/users";

// This gets called on every request on the server side
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  // Example logic block. May be FEATURE_TOGGLE or AUTHORISATION_CHECK or etc.

  // Get cookies and try to find the token
  const cookies = headerCookieParse(context.req.headers.cookie);
  const token = cookies["access_token"];
  let profile: TProfileResponse;
  // only authorised user may access the page
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    profile = await profileService(token);
    // case of invalid token came from the frontend side
    if (profile.statusCode == 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }

  // Fetch data from external API
  try {
    const products: TProduct[] = await fetch(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=3",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          PAYED_SUBSCRIPTION_TOKEN: `${process.env.PAYED_SUBSCRIPTION_TOKEN}`,
        },
      },
    ).then((response) => response.json());
    // Pass data to the page via props
    return { props: { products, profile } };
  } catch ({ message }) {
    console.error(message);
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
};

// This is the client side logic
const Index: React.FC<TIndexProps> = ({ products, profile }) => {
  console.log("FIND_ME_Index");
  const [role, setRole] = React.useState<TRole>(profile.role);

  const switchRole = () => {
    if (role !== "admin") {
      setRole("admin");
    } else {
      setRole("customer");
    }
  };

  return (
    <div>
      <h1>Protected page</h1>
      <button onClick={logout}>Logout</button>
      <p>
        <a href={"/admin"}>ADMIN SPACE &quot;/admin&quot;</a>
      </p>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Products products={products} />
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Your role: {role}</p>
          <button onClick={switchRole}>Switch role</button>
          {role === "admin" && <Users />}
        </div>
      </div>
    </div>
  );
};

export default Index;
