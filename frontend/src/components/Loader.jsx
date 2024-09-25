import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className=" min-h-[50dvh] flex items-center justify-center">
      <InfinitySpin
        visible={true}
        width="200"
        color="black"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
};

export default Loader;
