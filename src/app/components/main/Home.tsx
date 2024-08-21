import React from 'react';
import Card from './Card'; // Adjust the import path as needed
import AddChildCard from './AddCard'; // Adjust the import path as needed

interface HomeProps {
    userType: string;
}

interface Child  {
    id: number;
    name: string;
    age: number;
    gender: 'male' | 'female';
    profileUrl: string;
}

const Home: React.FC<HomeProps> = ({ userType}) => {
    // Sample data for the child cards
    const children : Child[] = [
        { id: 1, name: 'Alice', age: 8, gender: 'female', profileUrl: '/profile/alice' },
        { id: 2, name: 'Bob', age: 10, gender: 'male', profileUrl: '/profile/bob' },
        // Add more children as needed
    ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => (
           <Card
            id={child.id}
            key={index}
            name={child.name}
            age={child.age}
            gender={child.gender}
            profileUrl={child.profileUrl}
         />
        ))}
        <AddChildCard />
      </div>
    </div>
  );
};

export default Home;
