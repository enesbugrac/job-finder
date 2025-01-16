import { NextResponse } from "next/server";
import { authApi, handleApiError } from "@/lib/server/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await authApi.login(body);
    return NextResponse.json(response.data);
  } catch (error) {
    const { error: errorMessage, status } = handleApiError(error);

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
