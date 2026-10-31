import React from 'react';
import { 
  Utensils, 
  Plane, 
  Home, 
  ShoppingCart, 
  Film, 
  Zap, 
  ShoppingBag, 
  MoreHorizontal,
  DollarSign
} from 'lucide-react';

export const getCategoryIcon = (categoryId, size = 18) => {
  switch (categoryId) {
    case 'food':
      return <Utensils size={size} />;
    case 'travel':
      return <Plane size={size} />;
    case 'accommodation':
      return <Home size={size} />;
    case 'groceries':
      return <ShoppingCart size={size} />;
    case 'entertainment':
      return <Film size={size} />;
    case 'utilities':
      return <Zap size={size} />;
    case 'shopping':
      return <ShoppingBag size={size} />;
    default:
      return <MoreHorizontal size={size} />;
  }
};
