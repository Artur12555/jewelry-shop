"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CarouselTitle = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 4px;
    color: purple;
    font-style: italic;

`;

const CarouselSubTitle = styled.p`
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    margin-bottom: 40px;
    color: black;

`;

const OuterCarouselContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const CarouselContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-bottom: 10px;
  border-radius: 120px;
  margin-top: 40px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
    margin-top: 0px;
  }
`;

const CarouselImage = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer;
`;

const BadgeContainer = styled.div`
  width: 50%;
  margin: 20px auto;
`;

const Badge = styled.div`
  text-align: center;
  font-family: 'Lato', sans-serif;
`;

const BadgeImage = styled.img`
  width: 90px;
  height: 90px;
  margin: 0 auto;
  margin-bottom: 5px;
    @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

interface Photo {
  url: string;
  site: string;
}

const Home = () => {
  const t = useTranslations('Badges');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showArrows, setShowArrows] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('url, site');

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data);
        console.log(data);
      }
    };

    fetchPhotos();

    const handleResize = () => {
      setShowArrows(window.innerWidth >= 768);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = (site: string) => {
    window.open(site, '_blank');
  };

  const responsiveImages = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const responsiveBadges = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
    <OuterCarouselContainer>
      <CarouselContainer>
        <Carousel 
          responsive={responsiveImages}
          infinite={true}
          arrows={showArrows}
          renderArrowsWhenDisabled={false}
          autoPlay={true}
          autoPlaySpeed={5000}
        >
          {photos.map((photo, index) => (
            <div key={index} onClick={() => handleClick(photo.site)}>
              <CarouselImage src={photo.url} alt={`Photo ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      </CarouselContainer>
      <CarouselTitle>In your style</CarouselTitle>
      <CarouselSubTitle>biżuteria, która wyrazi kim jesteś</CarouselSubTitle>
      </OuterCarouselContainer>
      <BadgeContainer>
        <Carousel 
          responsive={responsiveBadges}
          infinite={true}
          autoPlay={isMobile} // Automatically play only if on mobile
          autoPlaySpeed={3000}
          arrows={false}
          showDots={false}
        >
          <Badge>
            <BadgeImage src="/images/fastdelivery.svg" alt="Fast delivery" />
            <span>{t('fastDelivery')}</span>
          </Badge>
          <Badge>
            <BadgeImage src="/images/certification.svg" alt="Certifications" />
            <span>{t('certifications')}</span>
          </Badge>
          <Badge>
            <BadgeImage src="/images/satisfaction.svg" alt="Guaranteed satisfaction" />
            <span>{t('guaranteedSatisfaction')}</span>
          </Badge>
          <Badge>
            <BadgeImage src="/images/uniqueness.svg" alt="Uniqueness" />
            <span>{t('uniqueness')}</span>
          </Badge>
          <Badge>
            <BadgeImage src="/images/payment.svg" alt="Safe payments" />
            <span>{t('safePayments')}</span>
          </Badge>
        </Carousel>
      </BadgeContainer>
    </>
  );
};

export default Home;
