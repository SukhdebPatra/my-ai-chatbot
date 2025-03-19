import { useState } from "react";

import "./App.css";
import { URL } from "./Constent/Constents";
import Answers from "./Components/Answers";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(() => {
    // localStorage.getItem("history")
    // []
    const storedHistory = localStorage.getItem("history");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const handleAskQuestion = async () => {
    if (localStorage.getItem("history")) {
      let history = JSON.parse(localStorage.getItem("history"));
      history = [question, ...history]; // Add the new question to the history
      localStorage.setItem("history", JSON.stringify(history)); // Save back to localStorage
      setRecentHistory(history); // Update the state
    } else {
      const newHistory = [question];
      localStorage.setItem("history", JSON.stringify(newHistory));
      setRecentHistory(newHistory);
    }

    const payload = {
      contents: [
        {
          parts: [{ text: question }],
        },
      ],
    };

    // console.log(question);
    let response = await fetch(
      URL + "AIzaSyDlze7xg7gNF7GLepbstN68RmdK0Tay9oc",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());
    // console.log(dataString);
    // setResult(response.candidates[0].content.parts[0].text);
    // setResult([question,dataString]);
    setResult([
      ...result,
      { type: "q", text: question },
      { type: "a", text: dataString },
    ]);
    console.log(recentHistory);
    setQuestion("");
  };

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
    setQuestion("");
  };

  const handleKeyPress = (e) => {
    // Trigger search on pressing "Enter"
    if (e.key === "Enter") {
      handleAskQuestion();
      setQuestion("");
    }
  };
  return (
    <>
   <div className="grid grid-cols-1 md:grid-cols-5 h-screen text-center">
  {/* Sidebar (Recent Search) */}
  <div className="col-span-1 bg-zinc-800 p-4 md:block hidden">
    <h1 className="text-xl text-white pt-3 flex justify-center">
      <span>Recent Search</span>
      <button onClick={clearHistory} className="cursor-pointer mt-1 ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
          <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
        </svg>
      </button>
    </h1>
    <ul className="text-left overflow-auto mt-2">
      {Array.isArray(recentHistory) && recentHistory.map((item, index) => (
        <li className="px-5 pl-5 text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200 truncate" key={index}>
          {item}
        </li>
      ))}
    </ul>
  </div>

  {/* Main Content */}
  <div className="col-span-1 md:col-span-4 p-4 md:p-10">
    <div className="container text-zinc-200 max-h-[80vh] pb-20 overflow-auto">
      <ul>
        {result.map((item, index) => (
          <div key={index + Math.random()} className={item.type == "q" ? "flex justify-end" : ""}>
            {item.type == "q" ? (
              <li key={index + Math.random()} className="text-right p-1 border border-6 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit">
                <Answers ans={item.text} totalResult={1} index={index} type={item.type} />
              </li>
            ) : (
              item.text.map((ansItem, ansIndex) => (
                <li key={ansIndex + Math.random()} className="text-left p-1">
                  <Answers ans={ansItem} index={ansIndex} totalResult={item.length} type={item.type} />
                </li>
              ))
            )}
          </div>
        ))}
      </ul>
    </div>
    
    {/* Bottom Search Bar */}
    <div className="bg-zinc-800 w-full md:w-1/2 m-auto text-white rounded-2xl flex border border-zinc-700 p-1 h-16 pr-5 fixed bottom-5 left-1/2 transform -translate-x-1/2">
      <input
        type="text"
        className="w-full h-full outline-none justify-center bg-zinc-800 p-3"
        placeholder="Ask Anything"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleAskQuestion}>Ask</button>
    </div>
  </div>
</div>

    </>
  );
}

export default App;
