import React from 'react';
import { 
  PizzaSliceIcon, 
  RocketIcon, 
  CottageIcon, 
  PopcornIcon, 
  ShoppingBagIcon, 
  LightningIcon,
  CoinIcon 
} from '../components/common/CustomIcons';
import { MoreHorizontal } from 'lucide-react';

export const getCategoryIcon = (categoryId, size = 20) => {
  switch (categoryId) {
    case 'food':
      return <PizzaSliceIcon size={size} />;
    case 'travel':
      return <RocketIcon size={size} />;
    case 'accommodation':
      return <CottageIcon size={size} />;
    case 'groceries':
      return <ShoppingBagIcon size={size} />;
    case 'entertainment':
      return <PopcornIcon size={size} />;
    case 'utilities':
      return <LightningIcon size={size} />;
    case 'shopping':
      return <ShoppingBagIcon size={size} />;
    default:
      return <CoinIcon size={size} />;
  }
};
