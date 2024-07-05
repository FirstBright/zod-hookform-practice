import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Span } from "next/dist/trace"

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
        name: z.string().min(1, { message: "이름 필수입니다." }),
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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SchemaType>({
        resolver: zodResolver(schema),
    })
    const handleSuccess = (data: SchemaType) => {
        console.log("", data)
    }

    return (
        <div className='flex flex-col bg-sky-200'>
            <form onSubmit={handleSubmit(handleSuccess)}>
                <div>
                    <label htmlFor='email'>이메일</label>
                    <input
                        type='email'
                        id='email'
                        {...register("email")}
                        placeholder='id@example.com'
                    />
                    {errors.email?.message && (
                        <span>{errors.email.message.toString()}</span>
                    )}
                </div>
                <div>
                    <label htmlFor='name'>이름</label>
                    <input
                        id='name'
                        {...register("name")}
                        placeholder='이름을 작성해 주세요'
                    />
                    {errors.name?.message && (
                        <span>{errors.name.message.toString()}</span>
                    )}
                </div>
                <div>
                    <label htmlFor='password'>비밀번호</label>
                    <input
                        type='password'
                        id='password'
                        {...register("password")}
                    />
                    {errors.password?.message && (
                        <span>{errors.password?.message}</span>
                    )}
                </div>
                <div>
                    <label htmlFor='passwordCheck'>비밀번호확인</label>
                    <input
                        type='password'
                        id='passwordCheck'
                        {...register("checkPassword")}
                    />
                    {errors.checkPassword?.message && (
                        <span>{errors.checkPassword?.message}</span>
                    )}
                </div>
                <div>
                    <label htmlFor='phone'>전화번호</label>
                    <input
                        type='string'
                        id='phone'
                        {...register("phone")}
                        placeholder='000-000-0000'
                    />
                    {errors.phone?.message && (
                        <span>{errors.phone.message}</span>
                    )}
                </div>
                <div>
                    <label htmlFor='age'>나이</label>
                    <input
                        type='number'
                        id='age'
                        {...register("age", { valueAsNumber: true })}
                    />
                    {errors.age?.message && <span>{errors.age.message}</span>}
                </div>
                <div>
                    <label htmlFor='address'>주소</label>
                    <input type='text' id='address' {...register("address")} />
                    {errors.address?.message && (
                        <span>{errors.address.message}</span>
                    )}
                </div>
                <div>
                    <label htmlFor='route'>가입경로</label>
                    <select id='route' {...register("route")}>
                        <option value=''></option>
                        <option value='AD'>광고</option>
                        <option value='friend'>지인</option>
                        <option value='search'>검색</option>
                    </select>
                    {errors.route?.message && (
                        <span>{errors.route.message}</span>
                    )}
                </div>

                <input type='submit' />
            </form>
        </div>
    )
}
