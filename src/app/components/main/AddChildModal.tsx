import React, { useState } from 'react';
import { FaUser, FaBirthdayCake, FaGenderless, FaImage, FaPlus, FaTimes, FaUserPlus } from 'react-icons/fa';
import CustomSelect from '../CustomSelect';
import LoadingButton from '../LoadingButton';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({ isOpen, onClose }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, age, gender, image });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto task-menu">
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
          {/* Name Card */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaUser className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Name</h3>
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
              <h3 className="text-lg font-semibold mb-2">Age</h3>
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
              <h3 className="text-lg font-semibold mb-2">Gender</h3>
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
              <h3 className="text-lg font-semibold mb-2">Image</h3>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-700 file:py-2 file:px-4 file:border file:border-transparent file:rounded-md file:bg-gray-50 file:text-gray-700 cursor-pointer"
                />
                <span className="absolute top-0 right-0 mt-2 text-gray-600 dark:text-gray-400 text-sm">No file has been selected</span>
              </div>
            </div>
          </div>
          {/* Submit Button Card */}
          <div className="col-span-1 flex justify-center mt-6">
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              buttonText="Add Child"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
