import { Signup } from "@/components/Signup";

type PageProps = {
    user: UserProps;
}

function Home({ user }: PageProps) {
//    if (!user) return



  return (
      <main className="w-full h-screen flex justify-center items-center bg-dark-sea">
          <Signup />
      </main>
  );
}

export default Home;
