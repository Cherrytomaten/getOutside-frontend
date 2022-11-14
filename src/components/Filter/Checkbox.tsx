export default function Checkbox({
  activityName,
  label,
  getSelectedCategories,
}) {
  return (
    <label className="inline-flex items-center mt-3 mr-3">
      <input
        type="checkbox"
        className="h-5 w-5"
        value={label}
        onChange={(e) => getSelectedCategories(+e.target.value)}
      />
      <span className="ml-2 text-white-700">{label}</span>
    </label>
  );
}
