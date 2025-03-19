import React, { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../helper";

const Answers = ({ ans, index, totalResult,type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);
  //   console.log(ans, key);
//   console.log(index);
  useEffect(() => {
    // console.log(ans, checkHeading(ans, "useeffect"));
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    }
  }, []);

  return (
    <>
      <>
        {index==0 && totalResult > 1 ? (
          <span className="pt-2 text-xl block text-white">{answer}</span>
        ) : heading ? (
          <span className="pt-2 text-lg block text-white">{answer}</span>
        ) : (
          <span className={type=='q'?'pl-1':'pl-5'}>{answer}</span>
        )}
       
      </>
    </>
  );
};

export default Answers;
