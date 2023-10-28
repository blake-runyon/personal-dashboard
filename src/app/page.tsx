import config from "@/config"

export default function Home() {
  return (
    <main>
      <h1>Hello { config.user_name }</h1>
    </main>
  )
}
