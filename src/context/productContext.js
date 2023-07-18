"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { setCookie, parseCookies } from "nookies";

const ProductContext = createContext({});

export default function ProductDataContext({ children }) {
  const [data, setData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [updater, setUpdater] = useState(false);
  const [purchasedData, setPurchasedData] = useState([]);

  const cookieStore = parseCookies();

  useEffect(() => {
    // const product = JSON.parse(localStorage.getItem("Product"));
    let cart, product;
    if (cookieStore?.Product) product = JSON.parse(cookieStore.Product);

    if (product?.length > 0) {
      console.log(product);
      setData(product);
    }
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    if (cart?.length > 0) {
      setCartData(cart);
      setCookie(null, "Cart_State", true);
      // localStorage.setItem("Cart_State", JSON.stringify(true));
    }
  }, []);

  const storeProduct = (id, quantity) => {
    // If there is cache
    let product;
    if (cookieStore?.Product) product = JSON.parse(cookieStore.Product);

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
        // localStorage.setItem("Product", JSON.stringify(productData));
        setCookie(null, "Product", JSON.stringify(productData));
      } else {
        const newData = { id: id, quantity: quantity };

        setData((prev) => [...prev, newData]);
        product.push(newData);
        // localStorage.setItem("Product", JSON.stringify(product));
        setCookie(null, "Product", JSON.stringify(product));
      }
    } else {
      let newEntry = { id: id, quantity: quantity };
      setData(() => [newEntry]);
      // localStorage.setItem("Product", JSON.stringify([newEntry]));
      setCookie(null, "Product", JSON.stringify([newEntry]));
    }
  };

  const addCartData = (id, name, quantity, amount, itemPrice) => {
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    let cart;
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);

    if (cart?.length > 0) {
      const cartCache = cart.find((item) => item.id === id);

      if (cartCache) {
        let cartItems = cart.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              amount: parseInt(amount),
              totalPrice: itemPrice * amount,
            };
          }
          return item;
        });

        setCartData(cartItems);
        // localStorage.setItem("Cart", JSON.stringify(cartItems));
        setCookie(null, "Cart", JSON.stringify(cartItems));
        toast("Cart item updated!");
      } else {
        const newCartItem = {
          id: id,
          name: name,
          quantity: quantity,
          amount: parseInt(amount),
          itemPrice: itemPrice,
          totalPrice: amount * itemPrice,
        };

        setCartData((prev) => [...prev, newCartItem]);
        cart.push(newCartItem);
        // localStorage.setItem("Cart", JSON.stringify(cart));
        setCookie(null, "Cart", JSON.stringify(cart));
        toast("Item added to cart!");
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
      // localStorage.setItem("Cart", JSON.stringify([newCartItem]));
      setCookie(null, "Cart", JSON.stringify([newCartItem]));

      toast("Item added to cart!");
    }
  };

  const addProductQuantity = (id) => {
    // const product = JSON.parse(localStorage.getItem("Product"));

    let product;
    if (cookieStore?.Product) product = JSON.parse(cookieStore.Product);

    if (product?.length > 0) {
      let newArray = product.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: parseInt(item.quantity) + 1 };
        }
        return item;
      });
      setData((prev) => [...prev, newArray]);
      // localStorage.setItem("Product", JSON.stringify(newArray));
      setCookie(null, "Product", JSON.stringify(newArray));
    } else {
      toast.error("Item not found!");
    }
  };

  const subtractProductQuantity = (id) => {
    // const product = JSON.parse(localStorage.getItem("Product"));

    let product;
    if (cookieStore?.Product) product = JSON.parse(cookieStore.Product);

    if (product?.length > 0) {
      let newArray = product.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: parseInt(item.quantity) - 1 };
        }
        return item;
      });
      setData((prev) => [...prev, newArray]);
      // localStorage.setItem("Product", JSON.stringify(newArray));
      setCookie(null, "Product", JSON.stringify(newArray));
    } else {
      console.log("Item not found");
    }
  };

  const changeProductQuantity = (id, newQuantity) => {
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    let cart;
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);

    if (cart?.length > 0) {
      let newArray = cart.map((item) => {
        if (item.id === id) {
          if (newQuantity > item.quantity) {
            return { id: item.id, quantity: parseInt(item.quantity) };
          }
          if (newQuantity <= 0) {
            return { id: item.id, quantity: 1 };
          }
          return {
            id: item.id,
            quantity: parseInt(item.quantity - newQuantity),
          };
        }
        return { id: item.id, quantity: item.quantity - item.amount };
      });
      setData((prev) => [...prev, newArray]);
      // localStorage.setItem("Product", JSON.stringify(newArray));
      setCookie(null, "Product", JSON.stringify(newArray));
    } else {
      console.log("Item not found!");
    }
  };

  const addCartQuantity = (id) => {
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    let cart;
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);

    if (cart?.length > 0) {
      let newArray = cart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            amount: parseInt(item.amount) + 1,
            totalPrice: item.itemPrice * (parseInt(item.amount) + 1),
          };
        }
        return item;
      });
      setCartData((prev) => [...prev, newArray]);
      // localStorage.setItem("Cart", JSON.stringify(newArray));
      setCookie(null, "Cart", JSON.stringify(newArray));
    } else {
      console.log("Item not found");
    }
  };

  const subtractCartQuantity = (id) => {
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    let cart;
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);

    if (cart?.length > 0) {
      let newArray = cart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            amount: parseInt(item.amount) - 1,
            totalPrice: item.itemPrice * (parseInt(item.amount) - 1),
          };
        }
        return item;
      });
      setCartData((prev) => [...prev, newArray]);
      // localStorage.setItem("Cart", JSON.stringify(newArray));
      setCookie(null, "Cart", JSON.stringify(newArray));
    } else {
      console.log("Item not found");
    }
  };

  const changeCartQuantity = (id, newQuantity) => {
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    let cart;
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);

    if (cart?.length > 0) {
      let newArray = cart.map((item) => {
        if (item.id === id) {
          if (newQuantity > item.quantity) {
            return {
              ...item,
              amount: parseInt(item.quantity),
              totalPrice: item.itemPrice * item.quantity,
            };
          }
          if (newQuantity <= 0) {
            return {
              ...item,
              amount: 1,
              totalPrice: item.itemPrice * 1,
            };
          }
          return {
            ...item,
            amount: parseInt(newQuantity),
            totalPrice: item.itemPrice * newQuantity,
          };
        }
        return item;
      });
      setData((prev) => [...prev, newArray]);
      // localStorage.setItem("Cart", JSON.stringify(newArray));
      setCookie(null, "Cart", JSON.stringify(newArray));
    } else {
      console.log("Item not found!");
    }
  };

  const removeCartItem = (id) => {
    // const cart = JSON.parse(localStorage.getItem("Cart"));
    let cart;
    if (cookieStore?.Cart) cart = JSON.parse(cookieStore.Cart);

    if (cart?.length > 0) {
      let newArray = cart
        .map((item) => {
          if (item.id === id) {
            return null;
          }
          return item;
        })
        .filter((item) => item !== null);
      // localStorage.setItem("Cart", JSON.stringify(newArray));
      setCookie(null, "Cart", JSON.stringify(newArray));
    } else {
      console.log("Item not found.");
    }
  };

  const removeProductItem = (id) => {
    // const product = JSON.parse(localStorage.getItem("Product"));

    let product;
    if (cookieStore?.Product) product = JSON.parse(cookieStore.Product);

    if (product?.length > 0) {
      let newArray = product
        .map((item) => {
          if (item.id === id) {
            return null;
          }
          return item;
        })
        .filter((item) => item !== null);
      // localStorage.setItem("Product", JSON.stringify(newArray));
      setCookie(null, "Product", JSON.stringify(newArray));
    } else {
      console.log("Item not found.");
    }
  };

  const subtractQuantity = (id) => {
    addProductQuantity(id);
    subtractCartQuantity(id);
  };

  const addQuantity = (id) => {
    subtractProductQuantity(id);
    addCartQuantity(id);
  };

  const changeQuantity = (id, newQuantity) => {
    changeProductQuantity(id, newQuantity);
    changeCartQuantity(id, newQuantity);
  };

  const removeItem = (id) => {
    // restoreCartQuantity(id);
    removeCartItem(id);
    // restoreProductQuantity(id);
    removeProductItem(id);
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
        changeQuantity,
        updater,
        setUpdater,
        removeItem,
        purchasedData,
        setPurchasedData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
