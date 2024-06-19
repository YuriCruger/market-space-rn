interface PaymentMethods {
  key: string;
  name: string;
}

export interface ProductImages {
  id: string;
  path: string;
}

export interface ProductDTO {
  id: string;
  accept_trade: boolean;
  is_new: boolean;
  name: string;
  payment_methods: PaymentMethods[];
  price: number;
  product_images: ProductImages[];
  user: {
    avatar: string;
  };
}
