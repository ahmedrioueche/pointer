import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image component from Next.js for optimized image handling
import Link from 'next/link';

interface CardProps {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  profileUrl: string;
}

const Card: React.FC<CardProps> = ({ id, name, age, gender, profileUrl }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(profileUrl);
  };

  const imageSrc = gender === 'male' ? '/boy.png' : '/girl.png'; // Path to your images
  const gradientBg = gender === 'male' ? 'bg-gradient-to-br from-blue-300 to-blue-500' : 'bg-gradient-to-br from-pink-300 to-pink-500';

  return (
    <Link href={`/main/child/${id}`}>
      <div
        className={`relative p-6 ${gradientBg} z-[0] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
        onClick={handleClick}
      >
        {/* Profile Image */}
        <div className="flex items-center justify-center w-30 h-30 mx-auto rounded-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={gender === 'male' ? 'Boy' : 'Girl'}
            width={90} // Set appropriate width
            height={90} // Set appropriate height
            className="object-cover h-32 w-32"
          />
        </div>

        {/* Details */}
        <div className="mt-4 text-center">  
          <h3 className="text-2xl font-stix mb-1">{name}</h3>
          <p className="text-lg font-satisfy">Age: {age}</p>
          <button
            className={`mt-4 px-4 py-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
            hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}
            onClick={(e) => {
              e.stopPropagation(); 
              router.push(`/main/child/${id}`);
            }}
          >
            Profile
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
