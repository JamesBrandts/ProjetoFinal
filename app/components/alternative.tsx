export default function Alternative({ text, alternativa }: { text: string, alternativa: string }) {
  const outText = `${alternativa.toUpperCase()}) ${text}`;
  return (
    <button
      className="rounded bg-blue-100 px-4 py-2 hover:bg-blue-200 focus:bg-blue-400 border border-blue-300 min-h-[80px] text-left w-full"
      type="submit"
      name="alternativa"
      value={text}
    >
      {outText}
    </button>
  );
}