import type { SVGProps } from "react";
const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17 2H8V3H6V2C6 0.895431 6.89543 0 8 0H17C18.1046 0 19 0.895431 19 2V14C19 15.1046 18.1046 16 17 16H15V14H17V2ZM3 6H12V18H3L3 6ZM1 6C1 4.89543 1.89543 4 3 4H12C13.1046 4 14 4.89543 14 6V18C14 19.1046 13.1046 20 12 20H3C1.89543 20 1 19.1046 1 18V6Z"
      fill="black"
    />
  </svg>
);
export default SvgCopy;
