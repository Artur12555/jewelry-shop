"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styled from 'styled-components';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CarouselContainer = styled.div`
  width: 80%;
  margin: 40px auto 0; /* Set top margin for desktop */
  border-radius: 120px; /* Add rounded corners */
  overflow: hidden; /* Ensure the corners are applied */

  @media (max-width: 768px) {
    width: 100%; /* Full width on smaller screens */
    border-radius: 0; /* Remove rounded corners */
    margin-top: 0px; /* Set top margin for mobile */
  }
`;

const CarouselImage = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer; /* Change cursor to pointer to indicate it's clickable */
`;

const BadgeContainer = styled.div`
  width: 50%; /* Same width as the carousel */
  margin: 20px auto; /* Space above and below the badge container */
  display: flex; /* Use flexbox for layout */
  justify-content: space-between; /* Evenly space the badges */
  align-items: center; /* Center badges vertically */
`;

const Badge = styled.div`
  text-align: center; /* Center text below each SVG */
    font-family: 'Lato', sans-serif;

`;

const BadgeImage = styled.img`
  width: 90px; /* Adjust size as needed */
  height: 90px; /* Adjust size as needed */
  margin: 0 auto;
  margin-bottom: 5px; /* Space between icon and text */
`;

interface Photo {
  url: string;
  site: string;
}

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showArrows, setShowArrows] = useState<boolean>(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('url, site'); // Fetch both url and site

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data); // Set the state with the fetched data
        console.log(data); // Debug: log fetched data
      }
    };

    fetchPhotos();

    const handleResize = () => {
      if (window.innerWidth < 768) { // Adjust this value as needed
        setShowArrows(false);
      } else {
        setShowArrows(true);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize); // Add resize event listener

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);

  const handleClick = (site: string) => {
    window.open(site, '_blank'); // Open the URL in a new tab
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <CarouselContainer>
        <Carousel 
          responsive={responsive}
          infinite={true}
          arrows={showArrows} // Set arrows based on state
          renderArrowsWhenDisabled={false}
          autoPlay={true} // Enable auto-swipe
          autoPlaySpeed={5000} // Set swipe interval to 5 seconds
        >
          {photos.map((photo, index) => (
            <div key={index} onClick={() => handleClick(photo.site)}>
              <CarouselImage src={photo.url} alt={`Photo ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      </CarouselContainer>
      
      <BadgeContainer>
        <Badge>
          <BadgeImage src="/images/fastdelivery.svg" alt="Fast delivery" />
          Fast delivery
        </Badge>
        <Badge>
          <BadgeImage src="/images/certification.svg" alt="Certifications" />
          Certifications
        </Badge>
        <Badge>
          <BadgeImage src="/images/satisfaction.svg" alt="Guaranteed satisfaction" />
          Guaranteed satisfaction
        </Badge>
        <Badge>
          <BadgeImage src="/images/uniqueness.svg" alt="Uniqueness" />
          Uniqueness
        </Badge>
        <Badge>
          <BadgeImage src="/images/payment.svg" alt="Safe payments" />
          Safe payments
        </Badge>
      </BadgeContainer>
    </>
  );
};

export default Home;
