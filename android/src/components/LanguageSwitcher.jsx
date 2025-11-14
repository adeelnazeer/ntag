/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Button, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
// import { Check, Globe2 } from "lucide-react"; // optional: lucide-react for icons
import { useTranslation } from "react-i18next";

const LANGS = [
    { code: "en", label: "English", native: "English", flag: "🇬🇧" },
    { code: "amET", label: "Amharic", native: "Amharic", flag: "et" },

];

// languages that should be RTL
const RTL = new Set(["ar", "fa", "ur", "he"]);

function applyDir(lang) {
    const dir = RTL.has(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
}

export default function LanguageSwitcher({ className = "" }) {
    const { i18n } = useTranslation();
    const current = LANGS.find(l => l.code === i18n.resolvedLanguage) || LANGS[0];

    useEffect(() => {
        applyDir(i18n.resolvedLanguage);
    }, [i18n.resolvedLanguage]);

    const change = (code) => {
        i18n.changeLanguage(code);
        // if you want an explicit cache (in addition to detector):
        try { localStorage.setItem("i18nextLng", code); } catch { }
    };

    return (
        <div className={`inline-flex ${className}`}>
            <Menu placement="bottom-end">
                <MenuHandler>
                    <Button
                        variant="outlined"
                        className="bg-white text-secondary border-gray-200 flex items-center gap-2 py-1.5 px-3   shadow-sm hover:shadow transition"
                    >
                        {/* <Globe2 size={16} className="opacity-70" /> */}
                        {/* <span className="text-sm">{current.flag}</span> */}
                        <span className="text-sm font-medium">{current.native}</span>
                    </Button>
                </MenuHandler>

                <MenuList className="p-2 min-w-[180px]">
                    {LANGS.map((l) => {
                        const active = l.code === i18n.resolvedLanguage;
                        return (
                            <MenuItem
                                key={l.code}
                                onClick={() => change(l.code)}
                                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 ${active ? "bg-gray-50" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="leading-tight">
                                        <div className="text-sm font-medium">{l.native}</div>
                                    </div>
                                </div>
                                {/* {active && <Check size={16} className="text-emerald-600" />} */}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
        </div>
    );
}
