import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { getRespondedQuestions } from "~/models/userQuestion.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);
    const userQestions = await getRespondedQuestions({ userId });
    return json({ userQestions });
};
export default function controlPannel() {
    const data = useLoaderData<typeof loader>();
    const user = useUser();
    return (
        <div className="flex h-full min-h-screen flex-col">
            <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
                <h1 className="text-3xl font-bold">
                    <Link to="/userquestion">Questões</Link>
                </h1>
                <Link to="/cp/pie">{user.email}</Link>
                <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                    >
                        Logout
                    </button>
                </Form>
            </header>   
            <Outlet />
        </div>
    );
}