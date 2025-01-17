import { NextResponse } from "next/server";
import { authApi, handleApiError } from "@/lib/server/api";

interface RefreshRequest {
  refreshToken: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RefreshRequest;
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
    }

    const response = await authApi.refresh({ refreshToken });

    return NextResponse.json(response.data);
  } catch (error) {
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
