/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Header from "../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const locatiion = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["faqs"]);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (locatiion?.state?.isIndividual) {
      setData([
        {
          question: t("ind_question1"),
          answer: t("ind_answer1"),
        },
        {
          question: t("ind_question2"),
          answer: t("ind_answer2"),
        },
        {
          question: t("ind_question3"),
          answer: t("ind_answer3"),
        },
        {
          question: t("ind_question4"),
          answer: t("ind_answer4"),
        },
        {
          question: t("ind_question5"),
          answer: t("ind_answer5"),
        },
        {
          question: t("ind_question6"),
          answer: t("ind_answer6"),
        },
        {
          question: t("ind_question7"),
          answer: t("ind_answer7"),
        },
        {
          question: t("ind_question8"),
          answer: t("ind_answer8"),
        },
        {
          question: t("ind_question9"),
          answer: t("ind_answer9"),
        },
        {
          question: t("ind_question10"),
          answer: t("ind_answer10"),
        },
        {
          question: t("ind_question11"),
          answer: t("ind_answer11"),
        },
        {
          question: t("ind_question12"),
          answer: t("ind_answer12"),
        },
        {
          question: t("ind_question13"),
          answer: t("ind_answer13"),
        },
        {
          question: t("ind_question14"),
          answer: t("ind_answer14"),
        },
        {
          question: t("ind_question15"),
          answer: t("ind_answer15"),
        },
        {
          question: t("ind_question16"),
          answer: t("ind_answer16"),
        },
        {
          question: t("ind_question17"),
          answer: t("ind_answer17"),
        },
        {
          question: t("ind_question18"),
          answer: t("ind_answer18"),
        },
        {
          question: t("ind_question19"),
          answer: t("ind_answer19"),
        },
        {
          question: t("ind_question20"),
          answer: t("ind_answer20"),
        },
        {
          question: t("ind_question21"),
          answer: t("ind_answer21"),
        },
        {
          question: t("ind_question22"),
          answer: t("ind_answer22"),
        },
        {
          question: t("ind_question23"),
          answer: t("ind_answer23"),
        },
        {
          question: t("ind_question24"),
          answer: t("ind_answer24"),
        },
        {
          question: t("ind_question25"),
          answer: t("ind_answer25"),
        },
        {
          question: t("ind_question26"),
          answer: t("ind_answer26"),
        },
        {
          question: t("ind_question27"),
          answer: t("ind_answer27"),
        },
        {
          question: t("ind_question28"),
          answer: t("ind_answer28"),
        },
      ]);
    } else {
      setData([
        {
          question: t("question1"),
          answer: t("answer1"),
        },
        {
          question: t("question2"),
          answer: t("answer2"),
        },
        {
          question: t("question3"),
          answer: t("answer3"),
        },
        {
          question: t("question4"),
          answer: t("answer4"),
        },
        {
          question: t("question5"),
          answer: t("answer5"),
        },
        {
          question: t("question6"),
          answer: t("answer6"),
        },
        {
          question: t("question7"),
          answer: t("answer7"),
        },
        {
          question: t("question8"),
          answer: t("answer8"),
        },
        {
          question: t("question9"),
          answer: t("answer9"),
        },
        {
          question: t("question10"),
          answer: t("answer10"),
        },
        {
          question: t("question11"),
          answer: t("answer11"),
        },
        {
          question: t("question12"),
          answer: t("answer12"),
        },
        {
          question: t("question13"),
          answer: t("answer13"),
        },
        {
          question: t("question14"),
          answer: t("answer14"),
        },
        {
          question: t("question15"),
          answer: t("answer15"),
        },
        {
          question: t("question16"),
          answer: t("answer16"),
        },
        {
          question: t("question17"),
          answer: t("answer17"),
        },
        {
          question: t("question18"),
          answer: t("answer18"),
        },
        {
          question: t("question19"),
          answer: t("answer19"),
        },
        {
          question: t("question20"),
          answer: t("answer20"),
        },
        {
          question: t("question21"),
          answer: t("answer21"),
        },
        {
          question: t("question22"),
          answer: t("answer22"),
        },
        {
          question: t("question23"),
          answer: t("answer23"),
        },
        {
          question: t("question24"),
          answer: t("answer24"),
        },
        {
          question: t("question25"),
          answer: t("answer25"),
        },
        {
          question: t("question26"),
          answer: t("answer26"),
        },
        {
          question: t("question27"),
          answer: t("answer27"),
        },
        {
          question: t("question28"),
          answer: t("answer28"),
        },
        {
          question: t("question29"),
          answer: t("answer29"),
        },
        {
          question: t("question30"),
          answer: t("answer30"),
        },
        {
          question: t("question31"),
          answer: t("answer31"),
        },
        {
          question: t("question32"),
          answer: t("answer32"),
        },
        {
          question: t("question33"),
          answer: t("answer33"),
        },
        {
          question: t("question34"),
          answer: t("answer34"),
        },
        {
          question: t("question35"),
          answer: t("answer35"),
        },
        {
          question: t("question36"),
          answer: t("answer36"),
        },
      ]);
    }
  }, [locatiion?.state, t]);

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 my-6 bg-white rounded-lg shadow-md">
        <BiArrowBack
          className=" text-3xl cursor-auto text-secondary font-bold"
          onClick={() => {
            navigate(-1);
          }}
        />

        <h1 className="text-2xl font-bold text-center mb-6 text-secondary">
          {t("faqs")}
        </h1>

        <div className="mt-4">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {locatiion?.state?.isIndividual
                ? t("Individual faqs")
                : t("Corporate faqs")}
            </h2>
            {data.map((faq, index) => (
              <div
                key={index}
                className="mb-3 border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className={`flex justify-between items-center p-4 cursor-pointer ${
                    expandedFaq === index ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleFaq(index)}
                >
                  <Typography className="font-medium text-gray-800">
                    Q{index + 1}: {faq.question}
                  </Typography>
                  <span className="text-secondary">
                    {expandedFaq === index ? "−" : "+"}
                  </span>
                </div>

                {expandedFaq === index && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <Typography className="text-gray-700">
                      {faq.answer}
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
