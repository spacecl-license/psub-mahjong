import type { SVGProps } from "react";
const SvgLook = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.3867 12.7065C15.218 12.0605 15.9206 11.1729 16.6626 10C15.9206 8.82714 15.218 7.9395 14.3867 7.29348C13.4033 6.52925 12.1004 6 10 6C7.89957 6 6.59667 6.52925 5.61329 7.29348C4.78202 7.9395 4.07941 8.82714 3.33735 10C4.07941 11.1729 4.78202 12.0605 5.61329 12.7065C6.59667 13.4707 7.89957 14 10 14C12.1004 14 13.4033 13.4707 14.3867 12.7065ZM19 10C17 13.4286 14.9706 16 10 16C5.02944 16 3 13.4286 1 10C3 6.57143 5.02944 4 10 4C14.9706 4 17 6.57143 19 10ZM9 10C9 9.44772 9.44772 9 10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10ZM10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7Z"
      fill="black"
    />
  </svg>
);
export default SvgLook;
