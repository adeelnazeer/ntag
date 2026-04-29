import { useState, } from "react";
import {
  Button,
  Typography,
  Spinner,
  Card,
  IconButton,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../redux/hooks";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import AddNumberModal from "../../../modals/Add-number-modals";
import DeleteConfirmationModal from "../../../modals/Delete-number-modals";
import { formatPhoneNumberCustom } from "../../../utilities/formatMobileNumber";
import { useTranslation } from "react-i18next";
import { useMobileNumbers } from "../../hooks/useMobileNumbers";

const NumberManagement = ({ profileData }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const { t } = useTranslation(["profile"]);

  const reduxUserData = useAppSelector((state) => state.user.userData);
  const userData = profileData || reduxUserData;

  const customerId =
    userData?.parent_id != null && userData?.parent?.customer_account_id
      ? userData.parent.customer_account_id
      : userData?.id;

  const { mobileNumbers: MobileNumbers, loading, refetch } = useMobileNumbers(customerId);

  const handleDeleteNumber = async () => {
    if (!selectedNumber) return;

    try {
      setProcessingAction(true);

      const response = await APICall(
        "delete",
        null,
        `${EndPoints.customer.DeleteNumber(selectedNumber.id)}`
      );

      if (response?.success) {
        toast.success("Mobile number deleted successfully");
        setOpenDeleteDialog(false);
        setSelectedNumber(null);
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete Mobile number");
      }
    } catch (error) {
      console.error("Error deleting Mobile number:", error);
      toast.error("Error deleting Mobile number");
    } finally {
      setProcessingAction(false);
    }
  };
  return (
    <div className="container mx-auto md:p-4">
      <div className="flex justify-between items-center flex-wrap mb-6">
        <Typography className="text-[#1F1F2C] text-md font-bold">
          {t("profile.numberManagement.title")}
        </Typography>
        <div className="flex items-center gap-2">
          <Tooltip content="You can add up to 5 mobile numbers to register additional NameTAG numbers.">
            <div className="flex items-center gap-1 text-gray-600">
              <FaInfoCircle className="h-4 w-4" />
              <Typography variant="small">
                {MobileNumbers?.length}/{t("profile.numberManagement.5")}{" "}
                {t("profile.numberManagement.number")}
              </Typography>
            </div>
          </Tooltip>
          <Button
            size="sm"
            className="bg-secondary flex items-center gap-2"
            onClick={() => {
              if (MobileNumbers?.length >= 5) {
                toast.error(t("profile.numberManagement.maxNumber"));
              } else {
                setOpenAddDialog(true);
              }
            }}
          >
            <FaPlus className="h-4 w-4" />
            <span className="bg-secondary hidden md:flex items-center gap-2">
              {" "}
              {t("profile.numberManagement.addMobNumber")}
            </span>
            <span className="bg-secondary flex md:hidden items-center gap-2">
              {" "}
              {t("profile.numberManagement.addNumber")}
            </span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-44 flex justify-center items-center">
          <Spinner className="h-12 w-12" color="green" />
        </div>
      ) : (
        <div>
          {MobileNumbers?.length === 0 ? (
            <div className="text-center py-8">
              <Typography className="text-gray-600">
                {t("profile.numberManagement.noNumber")}
              </Typography>
            </div>
          ) : (
            <Card className="h-full w-full overflow-auto rounded-md shadow-md">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none"
                      >
                        {t("profile.numberManagement.mobileNumber")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none"
                      >
                        {t("profile.numberManagement.status")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none"
                      >
                        {t("profile.numberManagement.numberType")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none"
                      >
                        {t("profile.numberManagement.action")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MobileNumbers?.map((number, index) => {
                    return (
                      <tr
                        key={number.id || index}
                        className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Typography variant="small" color="blue-gray">
                              {formatPhoneNumberCustom(number?.msisdn)}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4">
                          {number?.tag_status == 1 ? (
                            <div className="w-max">
                              <Chip
                                size="sm"
                                variant="ghost"
                                value={t("profile.numberManagement.mapped")}
                                color="green"
                                className="rounded-full bg-green-100 text-secondary px-2 py-1 text-xs font-medium"
                              />
                            </div>
                          ) : (
                            <div className="w-max">
                              <Chip
                                size="sm"
                                variant="ghost"
                                value={t("profile.numberManagement.available")}
                                color="blue"
                                className="rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium"
                              />
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {number?.mobile_type == "primary" ? (
                            <div className="w-max">
                              <Chip
                                size="sm"
                                variant="ghost"
                                value={t("profile.numberManagement.primary")}
                                color="green"
                                className="rounded-full bg-green-100 text-secondary px-2 py-1 text-xs font-medium"
                              />
                            </div>
                          ) : (
                            <div className="w-max">
                              <Chip
                                size="sm"
                                variant="ghost"
                                value={t("profile.numberManagement.additional")}
                                color="blue"
                                className="rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium"
                              />
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Tooltip
                            content={
                              number?.tag_status == 1 ||
                              number?.mobile_type == "primary"
                                ? t("profile.numberManagement.deleteMsg")
                                : t("profile.numberManagement.delete")
                            }
                          >
                            <IconButton
                              variant="text"
                              color="gray"
                              className="rounded-full"
                              disabled={
                                number?.tag_status == 1 ||
                                number?.mobile_type == "primary"
                              }
                              onClick={() => {
                                setSelectedNumber(number);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <FaTrash className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}

      {/* Add Number Modal */}
      {openAddDialog && (
        <AddNumberModal
          isOpen={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAddNumber={refetch}
          customerId={customerId}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDeleteNumber}
        selectedNumber={selectedNumber}
        processingAction={processingAction}
      />
    </div>
  );
};

export default NumberManagement;
