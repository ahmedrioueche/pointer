'use client';

import React, { useEffect, useState } from 'react';
import ParentHome from './ParentHome';
import ChildHome from './ChildHome';

interface HomeProps {
  user: {
    userType: string;
    userId: number;
  };
}

const Home: React.FC<HomeProps> = ({ user }) => {

  if(user.userType === "parent"){
    return <ParentHome id={user.userId}/>
  }
  else return <ChildHome user={user}/>
}

export default Home;
