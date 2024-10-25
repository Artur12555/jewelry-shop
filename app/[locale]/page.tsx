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
  margin: 0 auto;
  border-radius: 120px; /* Add rounded corners */
  overflow: hidden; /* Ensure the corners are applied */
`;

const CarouselImage = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer; /* Change cursor to pointer to indicate it's clickable */
`;

// Define the type for the photo data
interface Photo {
  url: string;
  site: string;
}

const Home = () => {
  // Update the state to use the Photo type
  const [photos, setPhotos] = useState<Photo[]>([]);

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
    <CarouselContainer>
      <Carousel 
        responsive={responsive}
        infinite={true}
        arrows={true}
        renderArrowsWhenDisabled={false}
        autoPlay={true} // Enable auto-swipe
        autoPlaySpeed={5000} // Set swipe interval to 5 seconds
      >
        {photos.map((photo, index) => (
          <div key={index} onClick={() => handleClick(photo.site)}> {/* Handle click event */}
            <CarouselImage src={photo.url} alt={`Photo ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </CarouselContainer>
  );
};

export default Home;
