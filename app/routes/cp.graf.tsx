import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRespondedQuestions } from "~/models/userQuestion.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    const userQestions = await getRespondedQuestions({ userId });
    return json({ userQestions });
};
export default function controlPannel() {
    const data = useLoaderData<typeof loader>();
    const responded = data.userQestions.filter(i => i.userResponse)
    const days = [...new Set(responded.map(i => i.updatedAt.slice(1, 10)))];
    const percentualPorDia = days.map(i => {
        const qDay = responded.filter(j => j.updatedAt.slice(1, 10) === i);
        return qDay.filter(i => i.userResponse && i.userResponse === i.correctResponse).length / qDay.length * 100
    })
    const percentuais = [percentualPorDia[0],
    percentualPorDia[1],
    percentualPorDia[2],
    percentualPorDia[3],
    percentualPorDia[4],
    percentualPorDia[5],
    percentualPorDia[6],
    percentualPorDia[7],
]
    return (
        <div >
            <main className="flex flex-col h-full bg-white items-center justify-center p-4 gap-4">
                <div className="flex w-full text-blue-500 underline">
                    <Link to="/cp/pie">Percentual</Link>
                </div>
                <div className="flex border-l border-b border-black w-full aspect-square max-w-80 justify-between items-end">
                    {percentuais.map(i => (<div className="border-1 border-black" style={{ width: "10%", height:`${i ?? 0}%`,background:"green" }} title={`${i?.toFixed(2)}% de Acerto`}></div>))}
                </div>
            </main>
        </div>
    );
}