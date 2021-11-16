import { SVGProps } from 'react';

const PencilIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="512px"
        height="512px"
        viewBox="0 0 512 512"
        enableBackground="new 0 0 512 512"
        xmlSpace="preserve"
        onClick={props.onClick}
      >
        <g>
          <path
            fill="#FFFFFF"
            d="M422.953,176.019c0.549-0.48,1.09-0.975,1.612-1.498l21.772-21.772c12.883-12.883,12.883-33.771,0-46.654
				l-40.434-40.434c-12.883-12.883-33.771-12.883-46.653,0l-21.772,21.772c-0.523,0.523-1.018,1.064-1.498,1.613L422.953,176.019z"
          />
          <polygon
            fill="#FFFFFF"
            points="114.317,397.684 157.317,440.684 106.658,448.342 56,456 63.658,405.341 71.316,354.683 	"
          />
          <polygon
            fill="#FFFFFF"
            points="349.143,125.535 118.982,355.694 106.541,343.253 336.701,113.094 324.26,100.653 81.659,343.253
				168.747,430.341 411.348,187.74 	"
          />
        </g>
      </svg>
    </>
  );
};

export default PencilIcon;
