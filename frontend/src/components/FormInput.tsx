import type { FormInputProps } from "@/types/formTypes";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  rows,
  options,
  placeholder,
  min,
  max,
  error,
  showErrorIcon = true,
  icon,
}: FormInputProps) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>

    <div className="relative">
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 ${
            error
              ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          } placeholder-gray-400`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 ${
            error
              ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          } placeholder-gray-400`}
        >
          <option value="">선택</option>
          {options?.map((opt, index) => (
            <option key={index} value={"id" in opt ? opt.id : opt.value}>
              {"name" in opt ? opt.name : opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 ${
            error
              ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          } placeholder-gray-400`}
        />
      )}

      {(icon || (error && showErrorIcon)) && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {error && showErrorIcon ? (
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ) : (
            icon
          )}
        </div>
      )}
    </div>

    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);

export default FormInput;
