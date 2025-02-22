import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [verificationData, setVerificationData] = useState(null);
  const navigate = useNavigate();

  const TEST_USERS = [
    {
      phoneNumber: "09121234567",
      password: "27231",
      name: "مدیر سیستم",
      personalCode: "100001",
      role: "doctor",
    },
  ];

  const register = async (formData) => {
    try {

      const isPhoneTaken = TEST_USERS.some(user =>
          user.phoneNumber === formData.phoneNumber
      );

      if (isPhoneTaken) {
        throw new Error('این شماره تلفن قبلاً ثبت شده است');
      }

       const response = await axios.post('https://hospital.liara.run/api/register/send-code', {
         phoneNumber: formData.phoneNumber
       });


      setVerificationData({
        ...formData,
        verificationCode: "123456"
      });

      return true;

    } catch (error) {
      throw new Error(error.message || 'خطا در ثبت‌نام');
    }
  };

  const verifyCode = async (code) => {
    try {
      if (!verificationData) {
        throw new Error('اطلاعات ثبت‌نام یافت نشد');
      }

      if (code !== verificationData.verificationCode) {
        throw new Error('کد تایید نامعتبر است');
      }


      const newUser = {
        phoneNumber: verificationData.phoneNumber,
        password: verificationData.password,
        name: verificationData.fullName,
        personalCode: String(Date.now()).slice(-6),
        role: "doctor",
        permissions: ["view_shifts", "edit_profile"],
      };

       const response = await axios.post('https://hospital.liara.run/api/register/verify', {
         ...verificationData,
         code
       });

      // const newUser = response.data;

     // setUser(newUser);
     // localStorage.setItem('user', JSON.stringify(newUser));
     // setVerificationData(null);
     // navigate('/dashboard');

      return true;

    } catch (error) {
      throw new Error(error.message || 'خطا در تایید کد');
    }
  };

  const login = async (credentials) => {
    try {
      const testUser = TEST_USERS.find(user =>
          user.phoneNumber === credentials.phoneNumber &&
          user.password === credentials.password
      );

      if (testUser) {
        const userData = {
          ...testUser,
          isLoggedIn: true
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
        return;
      }

       const response = await axios.post('https://hospital.liara.run/api/login', credentials);
       setUser(response.data);
       localStorage.setItem('user', JSON.stringify(response.data));
       navigate('/dashboard');

      throw new Error('نام کاربری یا رمز عبور اشتباه است');

    } catch (error) {
      throw new Error(error.message || 'خطا در ورود به سیستم');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
      <AuthContext.Provider value={{
        user,
        login,
        logout,
        register,
        verifyCode,
        hasPermission: (permission) => user?.permissions?.includes(permission) || false,
        isAdmin: user?.role === 'admin',
        isDoctor: user?.role === 'doctor'
      }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;