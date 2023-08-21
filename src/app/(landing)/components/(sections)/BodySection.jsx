"use client";

import styles from "../../styles/body.module.scss";
import { useRef } from "react";

import ShopCategory from "../ShopCategory";
import BestSellers from "../BestSellers";
import Company from "../Company";

import { motion, useScroll, useTransform } from "framer-motion";
import ServiceShow from "../ServiceShow";

export default function BodySection({ products, categories }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 20]);

  const imageX = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <main className=" bg-neutral-100 dark:bg-neutral-800 backdrop-blur-lg">
      <div ref={ref} className="relative z-10 h-[200vh] overflow-clip">
        <motion.div
          style={{ scale }}
          className={`${styles.heroBackground} absolute left-0 top-0 grid gap-2 p-3 pt-6 [grid-template-rows:4fr_1fr] origin-[50%_62%] md:origin-[94%_32%] lg:origin-[96%_32%]`}
        >
          <div
            className={`relative flex flex-col md:flex-row justify-start rounded-3xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 px-5 pt-3 md:pb-12`}
          >
            <div className="flex h-72 md:h-full flex-col py-6 mt-6 gap-6">
              <h1 className="mb-5 max-w-[12ch] font-bold leading-[0.85] md:my-auto text-4xl md:text-6xl xl:text-7xl">
                Browse to your heart&apos;s desire!
              </h1>
              <p className="text-lg md:text-3xl">
                From the wide variety of products our company offers, we can
                guarantee that you will find what you are looking for.
              </p>
            </div>
            <div className="mx-auto mb-7 mt-4 box-content aspect-[5/8] w-[100px] min-w-[100px] rounded-full border border-gray-800 dark:border-gray-300 md:my-auto md:-mr-1 md:ml-auto md:w-[150px] md:min-w-[150px]" />
          </div>
        </motion.div>
      </div>

      <Company />
      <BestSellers products={products} />

      <ShopCategory categories={categories} />
      <ServiceShow />
    </main>
  );
}
