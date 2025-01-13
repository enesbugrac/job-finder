import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(
      "https://novel-project-ntj8t.ampt.app/api/login",
      body
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
