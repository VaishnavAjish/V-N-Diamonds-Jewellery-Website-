import React, { useEffect, useState } from "react";
import { FadeLoader, BarLoader } from "react-spinners";
import Lottie from "lottie-react";

const Loader = ({ loading, spinner = "scale", color="0989FF" }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/assets/diamond-spinner.json')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setAnimationData(data))
      .catch(err => console.log("Custom Lottie animation not found, falling back to default."));
  }, []);

  if (!loading) return null;

  return (
    <div className="text-center d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
      {animationData ? (
        <div style={{ width: 150, height: 150 }}>
          <Lottie animationData={animationData} loop={true} />
        </div>
      ) : (
        <>
          {spinner === "scale" && (
            <BarLoader
              color={`#${color}`}
              loading={loading}
              height={8}
              width={100}
              margin={2}
            />
          )}
          {spinner === "fade" && <FadeLoader loading={loading} color="#0989FF" />}
        </>
      )}
    </div>
  );
};

export default Loader;
