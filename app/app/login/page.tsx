import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { signIn } from "@/auth";

export default async function Home() {
  return (
    <>
      {/* Header */}
      <Header />


      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">
              Fast Note へようこそ
            </h2>
            <p className="text-gray-600">
              作業記録を効率的に管理するノートアプリケーション
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("keycloak", {redirectTo: "/notes"});
            }}
          >
            <Button 
              type="submit"
              className="bg-gray-900 hover:bg-gray-800">
              ログインして始める
            </Button>

          </form>

        </div>
      </div>
    </>
  );
}
