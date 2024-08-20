import type { SVGProps } from "react";
const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_639_3857)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 9.12419L53.8667 50.4625H6.13333L30 9.12419ZM24.6963 6.06209C27.0535 1.9793 32.9465 1.9793 35.3037 6.06209L59.1704 47.4004C61.5276 51.4832 58.5811 56.5867 53.8667 56.5867H6.13333C1.41892 56.5867 -1.52758 51.4832 0.829622 47.4004L24.6963 6.06209ZM34.3202 25.4078L30.514 35.6067C30.4271 35.8396 30.15 36 29.8348 36C29.5136 36 29.2328 35.8336 29.1513 35.5948L25.6472 25.3322C24.8993 23.1418 27.099 21 30.0463 21C33.0359 21 35.1442 23.1997 34.3202 25.4078ZM33 42.75C33 44.4069 31.6569 45.75 30 45.75C28.3432 45.75 27 44.4069 27 42.75C27 41.0931 28.3432 39.75 30 39.75C31.6569 39.75 33 41.0931 33 42.75Z"
        fill="#E10B0B"
      />
    </g>
    <defs>
      <clipPath id="clip0_639_3857">
        <rect width={60} height={60} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgWarning;
