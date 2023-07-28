import Image from "next/image";

export default function Home() {
  return (
    <div style={{ height: "1000px", width: "1000px" }}>
      <div className={`ma-display-flex ma-display-flex-align-content-center`}>
        <div className={`ma-display-flex-align-content-center`}>
          <Image
            src="/logo.png"
            alt="Vercel Logo"
            width={100}
            height={45}
            priority
          />
        </div>
      </div>
    </div>
  );
}
