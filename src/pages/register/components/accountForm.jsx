import { Input, Label } from "@headlessui/react";

const AccountForm = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-base text-[#555]">User Name</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User Name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Password</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Password"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Confirm Password</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Confirm Password"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Phone Number</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Phone Number"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Verification Code</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Verification Code"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Email</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Email"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
    </div>
  );
};

export default AccountForm;
