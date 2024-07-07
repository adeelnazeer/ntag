/* eslint-disable react/prop-types */
import { Button, Spinner, Typography } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import Img1 from "../assets/images/IMG (1).png";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useState } from "react";
import Pagination from "./pagination";

const Dashboardtable = (props) => {
  const { data, pagination, setPagination, metaData, loading } = props;
  const handlePageChange = (selected) => {
    setPagination((st) => ({ ...st, page: selected }));
  };
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded-xl shadow pb-7">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button
            className={`py-[8px] px-[24px] border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 3 ? "bg-secondary text-white" : ""
              }`}
            variant="outlined"
            onClick={() => setPagination((st) => ({ ...st, tag_digits: 3 }))}
          >
            3-Digit
          </Button>
          <Button
            className={`py-[8px] px-[24px] border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 4 ? "bg-secondary text-white" : ""
              }`}
            variant="outlined"
            onClick={() => setPagination((st) => ({ ...st, tag_digits: 4 }))}
          >
            4-Digit
          </Button>
          <Button
            className={`py-[8px] px-[24px] border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 5 ? "bg-secondary text-white" : ""
              }`}
            variant="outlined"
            onClick={() => setPagination((st) => ({ ...st, tag_digits: 5 }))}
          >
            5-Digit
          </Button>
          <Button
            className={`py-[8px] px-[24px] border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 0 ? "bg-secondary text-white" : ""
              }`}
            variant="outlined"
            onClick={() => setPagination((st) => ({ ...st, tag_digits: 0 }))}
          >
            More
          </Button>
        </div>
        <div className="flex items-center bg-white rounded-md relative">
          <input
            type="text"
            placeholder="Search..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className=" border rounded bg-white flex-grow outline-none p-2"
          />
          <div
            className="p-2 bg-secondary rounded right-1 cursor-pointer absolute"
            onClick={() => setPagination((st) => ({ ...st, search: search }))}
          >
            <FaSearch className="text-white " />
          </div>
        </div>
      </div>
      {/* <div className="flex justify-between p-2 border rounded-xl mt-12 items-center">
        <div className="flex gap-8 items-center">
          <div>
            <img className="rounded" src={Img} alt="north" />
          </div>
          <Typography>The North Face</Typography>
          <Typography className="bg-[#EBEBEB] px-5 py-1">#111</Typography>
          <div>
            <p className="text-[#7A798A] text-[13px]">Current Price</p>
            <p className="text-secondary text-[18px] font-bold">
              50,000 <span className="text-[#7A798A] text-[13px]">+Tax</span>
            </p>
          </div>
        </div>
        <div className="">
          <Button className="bg-[#fecdcd]  py-2 px-6 text-[#FC4242]">
            Already Booked
          </Button>
        </div>
      </div> */}
      <>
        {loading ?
          <div className=" min-h-44 flex justify-between items-center">
            <Spinner className=" h-12 w-12 mx-auto" color="green"/>
          </div>
          :
          <>
            {data?.map((single) => (
              <div
                className="flex justify-between p-2 border rounded-xl mt-12 items-center mt-3"
                key={single?.id}
              >
                <div className="flex gap-8 items-center">
                  <div>
                    <img className="rounded" src={Img1} alt="north" />
                  </div>
                  <Typography className="w-[109px]">
                    {single?.tag_name || ""}
                  </Typography>
                  <Typography className="bg-[#EBEBEB] px-5 py-1">
                    #{single?.tag_no}
                  </Typography>
                  <div>
                    <p className="text-[#7A798A] text-[13px]">Current Price</p>
                    <p className="text-secondary text-[18px] font-bold">
                      {single?.tag_price || ""}{" "}
                      <span className="text-[#7A798A] text-[13px]">+Tax</span>
                    </p>
                  </div>
                </div>
                {single?.status == 1 &&
                  <div className="flex gap-3">
                    <Button className="bg-[#edf6eb]  py-2 px-6 text-secondary">
                      Available
                    </Button>
                    <Button
                      className="bg-secondary  py-2 px-6 text-white"
                      onClick={() => navigate(ConstentRoutes.tagDetail, { state: single })}
                    >
                      Buy Now
                    </Button>
                  </div>
                }
                {single?.status == 2 &&
                  <div className="flex gap-3">
                    <Button className="bg-[#F9050533]  py-2 px-6 text-[#F90505] border border-[#F90505]">
                      Already Booked
                    </Button>
                  </div>
                }
                {single?.status == 3 &&
                  <div className="flex gap-3">
                    <Button className="bg-[#EBEBEB]  py-2 px-6 text-[#000]">
                      Reserved
                    </Button>
                  </div>
                }
              </div>
            ))}
          </>
        }
      </>

      <div className="flex justify-center gap-8 mt-4">
        <Pagination
          currentPage={pagination?.page}
          totalPages={Math.ceil(metaData?.total / 10) || 0}
          onPageChange={handlePageChange}
        />

      </div>
    </div>
  );
};

export default Dashboardtable;
