import React, { useState } from 'react';
import { FaUser, FaBirthdayCake, FaGenderless, FaImage, FaPlus, FaTimes, FaUserPlus } from 'react-icons/fa';
import CustomSelect from '../CustomSelect';
import LoadingButton from '../LoadingButton';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChild: (name : string, age : string, gender: "male" | "female", image: File | null) => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({ isOpen, onClose, onAddChild }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, age, gender, image });
    const cgender = gender === "male"? "male" : "female";
    onAddChild(name, age, cgender, image);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center font-stix justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-[90vw] max-h-[95vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-gray-800 dark:text-gray-200">
            <FaUserPlus className="text-3xl mr-3" />
            <h2 className="text-xl font-bold">Add Child</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <form  className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
          {/* Name Card */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaUser className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Name</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md p-3 bg-dark-text text-gray-800 focus:border-light-primary dark:focus:border-dark-primary focus:outline-none"
                placeholder="Enter child's name"
                required
              />
            </div>
          </div>
          {/* Age Card */}
          <div className="bg-gradient-to-r from-green-400 via-blue-500 to-teal-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaBirthdayCake className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold  font-satisfy mb-2">Age</h3>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border rounded-md p-3 bg-dark-text text-gray-800 focus:border-light-primary dark:focus:border-dark-primary no-spinner focus:outline-none"
                placeholder="Enter child's age"
                required
              />
            </div>
          </div>
          {/* Gender Card */}
          <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-orange-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaGenderless className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Gender</h3>
              <CustomSelect
                value={gender}
                onChange={(value) => setGender(value)}
                classname="bg-light-background py-3 dark:bg-light-background outline-none border-none text-light-text dark:text-light-text hover:text-dark-text dark:hover:text-dark-text"
              />
            </div>
          </div>
          {/* Image Card */}
          <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaImage className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Image</h3>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-700 file:py-2 file:px-4 file:border file:border-transparent file:rounded-md file:bg-gray-50 file:text-gray-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
         
        </form>
        <div className="col-span-1 flex justify-center mt-6">
         <button className="w-60 bg-light-primary text-white px-4 py-3 rounded-md hover:bg-accent hover:text-light-text dark:hover:text-light-text font-satisfy transition duration-300 dark:hover:bg-dark-accent hover:bg-light-accent"
            onClick={handleAddChild}
          >
            Save Changes
          </button>
          </div>
      </div>
    </div>
  );
};

export default AddChildModal;
