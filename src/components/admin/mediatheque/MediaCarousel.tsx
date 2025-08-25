import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import React, { useState } from 'react';

type Item = {
  type: string;
  value: string;
};

type MediaCarouselProps = {
  items: Item[];
};

export const MediaCarousel = ({ items }: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <CardMedia key={index} sx={{ height: 140, flex: '0 0 auto', width: '100%' }} image={item.value} title="Media" />
        ))}
      </div>
      <Button
        style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', fontSize: '2.5em !important' }}
        onClick={goToPrevSlide}
      >
        <NavigateBeforeIcon />
      </Button>
      <Button
        style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', fontSize: '2.5em !important' }}
        onClick={goToNextSlide}
      >
        <NavigateNextIcon />
      </Button>
    </div>
  );
};
