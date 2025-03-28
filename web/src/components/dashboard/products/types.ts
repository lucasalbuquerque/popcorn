interface User {
  fullName: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  attributes?: {
    color?: string;
    size?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  user: User;
}
