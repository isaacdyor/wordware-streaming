"use client";

export default function Home() {
  const handleClick = async () => {
    const response = await fetch("/api/stream/123", {
      headers: { Authorization: "Bearer 123" },
    });
    const data = await response.json();
    console.log(data);
  };
  return <button onClick={handleClick}>Click me</button>;
}
