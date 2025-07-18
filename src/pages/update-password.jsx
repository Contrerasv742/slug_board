import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EditText from '../components/ui/EditText';
import { supabase } from '../supabaseClient';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setMessage('');
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMessage('Password updated successfully!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-global-1 flex flex-col items-center
      justify-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-start w-full mt-4
        sm:mt-6 lg:mt-[16px]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12
          md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-sm">
                    <img
                        src="/images/standing-sammy.png"
                        className="w-full h-full object-contain"
                    />
                </div>
                <h1 className="text-global-4 font-ropa text-lg sm:text-xl md:text-2xl
          lg:text-[28px] lg:leading-[30px] font-normal ml-2 sm:ml-3
          lg:ml-[16px] text-starship-animated">
                    Slug Board
                </h1>
            </div>

            <div className="w-[350px] bg-global-3 rounded-[16px] p-[24px] shadow-lg flex flex-col">
                <div className="text-center mb-[16px]">
                    <h2 className="text-global-1 font-ropa text-[24px] leading-[26px] font-normal mb-[6px]">
                        Update Password
                    </h2>
                    <p className="text-global-3 font-ropa text-[14px] leading-[16px] font-normal px-[20px]">
                        Enter your new password below.
                    </p>
                </div>

                <div className="space-y-[12px] mb-[10px]">
                    <div className="relative">
                        <EditText
                            placeholder="New Password"
                            value={password}
                            onChange={handlePasswordChange}
                            type={showPassword ? "text" : "password"}
                            leftIcon="/images/img_lock.png"
                            className="text-[12px] lg:text-lg py-[12px] px-[12px] pl-[36px] h-[36px]"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-[8px] top-1/2 transform -translate-y-1/2"
                        >
                            <img
                                src="/images/img_invisible.png"
                                alt="toggle password visibility"
                                className="w-[18px] h-[18px]"
                            />
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                {message && <p className="text-green-500 text-center text-sm mb-4">{message}</p>}

                <Button
                    onClick={handleSubmit}
                    variant="primary"
                    size="medium"
                    fullWidth
                    className="mb-[12px] text-[12px] lg:text-xl h-[36px] flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
            </div>
        </div>
    );
};

export default UpdatePassword; 