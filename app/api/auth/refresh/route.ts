import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
    }

    const response = await axios.post(
      "https://novel-project-ntj8t.ampt.app/api/refresh",
      { refreshToken }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to refresh token" },
      { status: error.response?.status || 500 }
    );
  }
}
