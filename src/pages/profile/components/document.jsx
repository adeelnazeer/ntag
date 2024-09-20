import { Input } from "@material-tailwind/react";

const DocumentInfo = ({ errors, register }) => {
  return (
    <>
      <div className="mt-10 grid max-w-3xl mx-auto grid-cols-1 gap-6">
        <div className="flex gap-4">
          <label className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer">
            Upload
            <input
              type="file"
              id="uploadFile1"
              className="hidden"
              // onChange={handleChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
          <div>
            <p>Upload Documents</p>
            <p className="text-base font-semibold text-[#55555566]">
              Business/Investment/Work Permit License and business
              registration/TIN
            </p>
            <p className="mt-1 text-sm text-[#555]">
              Only jpg/jpeg/png/pdf files can be uploaded, and the size does not
              exceed 2MB
            </p>
            {/* {fileName && <p className="mt-1 text-sm text-green-500">{fileName}</p>}
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>} */}
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <button className=" bg-secondary text-white font-medium px-10 py-3">
          Update Document
        </button>
      </div>
    </>
  );
};

export default DocumentInfo;
