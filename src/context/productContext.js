"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext({});

export default function ProductDataContext({ children }) {
  const [data, setData] = useState([]);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const product = JSON.parse(localStorage.getItem("Product"));
    if (product?.length > 0) {
      console.log(product);
      setData(product);
    }
    const cart = JSON.parse(localStorage.getItem("Cart"));
    if (cart?.length > 0) {
      setCartData(cart);
      localStorage.setItem("Cart_State", JSON.stringify(true));
    }
  }, []);

  const storeProduct = (id, quantity) => {
    const product = JSON.parse(localStorage.getItem("Product"));

    // If there is cache
    if (product?.length > 0) {
      const productCache = product.find((item) => item.id === id);

      // If product exists in cache
      if (productCache) {
        let productData = data.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: quantity };
          }
          return item;
        });
        setData(productData);
        localStorage.setItem("Product", JSON.stringify(productData));
      } else {
        const newData = { id: id, quantity: quantity };

        setData((prev) => [...prev, newData]);
        product.push(newData);
        localStorage.setItem("Product", JSON.stringify(product));
      }
    } else {
      let newEntry = { id: id, quantity: quantity };
      setData(() => [newEntry]);
      localStorage.setItem("Product", JSON.stringify([newEntry]));
    }
  };

  const addCartData = (id, name, quantity, amount, itemPrice) => {
    const cart = JSON.parse(localStorage.getItem("Cart"));

    if (cart?.length > 0) {
      const cartCache = cart.find((item) => item.id === id);

      if (cartCache) {
        let cartItems = cartData.map((item) => {
          if (item.id === id) {
            return { ...item, amount: amount, totalPrice: itemPrice * amount };
          }
          return item;
        });

        setCartData(cartItems);
        localStorage.setItem("Cart", JSON.stringify(cartItems));
      } else {
        const newCartItem = {
          id: id,
          name: name,
          quantity: quantity,
          amount: amount,
          itemPrice: itemPrice,
          totalPrice: amount * itemPrice,
        };

        setCartData((prev) => [...prev, newCartItem]);
        cart.push(newCartItem);
        localStorage.setItem("Cart", JSON.stringify(cart));
      }
    } else {
      let newCartItem = {
        id: id,
        name: name,
        quantity: quantity,
        amount: amount,
        itemPrice: itemPrice,
        totalPrice: amount * itemPrice,
      };
      setCartData(() => [newCartItem]);
      localStorage.setItem("Cart", JSON.stringify([newCartItem]));
    }
  };

  const subtractQuantity = (id) => {
    const product = JSON.parse(localStorage.getItem("Product"));

    if (product?.length > 0) {
      let newArray = product.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setData((prev) => [...prev, newArray]);
      localStorage.setItem("Product", JSON.stringify(newArray));
    } else {
      console.log("Item not found");
    }
  };

  const addQuantity = (id) => {
    const product = JSON.parse(localStorage.getItem("Product"));

    if (product?.length > 0) {
      let newArray = product.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setData((prev) => [...prev, newArray]);
      localStorage.setItem("Product", JSON.stringify(newArray));
    } else {
      console.log("Item not found");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        data,
        setData,
        storeProduct,
        addCartData,
        subtractQuantity,
        addQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
