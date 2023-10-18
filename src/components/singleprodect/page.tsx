import axios from "axios";

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const getProduct = async (productId: number) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
    