import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import "./style/styles.css";

function Home() {
  // Adding states
  const [inputValue, setInputValue] = useState({
    language: "french",
    message: "",
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonId, setButtonId] = useState("button1");

  const handleInputChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (buttonId === "submit") {
      if (!inputValue.message) {
        setError("Please enter text");
        setPrompt("");
        setResult("");
        return;
      }
      setIsLoading(true);

      try {
        setPrompt("");
        const message = inputValue.message;
        const response = await fetch("/api/prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          //console.log(data);

          // setPrompt
          setPrompt(inputValue.message);

          // setResult
          setResult(data.data.choices[0].text);

          //empty input
          setInputValue({ language: "french", message: "" });

          // empty error
          setError("");
        } else {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        setResult("");
        setError("Something went wrong");
      }
    }

    if (buttonId === "translate") {
      if (!inputValue.message) {
        setError("Please enter text");
        setPrompt("");
        setResult("");
        return;
      }
      setIsLoading(true);

      try {
        setPrompt("");
        const { language, message } = inputValue;
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Translate the following prompt into ${language}: ${message}`,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          //console.log(data);

          // setPrompt
          setPrompt(inputValue.message);

          // setResult
          setResult(data.data.choices[0].text);

          //empty input
          setInputValue({ language: "french", message: "" });

          // empty error
          setError("");
        } else {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        setResult("");
        setError("Something went wrong");
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(result)
      .then(() => displayNotification())
      .catch((err) => console.error("failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Text Completion / Translate</h1>

      <form onSubmit={handleSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="french"
            name="language"
            value="french"
            defaultChecked={inputValue.language}
            onChange={handleInputChange}
          />
          <label htmlFor="french">french</label>

          <input
            type="radio"
            id="spanish"
            name="language"
            value="Spanish"
            onChange={handleInputChange}
          />
          <label htmlFor="spanish">Spanish</label>

          <input
            type="radio"
            id="japanese"
            name="language"
            value="Japanese"
            onChange={handleInputChange}
          />
          <label htmlFor="japanese">Japanese</label>

          <input
            type="radio"
            id="german"
            name="language"
            value="german"
            onChange={handleInputChange}
          />
          <label htmlFor="german">German</label>
        </div>
        <textarea
          value={inputValue.message}
          name="message"
          placeholder="Type your message here.."
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <div className="choices">
          <button
            className="btn btn-primary col-3 custom-button"
            onClick={() => setButtonId("translate")}
            type="submit"
          >
            Translate
          </button>
          <button
            className="btn btn-primary col-3 custom-button"
            onClick={() => setButtonId("submit")}
            type="submit"
          >
            Process
          </button>
        </div>
      </form>

      {isLoading ? <div className="prompt">Please wait...</div> : ""}

      {prompt && <div className="prompt">{prompt}</div>}

      {result && (
        <div className="translation">
          <div className="copy-btn" onClick={handleCopy}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </div>
          {isLoading ? <BeatLoader size={12} color={"red"} /> : result}
        </div>
      )}

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
}

export default Home;
