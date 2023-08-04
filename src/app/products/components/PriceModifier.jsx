import { motion, AnimatePresence } from "framer-motion";
import { useProductListContext } from "../ProductList";
import { useState, useEffect } from "react";
import useCustomRouter from "@/hooks/useCustomRouter";

import MultiSlide from "./MultiSlide";

export default function PriceModifier() {
  const { pushQuery, query } = useCustomRouter();

  const { priceDrop, contentVariants, range } = useProductListContext();

  const { minPrice, maxPrice } = range;

  const min = minPrice._min.price;
  const max = maxPrice._max.price;

  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  useEffect(() => {
    minValue >= 0 && pushQuery({ minPrice: minValue });
    maxValue && pushQuery({ maxPrice: maxValue });
  }, [minValue, maxValue]);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     minValue && pushQuery({ minPrice: minValue });
  //     maxValue && pushQuery({ maxPrice: maxValue });
  //   }, 500);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [minValue, maxValue]);

  const handleChange = ({ min, max }) => {
    setMinValue(min);
    setMaxValue(max);
  };

  const priceVariants = {
    opened: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    closed: { y: -35, opacity: 0, transition: { duration: 0.4 } },
  };
  return (
    <AnimatePresence>
      {priceDrop && (
        <motion.div
          initial="closed"
          animate={priceDrop ? "opened" : "closed"}
          exit="closed"
          variants={priceVariants}
          className="w-56 -ml-5"
        >
          <MultiSlide min={min} max={max} onChange={handleChange} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
