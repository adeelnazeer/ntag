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
import Card from "../../../assets/images/img1.webp";
import img2 from "../../../assets/images/img3.webp";
import img3 from "../../../assets/images/img5.webp";
import { useTranslation } from "react-i18next";


const CarouselCustomNavigation = () => {
  const { t } = useTranslation(["home"]);
  const slidesData = t("carousel.slides", { returnObjects: true });
  const images = [Card, img2, img3];
  
  const slides = slidesData.map((slide, index) => ({
    ...slide,
    image: images[index]
  }));
  return (
    <div id="home">
      <Carousel
        className="rounded-xl "
        nextArrow={false}
        prevArrow={false}
        autoplay={true}
        autoplayDelay={5000}
        loop={true}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-10 flex -translate-x-2/4 gap-2 ">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-gray-300"
                  }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {slides.map((slide, index) =>
          <div key={index} className=" grid md:grid-cols-2 grid-cols-1 bg-secondary   rounded-[40px]  justify-between items-center md:mt-0 mt-2 ">
            <div className=" md:pl-12 py-4 md:py-0 md:pr-6 h-full flex flex-col justify-center px-2 col-span-1 ">
              <h2 className="text-white md:text-[46px] text-[25px] font-semibold mb-0 md:mt-0">
                {slide?.title}
              </h2>
              <p className=" text-white font-medium md:text-[18px] mb-4  text-[15px]">
                {slide?.para1}
              </p>
              <p className=" text-white md:text-[18px]  text-[15px]">
                {slide?.para2}
              </p>
              <p className=" text-white mt-4 md:text-[18px]  text-[15px]">
                {slide?.description}
              </p>
            </div>
            <div className="flex-1  md:mt-0 mt-2">
              <img src={slide?.image} alt="card" className=" md:min-h-[500px] w-full" />
            </div>
          </div>
        )}

      </Carousel>
    </div>
  );
};

export default CarouselCustomNavigation;
