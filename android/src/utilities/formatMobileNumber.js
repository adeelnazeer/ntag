import React from 'react'

 export const   formatPhoneNumberCustom = (phoneNumber) => {
    if (!phoneNumber) return "";
    
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    if (digitsOnly.startsWith('251') && digitsOnly.length >= 12) {
      return `+251 ${digitsOnly.substring(3, 4)}${digitsOnly.substring(4)}`;
    } else if (digitsOnly.startsWith('09') && digitsOnly.length >= 10) {
      return `+251 ${digitsOnly.substring(1)}`;
    } else if (digitsOnly.startsWith('9') && digitsOnly.length >= 9) {
      return `+251 ${digitsOnly}`;
    }
    
    return `+${digitsOnly}`;
  };

