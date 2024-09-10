import { useData } from '@/app/context/dataContext';
import React, { useEffect, useState } from 'react'
import ChildCard from '../child/ChildCard';
import RoutineModal from './RoutineModal';
import { Child } from '@/lib/interface';

const Routines: React.FC<{}> = () => {

    const [children, setChildren] = useState<any>([]);
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const [openedChild, setOpenedChild] = useState<any>();
    const [modalType, setModalType] = useState<any>();
    const childrenContext = useData();
    
    useEffect(() => {
        setChildren(childrenContext.children);
    },[childrenContext])
    
    const handleRoutineModalOpen = (id : number, type : string) => {
        const childData = childrenContext.children.filter((child:any) => child.id === id );
        setOpenedChild(childData.length > 0? childData[0] : null);
        setModalType(type);
        setIsRoutineModalOpen(true);
    }
    
  return (
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child : any, index : number) => (
                <div key={index} className="h-full w-full">
                    <ChildCard
                        type='routines'
                        id={child.id}
                        name={child.name}
                        age={child.age}
                        gender={child.gender}
                        achievedTasks={child.achievedTasks}
                        pendingTasks={child.pendingTasks}
                        icon={child.icon}
                        callback={(id : any, type : string)=>{handleRoutineModalOpen(id, type)}}
                    />
                </div>
            ))}
        </div>
        <RoutineModal
            type={modalType}
            isOpen={isRoutineModalOpen}
            onClose={() => setIsRoutineModalOpen(false)}
            user={null}
            child={openedChild}
        />
    </div> 
  )
}

export default Routines