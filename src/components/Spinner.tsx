import { JSX } from "solid-js";

interface SpinnerProps {
  type?: "puff"; // You can add more types if needed
  strokeOpacity?: number;
}

const Spinner = ({ type = "puff", strokeOpacity = 1 }: SpinnerProps): JSX.Element => {
  const spinnerStyle = {
    opacity: strokeOpacity,
  };

  return <div class={`spinner ${type}`} style={spinnerStyle}></div>;
};

export default Spinner;
