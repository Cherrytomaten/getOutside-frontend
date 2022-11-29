function LoadingSpinner() {
  return (
    <section className="z-[100] absolute inset-0 w-full h-screen flex justify-center items-center bg-dark-sea-semi-transparent">
      <div className="w-9 h-9 mx-3 translate-y-[-100%] bg-bright-seaweed rounded-full shadow-glowing-bright-seaweed animate-custom-bounce"></div>
      <div className="w-9 h-9 mx-3 translate-y-[-100%] bg-bright-seaweed rounded-full shadow-glowing-bright-seaweed animate-custom-bounce-delay-1"></div>
      <div className="w-9 h-9 mx-3 translate-y-[-100%] bg-bright-seaweed rounded-full shadow-glowing-bright-seaweed animate-custom-bounce-delay-2"></div>
    </section>
  );
}

export { LoadingSpinner };
