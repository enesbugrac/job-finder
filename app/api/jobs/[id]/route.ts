import { NextResponse } from "next/server";
import { jobsApi, handleApiError } from "@/lib/server/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await jobsApi.getById(id);
    return NextResponse.json(response.data);
  } catch (error) {
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
