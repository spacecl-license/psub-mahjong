import type { SVGProps } from "react";
const SvgDetail = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 3H4V17H16V3ZM4 1C2.89543 1 2 1.89543 2 3V17C2 18.1046 2.89543 19 4 19H16C17.1046 19 18 18.1046 18 17V3C18 1.89543 17.1046 1 16 1H4Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 6C6 5.44772 6.44772 5 7 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H7C6.44772 7 6 6.55228 6 6Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 10C6 9.44772 6.44772 9 7 9H13C13.5523 9 14 9.44772 14 10C14 10.5523 13.5523 11 13 11H7C6.44772 11 6 10.5523 6 10Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 14C6 13.4477 6.44772 13 7 13H13C13.5523 13 14 13.4477 14 14C14 14.5523 13.5523 15 13 15H7C6.44772 15 6 14.5523 6 14Z"
      fill="black"
    />
  </svg>
);
export default SvgDetail;
