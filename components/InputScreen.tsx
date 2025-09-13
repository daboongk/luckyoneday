import React, { useState } from 'react';
import type { UserInfo } from '../types';

interface InputScreenProps {
  onGenerate: (info: UserInfo) => void;
  error: string | null;
}

const InputScreen: React.FC<InputScreenProps> = ({ onGenerate, error }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleNumericInput = (
    setter: React.Dispatch<React.SetStateAction<string>>, 
    maxLength: number,
    maxValue?: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      
      if (value.length > maxLength) {
        value = value.slice(0, maxLength);
      }
      
      if (maxValue && value !== '' && parseInt(value, 10) > maxValue) {
        value = maxValue.toString();
      }

      setter(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!year || !month || !day) {
      setFormError('Please enter your full date of birth.');
      return;
    }
    if (year.length !== 4) {
      setFormError('Year must be 4 digits (e.g., 1990).');
      return;
    }
    const monthNum = parseInt(month, 10);
    if (month.length !== 2 || monthNum < 1 || monthNum > 12) {
      setFormError('Month must be 2 digits (01-12).');
      return;
    }
    const dayNum = parseInt(day, 10);
    if (day.length !== 2 || dayNum < 1 || dayNum > 31) {
        setFormError('Day must be 2 digits (01-31).');
        return;
    }

    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime()) || date.getFullYear() !== parseInt(year, 10) || date.getMonth() + 1 !== monthNum || date.getDate() !== dayNum) {
        setFormError('Please enter a valid date.');
        return;
    }

    const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    onGenerate({ gender, dob });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
        Tell Us About Yourself
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Gender</label>
          <div className="flex justify-around bg-gray-700 rounded-lg p-1">
            {['male', 'female'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g as 'male' | 'female')}
                className={`w-full py-2 rounded-md transition-colors text-sm font-medium focus:outline-none ${
                  gender === g
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="dob-year" className="block text-gray-300 font-semibold mb-2">
            Date of Birth
          </label>
          <div className="flex items-center space-x-2">
             <input
                id="dob-year"
                type="text"
                value={year}
                onChange={handleNumericInput(setYear, 4)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="YYYY"
                required
              />
              <span className="text-gray-400 text-xl">/</span>
              <input
                type="text"
                value={month}
                onChange={handleNumericInput(setMonth, 2, 12)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM"
                required
              />
              <span className="text-gray-400 text-xl">/</span>
              <input
                type="text"
                value={day}
                onChange={handleNumericInput(setDay, 2, 31)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DD"
                required
              />
          </div>
        </div>
        {formError && <p className="text-red-400 text-sm text-center">{formError}</p>}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-blue-600 hover:from-teal-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
        >
          Generate My Fortune
        </button>
      </form>
    </div>
  );
};

export default InputScreen;