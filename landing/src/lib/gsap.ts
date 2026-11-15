import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const EASE = [0.16, 1, 0.3, 1] as const;
export const ELASTIC = "elastic.out(1,0.5)";
