import { Controller, useForm } from "react-hook-form";
import { MultiStepFormProfile } from "./components/stepper";
import { useState } from "react";

const ProfilePage = () => {
  const [data, setData] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValues,
    control,
    formState: { errors },
  } = useForm();
  return (
    <div className="flex flex-col overflow-auto">
      <MultiStepFormProfile watch={watch} register={register} errors={errors}
        setValue={setValues}
        getValues={getValues} Controller={Controller} control={control}
        setData={setData}
        data={data}
      />
    </div>
  );
};
export default ProfilePage;
