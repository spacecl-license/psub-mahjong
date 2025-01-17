import type { SVGProps } from "react";
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_23_2194)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.692 7.17683C18.0636 7.43934 18.1047 7.89859 17.7839 8.2026L10.8759 14.748C10.71 14.9053 10.4697 14.997 10.2158 14.9999C9.96185 15.0029 9.71851 14.9168 9.54715 14.7635L2.23287 8.21802C1.90161 7.92159 1.92679 7.46156 2.2891 7.19054C2.65141 6.91951 3.21366 6.94011 3.54492 7.23654L10.1842 13.1779L16.4383 7.25197C16.7592 6.94796 17.3205 6.91432 17.692 7.17683Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_23_2194">
        <rect width={20} height={20} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgArrow;
