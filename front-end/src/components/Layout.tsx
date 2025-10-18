import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layou() {
    return (
        <div className="grid grid-cols-[260px_1fr] grid-rows-[64px_1fr] h-screen">
            <div className="row-span-2">
                <Sidebar/>
            </div>
            <Header/>
            <main className="overflow-y-auto p-8 bg-gray-100">
                <Outlet/>
            </main>
        </div>
    );
}