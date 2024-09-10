'use client';

import React from 'react';
import ParentHome from './ParentHome';
import ChildHome from './tasks/ChildTasks';
import ChildHomeTest from './child/ChildHome';

interface HomeProps {
  user: {
    type: string;
    id: number;
    name: string;
  };
}

const Home: React.FC<HomeProps> = ({ user }) => {
  if (user.type === 'parent') {
    return (
        <ParentHome id={user.id} />
    );
  } else {
    return <ChildHomeTest user={user} />;
  }
};

export default Home;
