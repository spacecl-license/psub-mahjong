import type { SVGProps } from "react";
const SvgProhibition = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17 10C17 13.866 13.866 17 10 17C8.42767 17 6.97642 16.4816 5.80785 15.6064L15.6064 5.80785C16.4816 6.97642 17 8.42767 17 10ZM4.39363 14.1922L14.1922 4.39363C13.0236 3.51841 11.5723 3 10 3C6.13401 3 3 6.13401 3 10C3 11.5723 3.51841 13.0236 4.39363 14.1922ZM19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
      fill="black"
    />
  </svg>
);
export default SvgProhibition;
