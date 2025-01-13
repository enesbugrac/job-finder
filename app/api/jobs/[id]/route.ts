import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const response = await axios.get(
      `https://novel-project-ntj8t.ampt.app/api/jobs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token.replace("Bearer ", "")}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Failed to fetch job by id" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Failed to get job by id" }, { status: 500 });
  }
}
