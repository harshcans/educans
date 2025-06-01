import React, { useState } from 'react';

// Define content and scores outside the component to prevent re-creation on every render
const stepContents = {
    1: "This is the content for Step 1. Begin your process here!",
    2: "You've successfully completed Step 1! Now, proceed with the tasks for Step 2.",
    3: "Fantastic progress! You are now on Step 3, the final stage."
};

const stepScores = {
    1: 100,
    2: 250,
    3: 500
};

function AddQuestionForm() {
    // State to keep track of the currently active step
    const [currentStep, setCurrentStep] = useState(1);

    /**
     * Handles navigation to the next step.
     * Increments currentStep if not already on the last step.
     */
    const handleNext = () => {
        setCurrentStep(prevStep => Math.min(prevStep + 1, 3)); // Max step is 3
    };

    /**
     * Handles navigation to the previous step.
     * Decrements currentStep if not already on the first step.
     */
    const handlePrevious = () => {
        setCurrentStep(prevStep => Math.max(prevStep - 1, 1)); // Min step is 1
    };

    return (
        // Main container for the step-by-step page
        <div className="container bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl flex flex-col items-center">

            {/* Steps Header Section: Displays the step navigation (no click) */}
            <div id="stepsHeader" className="flex justify-between w-full mb-8 relative">
                {/* Map over an array to create each step item dynamically */}
                {[1, 2, 3].map((stepNum) => (
                    <div
                        key={stepNum} // Unique key for each list item in React
                        // Dynamically apply CSS classes based on the current step
                        className={`
                            step-item relative flex-1 text-center py-3 px-2 font-semibold
                            ${stepNum === 1 && currentStep === 1 ? 'active text-blue-600' : ''} /* Underline ONLY for Step 1 when it's active */
                            ${stepNum < currentStep ? 'completed-underline text-gray-600' : 'text-gray-600'} /* Completed step styling */
                            transition-colors duration-300
                        `}
                        data-step={stepNum} // Custom data attribute for step number
                        // onClick removed to disable clicking on step headers
                    >
                        Step {stepNum}
                        {/* "DONE" label, visible only for completed steps */}
                        <span className={`step-done-label ${stepNum < currentStep ? 'opacity-100' : 'opacity-0'}`}>
                            (DONE)
                        </span>
                    </div>
                ))}
            </div>

            {/* Content Area: Displays content specific to the current step */}
            <div id="contentArea" className="w-full min-h-[150px] bg-blue-100 text-blue-800 p-6 rounded-lg flex items-center justify-center text-lg text-center border border-blue-200">
                {stepContents[currentStep]} {/* Display content based on currentStep */}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full mt-6 space-x-4">
                <button
                    className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
                    onClick={handlePrevious}
                    disabled={currentStep === 1} // Disable if on Step 1
                >
                    Previous
                </button>
                <button
                    className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
                    onClick={handleNext}
                    disabled={currentStep === 3} // Disable if on Step 3
                >
                    Next
                </button>
            </div>

            {/* Score Display: Shows the score for the current step */}
            <div className="score-display mt-8 text-xl font-bold text-gray-700">
                Current Score: <span id="scoreValue" className="text-blue-600 text-3xl ml-2">{stepScores[currentStep]}</span>
            </div>
        </div>
    );
}

export default AddQuestionForm;
