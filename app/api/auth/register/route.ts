import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { RegisterForm } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterForm;
    const response = await axios.post(
      "https://novel-project-ntj8t.ampt.app/api/register",
      body
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Registration failed" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
