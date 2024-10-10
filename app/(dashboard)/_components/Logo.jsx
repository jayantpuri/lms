import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/lms-logo.svg"
      alt="LMS logo"
      width={130}
      height={130}
    />
  );
};

export default Logo;
