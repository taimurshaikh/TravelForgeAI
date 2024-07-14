import { ChangeEvent } from "react";

interface BudgetSelectorProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const BudgetSelector: React.FC<BudgetSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex space-x-4">
      {["$", "$$", "$$$"].map((budget) => (
        <label key={budget} className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio hidden"
            name="budget"
            value={budget}
            checked={value === budget}
            onChange={onChange}
          />
          <span
            className={`text-2xl cursor-pointer ${
              value === budget ? "text-green-500" : "text-gray-300"
            }`}
          >
            {budget}
          </span>
        </label>
      ))}
    </div>
  );
};

export default BudgetSelector;
