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
}: FormInputProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-900">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    ) : type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      >
        <option value="">선택</option>
        {options?.map((opt, index) => (
          <option key={index} value={'id' in opt ? opt.id : opt.value}>
            {'name' in opt ? opt.name : opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    )}
  </div>
);

export default FormInput; 