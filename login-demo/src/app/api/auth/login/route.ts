import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { id, password } = await request.json();

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("id, password")
    .eq("id", id)
    .single();

  if (error || !user || user.password !== password) {
    return NextResponse.json(
      { success: false, message: "아이디 또는 비밀번호가 틀렸습니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, message: "로그인성공" });
}
