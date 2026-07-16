/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Radio, Spinner } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useRecaptchaToken } from "../../../hooks/useRecaptchaToken";

const SEARCH_BY = {
  TAG: "TAG",
  COMPANY: "COMPANY",
};

const LENGTH_LIMITS = {
  [SEARCH_BY.TAG]: { min: 3, max: 8 },
  [SEARCH_BY.COMPANY]: { min: 3, max: 30 },
};

const sanitizeSearchValue = (value, searchBy) => {
  const max = LENGTH_LIMITS[searchBy].max;
  let next = value;
  if (searchBy === SEARCH_BY.TAG) {
    next = next.replace(/[^0-9#]/g, "");
  } else {
    next = next.replace(/[<>]/g, "");
  }
  return next.slice(0, max);
};

const isValidSearchLength = (value, searchBy) => {
  const length = value.trim().length;
  const { min, max } = LENGTH_LIMITS[searchBy];
  return length >= min && length <= max;
};

const normalizeResults = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (typeof data === "object") return [data];
  return [];
};

const getResultTag = (item) => item?.tagname || item?.name_tag || item?.tag || null;
const getResultCompany = (item) =>
  item?.company_name || item?.company || item?.org_name || item?.name || null;

export default function SearchTagModal({ isOpen, onClose }) {
  const { t } = useTranslation("homePage2");
  const { getRecaptchaPayload, isRecaptchaReady } = useRecaptchaToken();
  const [searchBy, setSearchBy] = useState(SEARCH_BY.TAG);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSearchBy(SEARCH_BY.TAG);
    setSearchValue("");
    setResults([]);
    setHasSearched(false);
    setIsSearching(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchByChange = (value) => {
    if (isSearching || value === searchBy) return;
    setSearchBy(value);
    setSearchValue("");
    setResults([]);
    setHasSearched(false);
  };

  const handleSearch = async () => {
    const trimmed = searchValue.trim();
    const { min, max } = LENGTH_LIMITS[searchBy];

    if (!trimmed) {
      toast.error(t("hero.searchModal.required"));
      return;
    }

    if (!isValidSearchLength(trimmed, searchBy)) {
      toast.error(
        t("hero.searchModal.lengthError", {
          min,
          max,
        })
      );
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);

    try {
      const tokens = await getRecaptchaPayload("subscriber_search", { silent: true });
      const params = {
        search_by: searchBy,
        search_value: trimmed,
      };
      if (tokens?.recaptcha_token) {
        params.recaptcha_token = tokens.recaptcha_token;
      }

      const response = await APICall(
        "get",
        params,
        EndPoints.customer.subscriberSearch,
        { "x-no-auth-redirect": "1" }
      );

      if (response?.success) {
        setResults(normalizeResults(response.data));
      } else {
        setResults([]);
        toast.error(response?.message || t("hero.searchModal.error"));
      }
    } catch (error) {
      setResults([]);
      const message =
        typeof error === "string"
          ? error
          : error?.message || t("hero.searchModal.error");
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  };

  const canSearch =
    isValidSearchLength(searchValue, searchBy) && isRecaptchaReady && !isSearching;
  const { min: minLength, max: maxLength } = LENGTH_LIMITS[searchBy];

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black/50 p-3">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white p-5 sm:p-6">
        <button
          type="button"
          className="absolute right-4 top-4 !text-2xl text-gray-400 hover:text-gray-600 disabled:opacity-50"
          onClick={onClose}
          disabled={isSearching}
          aria-label={t("hero.searchModal.close")}
        >
          <IoMdCloseCircle />
        </button>

        <h2 className="pr-8 text-lg font-bold text-brand-blue">
          {t("hero.searchModal.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{t("hero.searchModal.subtitle")}</p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-brand-blue">
            {t("hero.searchModal.searchBy")}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <Radio
                name="search-by"
                ripple={false}
                checked={searchBy === SEARCH_BY.TAG}
                onChange={() => handleSearchByChange(SEARCH_BY.TAG)}
                color="green"
                className="h-4 w-4 border-secondary p-0 hover:before:opacity-0 checked:border-secondary checked:bg-secondary"
                containerProps={{ className: "p-0" }}
                disabled={isSearching}
              />
              <span className="text-sm text-gray-800">{t("hero.searchModal.byTag")}</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <Radio
                name="search-by"
                ripple={false}
                checked={searchBy === SEARCH_BY.COMPANY}
                onChange={() => handleSearchByChange(SEARCH_BY.COMPANY)}
                color="green"
                className="h-4 w-4 border-secondary p-0 hover:before:opacity-0 checked:border-secondary checked:bg-secondary"
                containerProps={{ className: "p-0" }}
                disabled={isSearching}
              />
              <span className="text-sm text-gray-800">{t("hero.searchModal.byCompany")}</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-brand-blue">
            {searchBy === SEARCH_BY.TAG
              ? t("hero.searchModal.tagLabel")
              : t("hero.searchModal.companyLabel")}
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) =>
              setSearchValue(sanitizeSearchValue(e.target.value, searchBy))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (canSearch) handleSearch();
              }
            }}
            placeholder={
              searchBy === SEARCH_BY.TAG
                ? t("hero.searchModal.tagPlaceholder")
                : t("hero.searchModal.companyPlaceholder")
            }
            maxLength={maxLength}
            disabled={isSearching}
            className="w-full rounded-lg border bg-white border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-gray-50"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            {t("hero.searchModal.lengthHint", {
              min: minLength,
              max: maxLength,
              count: searchValue.trim().length,
            })}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSearch}
          disabled={!canSearch}
          className="mt-4 w-full bg-secondary py-2.5 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none disabled:opacity-50"
        >
          {isSearching ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              {t("hero.searchModal.searching")}
            </span>
          ) : (
            t("hero.searchModal.searchButton")
          )}
        </Button>

        {hasSearched && !isSearching ? (
          <div className="mt-5 border-t border-gray-200 pt-4">
            {results.length > 0 ? (
              <ul className="max-h-56 space-y-2 overflow-y-auto">
                {results.map((item, index) => {
                  const tag = getResultTag(item);
                  const company = getResultCompany(item);
                  return (
                    <li
                      key={item?.id ?? tag ?? company ?? index}
                      className="rounded-lg border border-gray-200 px-3 py-2.5"
                    >
                      <p className="text-sm font-semibold text-brand-blue">
                        {tag ? (String(tag).startsWith("#") ? tag : `#${tag}`) : "—"}
                      </p>
                      {company ? (
                        <p className="mt-0.5 text-sm text-gray-600">{company}</p>
                      ) : null}
                      {item?.msisdn ? (
                        <p className="mt-0.5 text-xs text-gray-500">+{item.msisdn}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-3 text-center text-sm text-gray-500">
                {t("hero.searchModal.empty")}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
