export type IProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  on_sale: boolean;
  images: {
    thumbnail: string;
    large: string;
  };
  stock_status: string;
  stock_quantity: number;
};

export type IOrderItemRequest = {
  product_id: number;
  qty: number;
  item_price: number;
  item_total: number;
};

export type IOrderRequest = {
  order_date: string;
  customer_first_name?: string;
  customer_last_name: string;
  customer_address: string;
  customer_postcode: string;
  customer_city: string;
  customer_email: string;
  customer_phone?: string;
  order_total: number;
  created_at: string;
  updated_at: string;
  order_items: IOrderItemRequest[];
};

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  item_price: number;
  item_total: number;
}

export interface IOrder {
  id: number;
  order_date: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_address: string;
  customer_postcode: string;
  customer_city: string;
  customer_email: string;
  customer_phone?: string;
  order_total: number;
  created_at: string;
  updated_at: string;
  items: IOrderItem[];
}

export interface IProductResponse {
  status: string;
  data: IProduct;
}

export interface IProductsResponse {
  status: string;
  data: IProduct[];
}

export interface IOrderResponse {
  status: string;
  message: string;
  data: IOrder;
}

// type CartItem = {
//   id: number;
//   product_id: number;
//   product: IProduct;
//   quantity: number;
//   created_at: string;
// };

// type CartState = {
//   items: CartItem[];
//   total: number;
// };
