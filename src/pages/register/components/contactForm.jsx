import { Input } from "@headlessui/react";
import { Typography } from "@material-tailwind/react";

const ContactForm = () => {
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <Typography className="text-[#555] text-base  font-semibold">
          Contact Information
        </Typography>
      </div>
      <div>
        <label className="text-base text-[#555]">First Name</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="First Name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Last Name</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Last Name"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">City</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="City"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Specific Address</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Specific Address"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">
          Business Registration/TIN Number
        </label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Business Registration/TIN Number"
          style={{ border: "1px solid #8A8AA033" }}
        />
      </div>
    </div>
  );
};

export default ContactForm;
