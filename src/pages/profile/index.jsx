import { useForm } from "react-hook-form";
import { MultiStepFormProfile } from "./components/stepper";

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <div className="flex flex-col overflow-auto">
      <MultiStepFormProfile watch={watch} register={register} errors={errors} />
    </div>
  );
};
export default ProfilePage;
