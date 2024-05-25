import { Input } from "@headlessui/react";
import UploadBtn from "../../../components/uploadBtn";
import { Typography } from "@material-tailwind/react";

const AccountForm = () => {
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <Typography className="text-[#555] text-base  font-semibold">
          Company Information
        </Typography>
      </div>
      <div>
        <label className="text-base text-[#555]">Company Name</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Company Name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Industry</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">State/Province</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">City</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Specific Address</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div className="text-base text-[#555]">
        <label>Business Registration/TIN Number</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div className="col-span-2 mt-4">
        <UploadBtn />
      </div>
    </div>
    // <div className="grid grid-cols-2 gap-4">
    //   <div>
    //     <label className="text-base text-[#555]">Company Name</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="Company Name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">Industry</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">State/Province</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">City</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">Specific Address</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div className="text-base text-[#555]">
    //     <label>Business Registration/TIN Number</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div className="col-span-2 mt-4">
    //     <UploadBtn />
    //   </div>

    // </div>
  );
};

export default AccountForm;
