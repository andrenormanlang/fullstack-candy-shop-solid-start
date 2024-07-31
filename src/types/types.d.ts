export type IProduct = {
  id?: number,
  name?: string,
  description?: string,
  price?: number,
  on_sale?: boolean,
  images?: {
      thumbnail: string,
      large: string,
  },
  stock_status?: string,
  stock_quantity?: number,
}

// POST request
export type IOrderRequest = {
order_date: string,
customer_first_name?: string,
customer_last_name: string,
customer_address: string,
customer_postcode: string,
customer_city: string,
customer_email: string,
customer_phone?: string,
order_total: number,
created_at: string,
updated_at: string,
  order_items: IOrderItemRequest[]
}

// POST request
export type IOrderItemRequest = {
      product_id: number,
      qty: number,
      item_price: number,
      item_total: number
}

// Order response
export type IOrder = {
  id: number,
  [key: string]: any;
  order_date: string,
  customer_first_name: string,
  customer_last_name: string,
  customer_address: string,
  customer_postcode: string,
  customer_city: string,
  customer_email: string,
  customer_phone?: string,
  order_total: number,
  created_at: string,
  updated_at: string,
  items: IOrderItem[]}

//Order response
export interface IOrderItem{
  id: number,
  order_id: number,
  product_id: number,
  qty: number,
  item_price: number,
  item_total: number
}


export interface IProductResponse {
  status: string, data: IProduct
}

export interface IProductsResponse {
  status: string, data: IProduct[]
}

export interface IOrderResponse {
  status: string, message: string, data: IOrder
}
