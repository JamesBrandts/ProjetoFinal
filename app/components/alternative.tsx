export default function Alternative({ text, alternativa, question }: { text: string, alternativa: string, question: any }) {
  const outText = `${alternativa.toUpperCase()}) ${text}`;
  const selected = question.userResponse === alternativa;
  const wrong = question.correctResponse !== alternativa;
  const right = question.userResponse && question.correctResponse === alternativa;
  return (
    <button
      className={`rounded px-4 py-2 ${!question.userResponse && "hover:bg-slate-100"} border border-slate-300 min-h-[80px] text-left w-full ${selected ? wrong ? 'bg-red-200' : 'bg-green-200' : right ? 'bg-green-100' : 'bg-white'}`}
      type="submit"
      name="alternativa"
      value={alternativa}
    >
      {outText}
    </button>
  );
}
