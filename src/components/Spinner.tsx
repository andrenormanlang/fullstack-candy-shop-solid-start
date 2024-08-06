import { Motion } from "solid-motionone";

const Spinner = () => {
  return (
    <Motion.div
      class="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 1, repeat: Infinity, easing: "linear" }}
    />
  );
};

export default Spinner;

