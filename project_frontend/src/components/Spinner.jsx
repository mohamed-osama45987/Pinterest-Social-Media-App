
import { Circles } from "react-loader-spinner";

function Spinner({ message }) {
  return (
    // customizing and adding our loader
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Circles
        color="#00BFFF"
        height={50}
        width={200}
        className="m-5"
        ariaLabel="circles-loading"
      />

      <p className="text-lg text-center px-2 mt-2">{message}</p>
    </div>
  );
}

export default Spinner;
