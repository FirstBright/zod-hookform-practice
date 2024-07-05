import { error } from "console"
import { useForm } from "react-hook-form"

export default function Signin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm()

    const onSubmit = (data: any) => {
        console.log(data)
    }
    const onError = (error: any) => {
        console.log(error)
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div>
                    <label htmlFor='email'>email</label>
                    <input
                        type='email'
                        id='email'
                        {...register("email", {
                            pattern:
                                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                        })}
                    />
                </div>
                <div>
                    <label htmlFor='name'>name</label>
                    <input
                        type='text'
                        id='name'
                        {...register("name", { required: true })}
                    />
                    {errors.name && <p>name is required.</p>}
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        {...register("password", { required: true })}
                    />
                    {errors.password && <p>Password is required.</p>}
                </div>
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input
                        type='password'
                        id='confirmPassword'
                        {...register("confirmPassword", {
                            required: true,
                            validate: (value) => value === watch("password"),
                        })}
                    />
                    {errors.confirmPassword && <p>Passwords must match.</p>}
                </div>
                <div>
                    <label htmlFor='number'>Tel number</label>
                    <input
                        type='number'
                        id='number'
                        {...register("number", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor='age'>age</label>
                    <input
                        type='number'
                        id='age'
                        {...register("age", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor='address'>address</label>
                    <input
                        type='text'
                        id='address'
                        {...register("address", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor='route'></label>
                    <select id='route' {...register("route")}>
                        <option value='search123'>search</option>
                        <option value='ad'>ad</option>
                    </select>
                </div>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}
