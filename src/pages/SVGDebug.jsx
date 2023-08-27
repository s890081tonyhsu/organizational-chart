import React from "react";
import { instance } from "@viz-js/viz";
import { useSelector } from "react-redux";

const SVGDebug = () => {
  const ref = React.useRef(null);
  const { source } = useSelector((state) => state.graph);

  React.useEffect(() => {
    const f = async () => {
      const viz = await instance();
      ref.current.innerHTML = "";
      ref.current.appendChild(
        viz.renderSVGElement(source, {
          format: "dot",
          yInvert: true,
        })
      );
    };
    if (ref) f();
  }, [source]);

  return <div ref={ref}></div>;
};

export default SVGDebug;
