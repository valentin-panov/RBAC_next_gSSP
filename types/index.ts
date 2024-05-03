export type TProduct = {
  id: string;
  title: string;
  price: string;
  description: string;
  category: {
    id: string;
    name: string;
    image: string;
  };
  images: [string, string, string];
};

export type TIndexProps = {
  products: TProduct[];
  profile: TProfile;
};

export type TProductProps = {
  products: TProduct[];
};

export type TRole = "customer" | "admin";

export type TProfile = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: TRole;
  avatar: string;
};

export type TProfileResponse = TProfile & {
  message: string;
  statusCode: number;
};

export type TCookies = {
  [key: string]: string;
};

export type TCreds = {
  email: string;
  password: string;
};
