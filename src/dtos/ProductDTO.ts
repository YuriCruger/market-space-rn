export interface PaymentMethods {
  key: string;
  name: string;
}

export interface ProductImages {
  id: string;
  path: string;
}

export interface EditImages {
  id?: string;
  path?: string;
  name?: string;
  uri?: string;
  type?: string;
  isNew: boolean;
}

export interface ProductDTO {
  id: string;
  accept_trade: boolean;
  is_new: boolean;
  is_active: boolean;
  name: string;
  description: string;
  payment_methods: PaymentMethods[];
  price: number;
  product_images: ProductImages[];
  user: {
    avatar: string;
    name: string;
    tel: string;
  };
  user_id: string;
}
