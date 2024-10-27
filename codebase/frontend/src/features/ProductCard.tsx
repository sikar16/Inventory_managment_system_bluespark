// ProductCard.tsx
import React from "react";

interface ProductCardProps {
  name: string;
  price: number;
  description: string;
  imageUrl: string; // URL for the product image
  rating: number; // Star rating from 1 to 5
  onClick: () => void; // Callback for when the card is clicked
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  description,
  imageUrl,
  rating,
  onClick,
}) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-yellow-500">
          {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </p>
        <p className="text-gray-600 mt-1">{description}</p>
        <p className="text-gray-800 font-bold mt-2">${price.toFixed(2)}</p>
      </div>
      <div className="bg-gray-100 p-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
          Add to Request
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
