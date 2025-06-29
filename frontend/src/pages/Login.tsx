import React, { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/store";
import { IoIosCloseCircle } from "react-icons/io";
import { TbMessages } from "react-icons/tb";
import { GoFileSymlinkFile } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [valid, setValid] = useState({
        email: { status: true, message: "" },
        password: { status: true, message: "" },
    });

    // error animation
    const [isError, setError] = useState({
        status: false,
        message: "",
        divClass: "error",
    });
    const errorRef = useRef<HTMLDivElement>(null);

    //validate
    const errorClass =
        "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-600 block w-full p-2.5 dark:bg-[#2b2b2b] dark:border-red-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500";
    const regularClass =
        "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#2b2b2b] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

    const validate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const formSubmission = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // navigate('/')

        if (formData.email === "") {
            setValid({
                ...valid,
                email: { status: false, message: "Enter your email address!" },
            });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setValid({
                ...valid,
                email: {
                    status: false,
                    message: "Enter a valid email address!",
                },
            });
            return;
        }
        setValid({ ...valid, email: { status: true, message: "" } });

        if (formData.password === "") {
            setValid({
                ...valid,
                password: { status: false, message: "Enter your password!" },
            });
            return;
        } else if (formData.password.length < 8) {
            setValid({
                ...valid,
                password: {
                    status: false,
                    message: "Password should include 8 characters!",
                },
            });
            return;
        }
        setValid({ ...valid, password: { status: true, message: "" } });

        // console.log(formData)
        axios
            .post(`${apiUrl}/api/auth/login`, formData)
            .then((res) => {
                // console.log("login res", res);
                if (res.data.message == "success") {
                    window.localStorage.setItem(
                        "jwt",
                        JSON.stringify(res.data.user)
                    );
                    dispatch(login({ token: null, user: res.data.user }));

                    navigate("/");
                } else {
                    showError(res.data.message);
                }
            })
            .catch((err) => {
                if (err.response.data.message == "User is not existing!!!") {
                    showError("Cannot find the user!, Please sign up");
                    setTimeout(() => {
                        navigate("/signup");
                    }, 3500);
                } else {
                    showError(err.response.data.message || "An Error Occured.");
                }
                console.error(err);
            });
    };

    //show the error
    const showError = (message: string) => {
        setError({
            status: true,
            message,
            divClass: "error",
        });
    };

    useEffect(() => {
        if (errorRef.current) {
            const div = errorRef.current;
            div.style.animation = "errorS 0.5s ease forwards";

            setTimeout(() => {
                div.style.animation = "errorF 0.5s ease forwards";
            }, 3000);

            setTimeout(() => {
                setError((prev) => ({ ...prev, status: false }));
            }, 3500);
        }
    }, [isError]);

    return (
        <>
            {isError.status && (
                <div className="w-full z-30 fixed flex justify-center items-center">
                    <div ref={errorRef} className={isError.divClass}>
                        <IoIosCloseCircle
                            size={35}
                            className="text-red-500 mt-0.5 ml-0.5"
                        />
                        <p>{isError.message}</p>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                <div className="flex bg-gray-50 dark:bg-black flex-col md:flex-1 justify-center items-center gap-3 pt-4 md:pt-2">
                    <div className="flex items-center gap-3">
                        <img
                            src="/icons/logo-small.png"
                            alt="logo"
                            className="w-8 h-8 invert dark:invert-0"
                        />
                        <h1 className="font-bold text-3xl dark:text-[#fff] text-[#000] leading-tight tracking-tight select-none">
                            Convo
                        </h1>
                    </div>
                    <p className="font-semibold text-sm">
                        Sign in to continue using Convo
                    </p>
                    <ul className="hidden md:flex md:mt-8 md:flex-col gap-1.5">
                        <li className="px-10 py-2 rounded-t-2xl text-sm font-semibold bg-white dark:bg-[#1b1b1b] flex items-center gap-2">
                            <TbMessages className="text-[#b0ff62]" size={19} />
                            chat with your friends
                        </li>
                        <li className="px-10 py-2 text-sm font-semibold bg-white dark:bg-[#1b1b1b] flex items-center gap-2">
                            <GoFileSymlinkFile
                                className="text-[#b0ff62]"
                                size={16}
                            />
                            share files
                        </li>
                        <li className="px-10 py-2 rounded-b-2xl text-sm font-semibold bg-white dark:bg-[#1b1b1b] flex items-center gap-2">
                            <MdLockOutline
                                className="text-[#b0ff62]"
                                size={18}
                            />
                            end to end ecrypted
                        </li>
                    </ul>
                </div>
                <section className="bg-gray-50 flex-1/4 dark:bg-black pt-14 md:pt-0">
                    <div className="flex flex-col items-center justify-center md:h-screen px-6 py-8 mx-auto lg:py-0">
                        <div className="w-full bg-white rounded-3xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1b1b1b] dark:border-[#2b2b2b]">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign in to your account
                                </h1>
                                <form
                                    noValidate
                                    className="space-y-4 md:space-y-6"
                                    onSubmit={formSubmission}
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            {valid.email.message ? (
                                                <span className="text-red-500">
                                                    {valid.email.message}
                                                </span>
                                            ) : (
                                                "Your email"
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            onChange={validate}
                                            className={
                                                valid.email.status
                                                    ? regularClass
                                                    : errorClass
                                            }
                                            placeholder="example@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            {valid.password.message ? (
                                                <span className="text-red-500">
                                                    {valid.password.message}
                                                </span>
                                            ) : (
                                                "Your password"
                                            )}
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            onChange={validate}
                                            placeholder="&34@88$#!"
                                            className={
                                                valid.password.status
                                                    ? regularClass
                                                    : errorClass
                                            }
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full text-black bg-[#b0ff62] hover:bg-[#b0ff62] duration-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        Sign In
                                    </button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Don’t have an account yet?{" "}
                                        <Link
                                            to="/signup"
                                            className="font-medium text-black dark:text-[#b0ff62] hover:underline cursor-pointer"
                                        >
                                            Sign up
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Login;
