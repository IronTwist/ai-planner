"use client";

import { Input } from "@/src/modules/common/input";

export default function Login() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex flex-col gap-4 justify-center items-center bg-cyan-900 w-64 p-4 h-auto">
        <div>Email</div>
        <div>
          <Input />
        </div>
        <div>Password</div>
        <div>
          <Input />
        </div>
      </div>
    </div>
  );
}
