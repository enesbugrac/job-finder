import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const { searchParams } = new URL(request.url);

    const response = await axios.get("https://novel-project-ntj8t.ampt.app/api/jobs", {
      params: Object.fromEntries(searchParams),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Failed to fetch jobs" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
