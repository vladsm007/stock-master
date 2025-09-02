import Footer from "./components/footer/Footer"
import SideBar from "./components/sidebar/SideBar"

export default function Home() {
  return (
    <div className="flex-col bg-indigo-900 h-screen w-screen text-white">
      <section>
        <SideBar />
      </section>
    <section>
      <Footer />
    </section>
    </div>
  )
    
}
