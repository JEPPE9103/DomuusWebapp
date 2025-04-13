import React from "react";

type Props = {
  zIndex?: string;
};

const BackgroundShapes = ({ zIndex }: Props) => {
  return (
    <div className={`hidden md:flex absolute inset-0 ${zIndex}`}>
      <div className="absolute top-[-100px] left-[-150px] w-[400px] h-[400px] bg-[#00bfa5] rounded-[50px] rotate-65" />
      <div className="absolute top-[-200px] right-[-175px] w-[400px] h-[400px] bg-[#00bfa5] rounded-[50px] rotate-65" />
      <div className="absolute bottom-[-200px] right-[-300px] w-[400px] h-[400px] bg-[#00bfa5] rounded-[50px] rotate-65" />
      <div className="absolute bottom-[-350px] left-[-225px] w-[400px] h-[400px] bg-[#00bfa5] rounded-[50px] rotate-65" />
    </div>
  );
};

export default BackgroundShapes;
