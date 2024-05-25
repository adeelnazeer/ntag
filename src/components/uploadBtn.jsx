const UploadBtn = () => {
  return (
    <div className="flex gap-4">
      <label className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer ">
        Upload
        <input type="file" id="uploadFile1" className="hidden" />
      </label>
      <div>
        <p className="text-base font-semibold text-[#55555566]">
          Business/Investment/Work Permit License and business registration/TIN{" "}
        </p>
        <p className="mt-1 text-sm text-[#555]">
          Only jpg/jpeg/png/pdf files can be uploaded, and the size does not
          exceed 2MB
        </p>
      </div>
    </div>
  );
};

export default UploadBtn;
