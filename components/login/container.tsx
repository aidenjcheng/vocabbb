import * as React from "react";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 flex items-center justify-center h-screen">
    <div className="box-border w-fit">
      <div className="gap-6 pb-1 place-content-center padding-[2rem_2.5rem] relative border-[rgba(0,0,0,0.03)]  transition-[background-color,background,border-color,color,fill,stroke,opacity,box-shadow,transform] items-stretch flex-col flex box-border min-w-[20rem]">
        {children}
      </div>
    </div>
  </div>
);

export default Container;
