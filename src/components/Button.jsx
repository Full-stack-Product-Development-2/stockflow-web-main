import React from "react";

function Button() {
  return (
    <div>
      <button
        type="button"
        onClick={() => alert("hi")}
        className="border-2 border-solid border-blue-900 bg-gray-400 text-gray-100 px-2 py-1 rounded-md text"
      >
        Submit
      </button>
    </div>
  );
}

export default Button;
