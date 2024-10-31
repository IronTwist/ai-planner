import { NextRequest } from "next/server";
// import { createStore } from "./store";

export default async function middlewares(req: NextRequest) {
    console.log("Middleware: ", req.nextUrl.pathname);
    
//   const a = getServerSideStore(getServerSideStore)

}