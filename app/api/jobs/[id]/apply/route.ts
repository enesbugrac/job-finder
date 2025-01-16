import { NextResponse } from "next/server";
import { jobsApi, handleApiError } from "@/lib/server/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await jobsApi.apply(id);
    return NextResponse.json(response.data);
  } catch (error) {
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
