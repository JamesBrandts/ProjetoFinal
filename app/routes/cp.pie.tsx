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
    const responded = data.userQestions.filter(i => i.userResponse).length
    const respondedRigth = data.userQestions.filter(i => i.userResponse && i.userResponse === i.correctResponse).length
    const percentualRight = respondedRigth / responded * 100
    return (
        <div >
            <main className="flex flex-col h-full bg-white items-center justify-center p-4 gap-4">
                <div className="flex w-full text-blue-500 underline">
                    <Link to="/cp/graf">Gráfico</Link>
                </div>
                <div className="border-2 border-black w-full aspect-square rounded-full max-w-80" style={{ background: `conic-gradient(green 0% ${percentualRight}%, red ${percentualRight}% 100%)` }} title={`${percentualRight?.toFixed(2)}% de acerto\n${(100-percentualRight)?.toFixed(2)}% de erros`}>
                </div>
                <div className="border p-2">
                    <div className="flex items-center gap-2">
                        <div style={{ background: "green" }} className="w-6 h-4 border-2 border-black"></div>
                        <div>Corretas</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ background: "red" }} className="w-6 h-4 border-2 border-black"></div>
                        <div>Incorretas</div>
                    </div>
                </div>
            </main>
        </div>
    );
}