// import { Carousel } from "react-responsive-carousel";
// import Card from "../../../assets/images/Card.png";

// const Carusal = () => {
//   return (
//     <Carousel
//       showThumbs={false}
//       showStatus={false}
//       showArrows={false}
//       showIndicators={false}
//     >
//       <div className=" grid grid-cols-2 bg-secondary justify-between items-center  rounded-[15px]">
//         <div className=" pl-12 pr-6 flex-1">
//           <h2 className="text-white text-[46px] font-semibold">
//             Service For Computer
//           </h2>
//           <p className=" text-white mt-4 text-[18px]">
//             Want to receive a monthly email in your inbox with awesome free
//             Webflow cloneables, resources and more? Please submit your email
//             below. Want to receive a monthly email in your inbox with awesome
//             free Webflow cloneables, resources and more? Please submit your
//             email below.
//           </p>
//         </div>
//         <div className="flex-1">
//           <img src={Card} alt="card" className=" h-[500px]"/>
//         </div>
//       </div>
//       <div className="flex bg-secondary justify-between rounded-[15px]">
//         <div>
//           <h2 className="text-white text-[50px] font-semibold">
//             Service For Computer
//           </h2>
//         </div>
//         <div>
//           <img src={Card} alt="card" />
//         </div>
//       </div>
//       <div className="flex bg-secondary justify-between rounded-[15px]">
//         <div>
//           <h2 className="text-white text-[50px] font-semibold">
//             Service For Computer
//           </h2>
//         </div>
//         <div>
//           <img src={Card} alt="card" />
//         </div>
//       </div>
//     </Carousel>
//   );
// };

// export default Carusal;

import { Carousel } from "@material-tailwind/react";
import Card from "../../../assets/images/Card.png";

const CarouselCustomNavigation = () => {
  return (
    <Carousel
      className="rounded-xl "
      nextArrow={false}
      prevArrow={false}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-10 flex -translate-x-2/4 gap-2 ">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-black" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      <div className=" grid md:grid-cols-2 grid-cols-1  bg-secondary justify-between items-center md:mt-0 mt-2 rounded-[15px]">
        <div className=" md:pl-12 md:pr-6 px-2 col-span-1">
          <h2 className="text-white md:text-[46px] text-[25px] font-semibold mt-12 md:mt-0">
            Service For Computer
          </h2>
          <p className=" text-white mt-4 md:text-[18px] text-[15px]">
            Want to receive a monthly email in your inbox with awesome free
            Webflow cloneables, resources and more? Please submit your email
            below. Want to receive a monthly email in your inbox with awesome
            free Webflow cloneables, resources and more? Please submit your
            email below.
          </p>
        </div>
        <div className="flex-1  md:mt-0 mt-2">
          <img src={Card} alt="card" className=" h-[500px] w-full" />
        </div>
      </div>
      <div className=" grid md:grid-cols-2 grid-cols-1  bg-secondary justify-between items-center md:mt-0 mt-2 rounded-[15px]">
        <div className=" md:pl-12 md:pr-6 px-2 col-span-1">
          <h2 className="text-white md:text-[46px] text-[25px] font-semibold mt-12 md:mt-0">
            Service For Computer
          </h2>
          <p className=" text-white mt-4 md:text-[18px] text-[15px]">
            Want to receive a monthly email in your inbox with awesome free
            Webflow cloneables, resources and more? Please submit your email
            below. Want to receive a monthly email in your inbox with awesome
            free Webflow cloneables, resources and more? Please submit your
            email below.
          </p>
        </div>
        <div className="flex-1  md:mt-0 mt-2">
          <img src={Card} alt="card" className=" h-[500px] w-full" />
        </div>
      </div>
    </Carousel>
  );
};

export default CarouselCustomNavigation;
