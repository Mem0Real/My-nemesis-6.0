"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AddToCart from "./components/AddToCart";

export default function Item({ item }) {
  const [activeImage, setActiveImage] = useState("");
  const [amount, setAmount] = useState(1);
  const [modal, showModal] = useState(false);

  useEffect(() => {
    let image = item.images;

    if (image && activeImage === "") {
      setActiveImage(image[0]);
    }
  }, [activeImage]);

  const openImage = (image) => {
    setActiveImage(image);
  };

  const handleOrder = () => {
    showModal(true);
  };

  const closeModal = () => {
    showModal(false);
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-12 w-[95%]">
      <div className="order-2 sm:order-2 md:order-1 lg:order-1 grow-0 flex-wrap flex md:flex-col mx-auto place-content-center md:w-auto h-fit lg:items-start gap-6 mt-12 border-b-2 border-spacing-y-8 md:border-l-8 md:shadow-inner shadow-white rounded py-5 md:border-b-0 border-neutral-200">
        {item.images &&
          item.images.map((url, index) => {
            return (
              <div
                key={index}
                className={`relative h-16 w-16 ms-1 bg-neutral-900 rounded-full cursor-pointer hover:outline outline-1 outline-neutral-200 ${
                  activeImage === url &&
                  "md:translate-x-2 lg:translate-x-4 -translate-y-2 outline transition-all ease-in-out duration-500"
                }`}
                onClick={() => openImage(url)}
              >
                <Image
                  src={url}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
                  alt="Image"
                  className="object-contain rounded-lg"
                />
              </div>
            );
          })}
      </div>
      <div className="basis-1/2 grow order-1 lg:order-2 self-center lg:self-start lg:mt-24 relative lg:h-96 h-72 mt-5 rounded-3xl border-2 shadow-lg shadow-black border-neutral-900">
        {activeImage && (
          <Image
            src={activeImage}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
            alt="Image"
            className="object-contain rounded-lg"
            priority
          />
        )}
      </div>
      <div className="lg:basis-4/12 order-3 mb-6">
        <h1 className="text-4xl font-bold ms-4 mb-2">Product Details</h1>
        <div className="flex flex-col items-start ps-5 gap-7 py-6 w-[90%] bg-neutral-900 border border-neutral-200 text-neutral-200 rounded-xl drop-shadow-2xl ">
          <div className="flex gap-4 w-full">
            <h1 className=" text-md font-semibold">Product Name: </h1>
            <h2 className="ms-3 text-md"> {item.name}</h2>
          </div>
          <div className="flex gap-4 w-full">
            <h1 className="text-md font-semibold">Product Brand: </h1>
            <h2 className="ms-3 text-md"> {item.brand}</h2>
          </div>
          <div className="flex gap-4 w-full">
            <h1 className="text-md font-semibold">Product Model:</h1>
            <h2 className="ms-3 text-md"> {item.model}</h2>
          </div>
          <div className="w-[96%]">
            <h1 className="text-md font-semibold md:mb-3">Description</h1>
            <div className="h-48 border border-neutral-500 rounded-md">
              <h2 className="ms-3 text-md"> {item.description}</h2>
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <h1 className="text-md font-semibold">Quantity:</h1>
            <h2 className="ms-3 text-md"> {item.quantity}</h2>
          </div>
          <div className="flex gap-4 w-full">
            <h1 className="text-md font-semibold">Price:</h1>
            {item.price && (
              <h2 className="ms-3 text-md flex gap-1">
                {item.price}
                <span className="text-neutral-400 py-0.5 text-sm font-medium  my-auto">
                  ETB
                </span>
              </h2>
            )}
          </div>
          <div className="self-center">
            <button
              className="py-2 px-2 rounded-lg outline outline-1 outline-neutral-200 hover:outline-2 ring-offset-2 active:ring-2"
              onClick={handleOrder}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <AddToCart item={item} modal={modal} closeModal={closeModal} />
    </div>
  );
}
