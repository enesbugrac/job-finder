import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { AuthForm } from "@/types";
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuthForm;
    const response = await axios.post(
      "https://novel-project-ntj8t.ampt.app/api/login",
      body
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Login failed" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
