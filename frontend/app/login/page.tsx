import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { JSX } from "react"


export default function Login(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b bg-green-700 py-3">
        <div className="max-w-4xl px-4 flex items-center">
          <h1 className="text-xl text-amber-400 font-semibold">GMUBookSwap</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 bg-green-800">
        <Card className="w-full max-w-md">
         <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/gmu_logo.jpg" alt="Bookswap logo" className="h-12 w-auto" />
          </div>
           <CardTitle>Login to your account</CardTitle>
           <CardDescription>
             Enter your information below to login to your account
           </CardDescription>
         </CardHeader>
         <CardContent>
           <form>
             <div className="flex flex-col gap-6">
               <div className="grid gap-2">
                 <Input
                   id="username"
                   type="username"
                   placeholder="Username"
                   required
                 />
               </div>
               <div className="grid gap-2">
                 <Input 
                  id="password" 
                  type="password" 
                  placeholder="Password"
                  required />
               </div>
             </div>
           </form>
         </CardContent>
         <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="link">Sign Up</Button>
         </CardFooter>
        </Card>
      </main>
    </div>
  )
}
