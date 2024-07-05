import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import Modal from "react-modal"

const schema = z
    .object({
        email: z
            .string()
            .email({ message: "유효한 이메일이 아닙니다." })
            .min(10, {
                message: "너무 짧은 이메일입니다. 10자 이상으로 해주세요.",
            })
            .max(30, {
                message: "너무 긴 이메일입니다. 30자 이하로 해주세요.",
            }),
        name: z.string().min(1, "이름 필수입니다."),
        password: z
            .string()
            .min(8, { message: "비밀번호 8자 이상으로 해주세요." }),
        checkPassword: z
            .string()
            .min(8, { message: "비밀번호 8자 이상으로 해주세요." }),
        phone: z
            .string()
            .regex(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, {
                message: "유효한 번호가 아닙니다.",
            }),
        age: z
            .number()
            .min(10, { message: "10살 미만은 가입할 수 없어요." })
            .max(70, { message: "70세 이하만 가입할 수 있어요." }),
        address: z.string().min(1, { message: "주소 필수입니다." }),
        route: z.string().min(1, { message: "경로 필수입니다." }),
        introduce: z.string().min(1, { message: "본인을 소개해주세요" }),
    })
    .superRefine(({ checkPassword, password }, ctx) => {
        if (checkPassword !== password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "비밀번호가 일치하지 않습니다.",
                path: ["checkPassword"],
            })
        }
    })

type SchemaType = z.infer<typeof schema>

export default function ZodHookFormPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [phoneModalOpen, setPhoneModalOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [formData, setFormData] = useState<SchemaType | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SchemaType>({
        resolver: zodResolver(schema),
    })

    const handleSuccess = (data: SchemaType) => {
        setFormData(data)
        console.log(data)
        setIsModalOpen(true)
    }

    const handleNumberClick = (number: string) => {
        setPhoneNumber((prev) => {
            const newNumber = prev + number
            setValue("phone", newNumber) // Update the form value
            return newNumber
        })
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <form
                onSubmit={handleSubmit(handleSuccess)}
                className='w-full max-w-lg p-6 bg-white rounded-lg shadow-md flex flex-col gap-4'
            >
                <h2 className='text-2xl font-semibold text-gray-700 flex flex-col gap-1'>
                    회원가입
                </h2>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700'
                    >
                        이메일
                    </label>
                    <input
                        type='email'
                        id='email'
                        {...register("email")}
                        placeholder='id@example.com'
                        className='block w-full px-4 py-2  text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    />
                    {errors.email?.message && (
                        <span className='text-sm text-red-600'>
                            {errors.email.message.toString()}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700'
                    >
                        이름
                    </label>
                    <input
                        id='name'
                        {...register("name")}
                        placeholder='이름을 작성해 주세요'
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    />
                    {errors.name?.message && (
                        <span className='text-sm text-red-600'>
                            {errors.name.message.toString()}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-700'
                    >
                        비밀번호
                    </label>
                    <input
                        type='password'
                        id='password'
                        {...register("password")}
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    />

                    {errors.password?.message && (
                        <span className='text-sm text-red-600'>
                            {errors.password.message.toString()}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='passwordCheck'
                        className='block text-sm font-medium text-gray-700'
                    >
                        비밀번호 확인
                    </label>
                    <input
                        type='password'
                        id='passwordCheck'
                        {...register("checkPassword")}
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    />
                    {errors.checkPassword?.message && (
                        <span className='text-sm text-red-600'>
                            {errors.checkPassword.message.toString()}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='phone'
                        className='block text-sm font-medium text-gray-700'
                    >
                        전화번호
                    </label>
                    <button
                        type='button'
                        onClick={() => setPhoneModalOpen(true)}
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    >
                        전화번호 입력
                    </button>
                    <Modal
                        isOpen={phoneModalOpen}
                        contentLabel='Phone Number Modal'
                        className='w-40 '
                    >
                        <div className='keypad grid grid-cols-3 gap-2'>
                            {Array.from({ length: 10 }, (_, i) => (
                                <button
                                    className='h-10 px-5 bg-slate-200'
                                    key={i === 9 ? "0" : i + 1}
                                    onClick={() =>
                                        handleNumberClick(
                                            i === 9 ? "0" : (i + 1).toString()
                                        )
                                    }
                                >
                                    {i === 9 ? "0" : i + 1}
                                </button>
                            ))}
                        </div>
                        <form className='flex flex-col mt-4'>
                            <input
                                type='text'
                                value={phoneNumber}
                                readOnly
                                className='block w-full px-4 py-2 mb-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                            />                           

                            <div className='flex justify-between mt-2'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setPhoneNumber("")
                                    }}
                                    className='px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700'
                                >
                                    삭제
                                </button>
                                <button
                                    type='submit'
                                    {...register("phone")}
                                    onClick={() => {
                                        setPhoneModalOpen(false)
                                    }}
                                    className='px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'
                                >
                                    확인
                                </button>
                            </div>
                        </form>
                    </Modal>
                    {errors.age?.message && (
                    <span className='text-sm text-red-600'>
                        {errors.age.message.toString()}
                    </span>
                )}
                </div>
                
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='age'
                        className='block text-sm font-medium text-gray-700'
                    >
                        나이
                    </label>
                    <input
                        type='number'
                        id='age'
                        {...register("age", { valueAsNumber: true })}
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='address'
                        className='block text-sm font-medium text-gray-700'
                    >
                        주소
                    </label>
                    <input
                        type='text'
                        id='address'
                        {...register("address")}
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    />
                    {errors.address?.message && (
                        <span className='text-sm text-red-600'>
                            {errors.address.message.toString()}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-1'>
                    <label
                        htmlFor='route'
                        className='block text-sm font-medium text-gray-700'
                    >
                        가입 경로
                    </label>
                    <select
                        id='route'
                        {...register("route")}
                        className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
                    >
                        <option value=''>선택하세요</option>
                        <option value='AD'>광고</option>
                        <option value='friend'>지인</option>
                        <option value='search'>검색</option>
                    </select>
                    {errors.route?.message && (
                        <span className='text-sm text-red-600'>
                            {errors.route.message.toString()}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-1 h-full'>
                    <label htmlFor='introduce'>자기소개</label>
                    <textarea
                        id='introduce'
                        rows={10}
                        style={{ minHeight: "100px" }}
                        className='block w-full h-5 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300'
                        {...register("introduce")}
                    ></textarea>
                </div>
                <button
                    type='submit'
                    className='w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
                >
                    제출
                </button>
                <Modal isOpen={isModalOpen} contentLabel='Modal'>
                    <div className='flex flex-col gap-20'>
                        <h2>{formData?.name}님 환영합니다.</h2>
                        <button onClick={() => setIsModalOpen(false)}>
                            확인
                        </button>
                    </div>
                </Modal>
            </form>
        </div>
    )
}
