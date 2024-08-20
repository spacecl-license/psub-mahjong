import type { SVGProps } from "react";
const SvgDontLook = (props: SVGProps<SVGSVGElement>) => (
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
      d="M18.5 2.70703C18.8905 2.31651 18.8905 1.68334 18.5 1.29282C18.1095 0.902293 17.4763 0.902293 17.0858 1.29282L1.29289 17C0.902369 17.3905 0.902369 18.0237 1.29289 18.4142C1.68342 18.8047 2.31658 18.8047 2.70711 18.4142L18.5 2.70703ZM10 3.70708C11.0704 3.70708 12.0043 3.82632 12.831 4.04768L11.1161 5.76258C10.7708 5.72626 10.3999 5.70708 10 5.70708C7.8996 5.70708 6.5967 6.23633 5.61332 7.00056C4.78204 7.64658 4.07944 8.53423 3.33738 9.70708C3.8914 10.5827 4.42343 11.2994 5.00344 11.8752L3.58944 13.2892C2.59877 12.3036 1.79706 11.0734 1.00003 9.70708C3.00003 6.27851 5.02947 3.70708 10 3.70708ZM16.4106 6.12492L14.9966 7.53892C15.5766 8.11475 16.1087 8.83143 16.6627 9.70708C15.9206 10.8799 15.218 11.7676 14.3867 12.4136C13.4034 13.1778 12.1005 13.7071 10 13.7071C9.60021 13.7071 9.22928 13.6879 8.88396 13.6516L7.16905 15.3665C7.99571 15.5878 8.92968 15.7071 10 15.7071C14.9706 15.7071 17 13.1357 19 9.70708C18.203 8.34073 17.4013 7.11052 16.4106 6.12492ZM10 6.70708C10.0561 6.70708 10.1117 6.70862 10.167 6.71165L7.0046 9.87408C7.00157 9.8188 7.00003 9.76312 7.00003 9.70708C7.00003 8.05023 8.34317 6.70708 10 6.70708ZM12.9955 9.54008L9.83302 12.7025C9.88831 12.7055 9.94399 12.7071 10 12.7071C11.6569 12.7071 13 11.3639 13 9.70708C13 9.65104 12.9985 9.59536 12.9955 9.54008Z"
      fill="black"
    />
  </svg>
);
export default SvgDontLook;
