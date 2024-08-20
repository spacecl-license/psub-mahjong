import type { SVGProps } from "react";
const SvgDone = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_143_33037)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54 30C54 43.2548 43.2548 54 30 54C16.7452 54 6 43.2548 6 30C6 16.7452 16.7452 6 30 6C43.2548 6 54 16.7452 54 30ZM60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30ZM43.9558 23.6056C45.0267 22.3413 44.87 20.4483 43.6057 19.3774C42.3415 18.3065 40.4484 18.4633 39.3775 19.7275L26.9226 34.4313L18.2338 29.1084C16.821 28.2429 14.9741 28.6866 14.1086 30.0994C13.243 31.5122 13.6867 33.3592 15.0995 34.2247L25.9819 40.8914C27.244 41.6646 28.8815 41.4017 29.8382 40.2723L43.9558 23.6056Z"
        fill="#07D472"
      />
    </g>
    <defs>
      <clipPath id="clip0_143_33037">
        <rect width={60} height={60} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgDone;
