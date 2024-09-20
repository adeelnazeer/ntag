/* eslint-disable react/prop-types */
import { Button, Chip, Spinner, Typography } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import Img1 from "../assets/images/IMG (1).png";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useState } from "react";
import Pagination from "./pagination";

const Dashboardtable = (props) => {
  const { data, pagination, setPagination, filters, metaData, loading } = props;
  const handlePageChange = (selected) => {
    setPagination((st) => ({ ...st, page: selected }));
  };
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();
  const docStatus = JSON.parse(localStorage.getItem('data'));
  return (
    <div className="rounded-xl shadow pb-7">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold ">
        Corporate Name TAG
      </Typography>
      <div className="flex mb-4 md:p-4 p-2  flex-col-reverse md:flex-row justify-between items-start md:gap-1 gap-4">
        <div className="flex gap-2 mb-4 flex-wrap md:mb-0">
          {filters?.map(single =>
            <Button
              key={single?.id}
              className={`md:py-[8px] md:px-[24px] py-[4px] px-[12px]  border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits === single?.tag_digits ? "bg-secondary text-white" : ""}`}
              variant="outlined"
              onClick={() => setPagination((st) => ({ ...st, tag_digits: single?.tag_digits }))}
            >
              {single?.tag_digits}-Digit
            </Button>
          )}
          <Button
            className={`md:py-[8px] md:px-[24px] py-[4px] px-[12px] border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits === 0 ? "bg-secondary text-white" : ""}`}
            variant="outlined"
            onClick={() => setPagination((st) => ({ ...st, tag_digits: 0 }))}
          >
            More
          </Button>
          {(search || pagination?.tag_digits == 0 || pagination?.tag_digits) &&
            <p
              className={`md:py-[8px] cursor-pointer leading-none font-medium hover:underline md:px-[24px] py-[4px] px-[12px] border-none text-[#1F1F2C]`}
              onClick={() => {
                setPagination({ page: 1 })
                setSearch(null)
              }}
            >
              Reset
            </p>
          }
        </div>

        <div className="flex items-center bg-white rounded-md relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={search || ""}
            onChange={(e) => {
              if (e.target?.value == "") {
                setPagination({ page: 1 })
                setSearch(null)
              } else {
                setSearch(e.target.value)
              }
            }
            }
            className="border rounded bg-white flex-grow outline-none p-2"
          />

          <div
            className="p-2 bg-secondary rounded right-1 cursor-pointer absolute"
            onClick={() => setPagination((st) => ({ ...st, search: search }))}
          >
            <FaSearch className="text-white" />
          </div>
        </div>
      </div>

      {loading ?
        <div className="min-h-44 flex justify-between items-center">
          <Spinner className="h-12 w-12 mx-auto" color="green" />
        </div>
        :
        <div className="px-4">
          {data?.length > 0 ? data?.map((single) => (
            <div key={single?.id} className=" grid  grid-cols-6 sm:col-span-6 justify-between gap-8 p-2 border rounded-xl mt-3 items-center  ">
              <div>
                <img className="rounded w-16 h-16 md:w-auto md:h-auto" src={Img1} alt="north" />
              </div>
              <div>
                <Typography className="  text-center md:text-base text-[13px] md:text-left">
                  {single?.tag_name || ""}
                </Typography></div>
              <div>
                <Typography className="bg-[#EBEBEB] text-center rounded-md px-5 py-1  ">
                  #{single?.tag_no}
                </Typography>
              </div>
              <div>
                <p className="text-[#7A798A] text-[13px]">Current Price</p>
                <p className="text-secondary md:text-[18px] text-[13px] md:w-[240px]   font-bold">
                  {single?.tag_price || ""}{" "}
                  <span className="text-[#7A798A] text-[13px]">+Tax</span>
                </p>
              </div>
              <div className="flex gap-3 mt-4 justify-end md:mt-0  col-span-2">
                {single?.status === 1 &&
                  <div className="flex gap-3">
                    <Button className="bg-[#edf6eb] py-2 px-6 text-secondary">
                      Available
                    </Button>
                    <Button
                      className="bg-secondary md:py-2 py-1 px-6 text-white"
                      onClick={() => navigate(ConstentRoutes.tagDetail, { state: single })}
                    >
                      {docStatus?.doc_approval_status === 0 ? "Reserve  Now " : "Buy Now"}
                    </Button>
                  </div>
                }
                {single?.status === 2 &&
                  // <Button className="bg-[#F9050533] py-2 px-6 text-[#F90505] border border-[#F90505]">
                  //   Already Booked
                  // </Button>
                  <Chip
                    variant="ghost"
                    color="red"
                    size="sm"
                    value="Reserved"

                  />
                }
                {single?.status === 3 &&
                  <Chip
                    variant="ghost"
                    color="red"
                    size="sm"
                    value="Reserved"

                  />
                  // <Button className="bg-[#EBEBEB] py-2 px-6 text-[#000]">
                  //   Reserved
                  // </Button>
                }
              </div>
            </div>
          )) : <p className=" min-h-32 flex justify-center items-center font-medium">No Data to display</p>}
        </div>

        // <div className="overflow-x-auto">
        //   {data?.map((single) => (
        //     <div
        //       className="flex justify-between gap-8 p-2 border rounded-xl mt-3 items-center  "
        //       key={single?.id}
        //     >
        //       <div className="flex gap-16 items-center">
        //         <div className="  ">
        //           <img className="rounded w-16 h-16 md:w-auto md:h-auto" src={Img1} alt="north" />
        //         </div>
        //         <Typography className="  text-center md:text-base text-[13px] md:text-left">
        //           {single?.tag_name || ""}
        //         </Typography>
        //         <Typography className="bg-[#EBEBEB] px-5 py-1  ">
        //           #{single?.tag_no}
        //         </Typography>
        //         <div>
        //           <p className="text-[#7A798A] text-[13px]">Current Price</p>
        //           <p className="text-secondary md:text-[18px] text-[13px] md:w-[240px]   font-bold">
        //             {single?.tag_price || ""}{" "}
        //             <span className="text-[#7A798A] text-[13px]">+Tax</span>
        //           </p>
        //         </div>
        //       </div>
        //       <div className="flex gap-3 mt-4 md:mt-0">
        //         {single?.status === 1 &&
        //           <div className="flex gap-3">
        //             <Button className="bg-[#edf6eb] py-2 px-6 text-secondary">
        //               Available
        //             </Button>
        //             <Button
        //               className="bg-secondary md:py-2 py-1 px-6 text-white"
        //               onClick={() => navigate(ConstentRoutes.tagDetail, { state: single })}
        //             >
        //               {docStatus?.doc_approval_status === 0 ? "Reserve  Now " : "Buy Now"}
        //             </Button>
        //           </div>
        //         }
        //         {single?.status === 2 &&
        //           <Button className="bg-[#F9050533] py-2 px-6 text-[#F90505] border border-[#F90505]">
        //             Already Booked
        //           </Button>
        //         }
        //         {single?.status === 3 &&
        //           <Button className="bg-[#EBEBEB] py-2 px-6 text-[#000]">
        //             Reserved
        //           </Button>
        //         }
        //       </div>
        //     </div>
        //   ))}
        // </div>
      }

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
