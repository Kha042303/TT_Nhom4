import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { register } from "../../api";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra match password
    if (password !== confirm) {
      alert("Mật khẩu không khớp!");
      return;
    }

    // Kiểm tra đủ mạnh
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const res = await register({ full_name, email, password });

      if (res.code === 200) {
        alert("Đăng ký thành công!");
        window.location.href = "/signin";
      } else {
        alert(res.message || "Lỗi đăng ký");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi server, vui lòng thử lại sau!");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Nhập thông tin của bạn bên dưới để tạo tài khoản
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="full_name">Họ và tên</FieldLabel>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm_password">
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <Input
                      id="confirm_password"
                      type="password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </Field>
                </div>

                <FieldDescription>
                  Mật khẩu phải có ít nhất 6 ký tự.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit">Tạo tài khoản</Button>
              </Field>

              <FieldDescription className="text-center">
                Đã có tài khoản? <a href="/signin">Đăng nhập</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="../../public/img/signup.jpg"
              alt="Ảnh minh họa"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Khi tiếp tục, bạn đồng ý với{" "}
        <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>.
      </FieldDescription>
    </div>
  );
}

export default SignupForm;
