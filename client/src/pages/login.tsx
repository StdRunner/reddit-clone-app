import axios from 'axios';
import Link from 'next/link';
import router from 'next/router';
import React, { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'
import { useAuthDispatch, useAuthState } from '../context/auth';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const {authenticated} = useAuthState();
    const dispatch = useAuthDispatch();

    // 이미 로그인된 사람일 경우 / 페이지로 이동
    if(authenticated) router.push("/");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await axios.post(
                "/auth/login",
                {
                    password,
                    username
                },
                {
                    withCredentials: true
                }
            ); 

            // 정상 로그인 유저정보 Context 저장
            dispatch("LOGIN", res.data?.user);

            // 로그인 후 '/' 로 이동
            router.push('/');

        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data || {})
        }
    };

    return (
        <div className='bg-white'>
            <div className='flex flex-col items-center justify-center h-screen p-6'>
                <div className='w-10/12 mx-auto md:w-96'>
                    <h1 className='mb-2 text-lg font-medium'>로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup 
                            placeholder='Username'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup 
                            placeholder='Password'
                            value={password}
                            type='password'
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <button className={`w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded`}>
                            로그인
                        </button>
                    </form>
                    <small>
                        아직 아이디가 없나요?
                        <Link href="/register">
                            <a className='ml-1 text-blue-500 uppercase'>회원가입</a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Login