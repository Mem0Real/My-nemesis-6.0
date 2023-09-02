"use client";

import styles from "../styles/mask.module.scss";
import React, { useState, useEffect, useRef } from "react";

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

export default function BottomMask() {
	const [maskPositionX, setMaskPositionX] = useState(0);
	const [maskPositionY, setMaskPositionY] = useState(0);

	const [isMobile, setIsMobile] = useState(false);
	const [isLaptop, setIsLaptop] = useState(false);

	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);

		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (windowSize.width && windowSize.width <= 768) {
			setIsMobile(true);
		} else setIsMobile(false);
	}, [windowSize]);

	const rootRef = useRef();
	const maskRef = useRef();
	const scaleRef = useRef();

	const smScroll = useScroll({
		target: rootRef,
		offset: ["start 20vh", "end 100vh"],
	});

	const nmScroll = useScroll({
		target: rootRef,
		offset: ["start 150vh", "end end"],
	});

	const lgScroll = useScroll({
		target: rootRef,
		offset: ["start 30vh", "end end"],
	});
	// const { scrollYProgress } = isMobile
	// 	? smScroll
	// 	: isLaptop
	// 	? nmScroll
	// 	: lgScroll;

	const { scrollYProgress } = useScroll({
		target: rootRef,
		offset: ["start 150vh", "end end"],
	});

	useEffect(() => {
		const maskRect = maskRef.current.getBoundingClientRect();
		const bodyX = window.innerWidth - maskRect.width;
		const bodyY = window.innerHeight - maskRect.height;

		setMaskPositionX(window.innerWidth - bodyX - 50);
		setMaskPositionY(bodyY + 190);
	}, [maskRef]);

	let scale = useMotionValue(20);
	let scaleText = useMotionValue(0.1);
	let moveTextX = useMotionValue(0);
	let moveTextY = useMotionValue(0);

	scale = useTransform(scrollYProgress, [0, 1], [20, 1]);
	const mtSm = useTransform(scrollYProgress, [0, 1], [30, -30]);
	// const mtNm = useTransform(scrollYProgress, [0.5, 1], [30, 50]);

	scaleText = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
	moveTextX = useTransform(scrollYProgress, [0, 1], [300, -250]);

	moveTextY = isMobile && mtSm;

	return (
		<main className="bg-neutral-100 dark:bg-neutral-800 backdrop-blur-lg">
			<div
				ref={rootRef}
				className="relative z-10 h-[180vh] xl:h-[150vh] overflow-clip"
			>
				<motion.div
					style={{ scale }}
					className={`absolute left-0 right-0 bottom-0 grid w-screen h-screen pb-96 gap-2 p-3 [grid-template-rows:4fr_1fr] origin-[50%_30%] md:origin-[5%_35%] lg:origin-[5%_28%] xl:origin-[3%_28%]`}
				>
					<div
						ref={scaleRef}
						className={`relative flex flex-col md:flex-row justify-end rounded-3xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 p-5`}
					>
						<div
							ref={maskRef}
							className="mx-auto my-12 box-content aspect-[3/8] md:aspect-[5/8] w-[100px] min-w-[100px] rounded-full border-[2px] border-gray-800 dark:border-gray-300 md:my-auto md:-ml-1 md:mr-auto md:w-[150px] md:min-w-[150px] overflow-hidden"
						>
							<motion.div className="relative w-full h-full flex flex-col justify-center items-center z-10 bg-neutral-100 dark:bg-neutral-900">
								<motion.h1
									className="text-xl md:text-2xl lg:text-4xl w-[200%] bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 -skew-x-12 text-center"
									style={{ scale: scaleText, x: moveTextX, y: moveTextY }}
								>
									Come Back Soon!
								</motion.h1>
							</motion.div>
						</div>
						<div className="flex flex-col items-end h-full py-16 -mt-12 gap-5 text-right">
							<h1 className="mb-5 max-w-[12ch] text-4xl font-bold leading-[0.85] md:my-auto md:text-6xl xl:text-7xl">
								For all your purchase needs!
							</h1>
							<p className="text-lg md:text-3xl">We are always here for you.</p>
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
