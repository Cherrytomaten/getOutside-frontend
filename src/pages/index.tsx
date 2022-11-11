import { Signup } from "@/components/Signup";

function Home() {
  return (
      <main className="w-full h-screen flex justify-center items-center bg-dark-sea">
          <p className="text-xl font-normal">Foobar</p>
          <Signup />
      </main>
  );
}

export default Home;
