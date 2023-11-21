import { useRouter } from 'next/router';
import React from 'react';

const getArticle = (language: string) => {
  if (language.length === 0) {
    return '';
  }
  if ('aeiou'.includes(language[0])) {
    return "l'";
  }
  return 'le ';
};

const ExpressionStep1 = () => {
  
};
export default ExpressionStep1;
