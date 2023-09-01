"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

const SmoothScroller = () => {
	useEffect(() => {
		const lenis = new Lenis();

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		console.log("SmoothIndeed");
		requestAnimationFrame(raf);
	}, []);

	return <></>;
};

export default SmoothScroller;
