import { POST } from "@/app/api/auth/login/route";

// Mock Supabase server client
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() =>
    Promise.resolve({ from: mockFrom })
  ),
}));

function createRequest(body: object): Request {
  return new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("로그인 성공 - 올바른 id/password", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "whoana", password: "whoana" },
      error: null,
    });

    const request = createRequest({ id: "whoana", password: "whoana" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, message: "로그인성공" });
    expect(mockFrom).toHaveBeenCalledWith("users");
    expect(mockEq).toHaveBeenCalledWith("id", "whoana");
  });

  it("로그인 실패 - 비밀번호 불일치", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "whoana", password: "whoana" },
      error: null,
    });

    const request = createRequest({ id: "whoana", password: "wrong" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      message: "아이디 또는 비밀번호가 틀렸습니다.",
    });
  });

  it("로그인 실패 - 존재하지 않는 사용자", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "No rows found" },
    });

    const request = createRequest({ id: "unknown", password: "test" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      message: "아이디 또는 비밀번호가 틀렸습니다.",
    });
  });
});
