// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper core and required modules
import { Navigation, Pagination, A11y } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { logger } from '@/util/logger';

type SwiperProps = {
  pictures: ImageProps[];
};

function SwiperModule(pictures: SwiperProps): JSX.Element {
  logger.log('pictures:', pictures);

  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      navigation={true}
      pagination={{ clickable: true }}
      className="w-full h-full">
      {pictures.pictures.map((pic: ImageProps, index: number) => (
        <SwiperSlide key={index} style={{ backgroundImage: `url(${pic.cloud_pic})` }} className="bg-no-repeat bg-center bg-cover"></SwiperSlide>
      ))}
    </Swiper>
  );
}

export { SwiperModule };
