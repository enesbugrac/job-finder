import { NextResponse } from "next/server";
import { jobsApi, handleApiError } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await jobsApi.getAll(searchParams);
    return NextResponse.json(response.data);
  } catch (error) {
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
