import React, { useState, useEffect } from 'react';
import { FaUser, FaBirthdayCake, FaGenderless, FaImage, FaUserCircle, FaKey, FaTimes, FaEdit, FaSpinner } from 'react-icons/fa';
import CustomSelect from '../../CustomSelect';
import { Child } from '@/types/interface';
import { apiUpdateChild } from '@/lib/apiHelper';

interface ProfileModalProps {
  child: Child;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ child, isOpen, onClose }) => {
  const [updatedChild, setUpdatedChild] = useState<Child>({ ...child });
  const [updateStatus, setUpdateStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUpdatedChild({ ...child });
  }, [child]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("submit")
    const response = await apiUpdateChild(child.id, updatedChild);
  
    console.log("response", response)
    if(response){
      setIsLoading(false);
      onClose()
    }

    else
       setUpdateStatus({success: false, message: "Updating Data failed"});
  };


  const handeChildChange = (field: keyof Child, value: string) => {
    setUpdatedChild((prev) => ({
      ...prev,
      [field]: field === 'age' ? parseInt(value, 10) : value,
    }));
  };


  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center font-stix justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-full max-w-[90vw] max-h-[97vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaEdit className="text-3xl mr-3" />
            <h2 className="text-xl font-stix">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
          {/* Name Input */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaUser className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Name</h3>
              <input
                type="text"
                value={updatedChild.name}
                onChange={(e) => handeChildChange('name', e.target.value)}
                className="w-full border rounded-md p-3 bg-dark-text text-gray-800 focus:border-light-primary dark:focus:border-dark-primary focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          {/* Age Input */}
          <div className="bg-gradient-to-r from-green-400 via-blue-500 to-teal-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaBirthdayCake className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Age</h3>
              <input
                type="number"
                value={updatedChild.age}
                onChange={(e) => handeChildChange('age', e.target.value)}
                className="w-full border rounded-md p-3 bg-dark-text text-gray-800 focus:border-light-primary dark:focus:border-dark-primary no-spinner focus:outline-none"
                placeholder="Enter your age"
                required
              />
            </div>
          </div>

          {/* Gender Select */}
          <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-orange-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaGenderless className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Gender</h3>
              <CustomSelect
                value={updatedChild.gender}
                onChange={(value) => handeChildChange('gender', value)}
                classname="bg-light-background py-3 dark:bg-light-background outline-none border-none text-light-text dark:text-light-text hover:text-dark-text dark:hover:text-dark-text"
              />
            </div>
          </div>

          {/* Profile Picture Input */}
          <div className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaImage className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Profile Picture</h3>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handeChildChange('icon', event.target?.result as string);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="w-full text-sm text-gray-700 file:py-2 file:px-4 file:border file:border-transparent file:rounded-md file:bg-gray-50 file:text-gray-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* email Input */}
          <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaUserCircle className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Email</h3>
              <input
                type="text"
                value={updatedChild.email? updatedChild.email : ""}
                onChange={(e) => handeChildChange('email', e.target.value)}
                className="w-full border rounded-md p-3 bg-dark-text text-gray-800 focus:border-light-primary dark:focus:border-dark-primary focus:outline-none"
                placeholder="Enter Email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <FaKey className="text-3xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-satisfy mb-2">Password</h3>
              <input
                type="password"
                value={updatedChild.password}
                onChange={(e) => handeChildChange('password', e.target.value)}
                className="w-full border rounded-md p-3 bg-dark-text text-gray-800 focus:border-light-primary dark:focus:border-dark-primary focus:outline-none"
                placeholder="Enter your new password"
                required
              />
            </div>
          </div>
        </form>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="flex flex-row items-center justify-center w-full bg-light-primary text-white px-4 py-3 rounded-md hover:bg-accent font-satisfy transition duration-300 dark:hover:bg-dark-accent hover:bg-light-accent"
            onClick={handleSubmit}
          > 
             <FaEdit className="mr-2 mb-1" /> { isLoading?   <FaSpinner className="animate-spin" /> :  "Save Changes"}
          </button>
        </div>
        {updateStatus && (
            <div className="flex justify-center w-full mt-4">
                <p className={`text-center ${updateStatus.success ? 'text-light-primary' : 'text-light-accent dark:text-dark-accent'}`}>{updateStatus.message}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
