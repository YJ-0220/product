import type { FormInputProps } from "@/types/formTypes";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  rows,
  options,
}: FormInputProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-900">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    ) : type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      >
        <option value={0}>선택</option>
        {options?.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    )}
  </div>
);

export default FormInput; 