import Link from "next/link";
import Image from "next/image";
import SlickCarousel from "@/app/catalogue/components/SlickCarousel";
import NestedCarousel from "@/app/catalogue/components/NestedCarousel";
import Slider from "../../components/Slider";

export default function Items({ parent, child, items }) {
	return <Slider items={items} child={child} parent={parent} />;
}
