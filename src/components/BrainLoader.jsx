import React from 'react';
import LottiePackage from 'lottie-react';
import brainAnimation from '../../public/lottie/Brain.json';

// Safely resolve the Lottie component whether it's wrapped in a .default property or not (ESM/CJS interop fix)
const Lottie = LottiePackage.default ? LottiePackage.default : LottiePackage;

const BrainLoader = ({ size = 200, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <Lottie 
          animationData={brainAnimation} 
          loop={true} 
          autoPlay={true}
        />
      </div>
    </div>
  );
};

export default BrainLoader;
