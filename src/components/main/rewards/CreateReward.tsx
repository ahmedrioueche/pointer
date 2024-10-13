import { Reward } from '@/types/interface';
import { useEffect, useRef, useState } from 'react';
import { FaPlus, FaGift, FaTimes } from 'react-icons/fa';

interface CreateRewardProps {
    type?: any;
    onCreate: (reward: Reward) => void;
    rewardToEdit?: Reward | null;
    onClose?: any;
}

const CreateReward: React.FC<CreateRewardProps> = ({ onCreate, rewardToEdit, type, onClose }) => {
    const [newRewardTitle, setNewRewardTitle] = useState<string>("");
    const [newRewardPoints, setNewRewardPoints] = useState<number>(10);
    const [newRewardDesc, setNewRewardDesc] = useState<string | undefined>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (rewardToEdit) {
            setNewRewardTitle(rewardToEdit.name);
            setNewRewardDesc(rewardToEdit.description);
            setNewRewardPoints(rewardToEdit.points);
        }
    }, [rewardToEdit]);

    const handleCreate = () => {
        if (newRewardTitle.trim()) {
            const newReward: Reward = {
                name: newRewardTitle,
                points: newRewardPoints,
                description: newRewardDesc ? newRewardDesc : undefined,
                icon: rewardToEdit?.icon || FaGift,
            };
            onCreate(newReward);
            setNewRewardTitle("");
            setNewRewardDesc("");
            setNewRewardPoints(10);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [newRewardDesc]);

    return (
        <div className="bg-gradient-to-r transform transition-transform hover:scale-105 from-purple-600 to-blue-500 p-6 rounded-lg shadow-md text-light-text dark:text-dark-text">
            {/* Title and Close Button in the same row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <FaPlus className="text-4xl mr-3 text-dark-text" />
                    <h2 className="text-xl font-stix text-dark-text">
                        {rewardToEdit ? "Edit Reward" : "Create New Reward"}
                    </h2>
                </div>
                {type === "create_challenge" && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
                    >
                        <FaTimes size={16} />
                    </button>
                )}
            </div>

            <div className="mb-1">
                <input
                    type="text"
                    value={newRewardTitle}
                    onChange={(e) => setNewRewardTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-4 rounded-lg placeholder:text-dark-text shadow-md text-dark-text dark:placeholder-dark-text bg-purple-600 border border-purple-600 focus:border-light-background focus:outline-none transition-all duration-300 mb-3"
                />
                <textarea
                    ref={textareaRef}
                    value={newRewardDesc}
                    onChange={(e) => setNewRewardDesc(e.target.value)}
                    placeholder="Description"
                    className="w-full p-4 mb-2 overflow-hidden rounded-lg placeholder:text-dark-text shadow-md text-dark-text dark:placeholder-dark-text bg-purple-600 border border-purple-600 focus:border-light-background focus:outline-none transition-all duration-300 box-border resize-none"
                    style={{ minHeight: '4rem' }}
                />
                {type !== "create_challenge" && (
                    <input
                        type="number"
                        value={newRewardPoints}
                        onChange={(e) => setNewRewardPoints(parseInt(e.target.value))}
                        placeholder="Points"
                        className="w-full p-4 rounded-lg placeholder:text-dark-text shadow-md text-dark-text dark:placeholder-dark-text bg-purple-600 border border-purple-600 focus:border-light-background focus:outline-none transition-all duration-300 mb-4 no-spinner"
                    />
                )}
            
            </div>
            <button
                onClick={handleCreate}
                className="w-full p-4 rounded-lg bg-primary text-dark-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400  transition-colors duration-300 flex items-center justify-center"
            >
                <FaPlus size={20} className="inline mr-2" />
                {rewardToEdit ? "Update Reward" : type === "create_challenge"? "Add Reward" : "Create Reward"}
            </button>
        </div>
    );
};

export default CreateReward;
