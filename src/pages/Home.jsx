import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 min-h-screen bg-slate-100 p-6">
        <p>Feed coming soon...</p>
      </main>
    </div>
  );
};

export default Home;