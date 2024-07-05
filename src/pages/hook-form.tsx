import { useForm } from "react-hook-form"

export default function HookFormPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    return (
        <form onSubmit={handleSubmit((data) => console.log(data))}>
            <input
                {...register("firstName")}
                className='border-2 border-black m-4'
            />
            <input
                {...register("lastName", { required: true })}
                className='border-2 border-black m-4'
            />
            {errors.lastName && <p>Last name is required.</p>}
            <input
                {...register("age", { pattern: /\d+/, max: 99, min: 19 })}
                className='border-2 border-black m-4'
            />
            {errors.age && <p>Please enter number for age.</p>}
            <input type='submit' className='border-2 border-black m-4' />
        </form>
    )
}
