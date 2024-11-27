import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "url('/home-bg.jpg')" }}
    >
      <div className="flex min-h-screen items-center justify-center p-5">
        <main className="w-full max-w-6xl rounded-lg bg-black/70 p-12">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              NETMOVIES
            </h1>
            <h2 className="mt-4 text-xl text-gray-300 md:text-2xl">
              Watch Movies Online in HD for Free!
            </h2>
          </div>

          {/* Search Section */}
          <div className="relative mx-auto mt-8 w-full max-w-3xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search movies..."
                className="w-full rounded-lg border-gray-700 bg-gray-800/50 py-3 pl-10 pr-4 text-gray-200 placeholder:text-gray-400"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Top Searches */}
          <div className="mx-auto mt-6 w-full max-w-3xl text-center">
            <div className="mb-2 text-sm text-gray-400">Top search:</div>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {[
                "House of the Dragon",
                "The Boys",
                "Tulsa King",
                "Game of Thrones",
                "The Acolyte",
                "Kingdom of the Planet of...",
                "Demon Slayer: Kimetsu n...",
                "Inside Out 2",
                "Alien: Romulus",
                "The Rookie",
              ].map((term) => (
                <span
                  key={term}
                  className="cursor-pointer text-gray-300 hover:text-emerald-400"
                >
                  {term}
                  {term !== "The Rookie" && ","}
                  &nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* Homepage Button */}
          <div className="mt-8 text-center">
            <Button className="mx-auto flex items-center gap-2 rounded-lg bg-emerald-500 px-8 py-2 text-white hover:bg-emerald-600">
              Go to Homepage
              <span className="ml-1">▶</span>
            </Button>
          </div>

          {/* Description Section */}
          <div className="mt-16 space-y-6 text-gray-300">
            <h2 className="mb-4 text-2xl font-semibold">
              Netmovies - Watch Movies Online in HD for Free!
            </h2>

            <p className="leading-relaxed">
              Web.netmovies.to - the ultimate online movie streaming website
              that brings the magic of cinema to your fingertips. With a vast
              and diverse database, as well as a multitude of exciting features,
              Web.netmovies.to offers an unparalleled movie-watching experience
              for film enthusiasts worldwide.
            </p>

            <p className="leading-relaxed">
              At Web.netmovies.to, we take pride in our extensive database that
              encompasses a wide range of movies from various genres, eras, and
              countries. From Hollywood blockbusters to independent gems, we
              have something for everyone. Our database is continuously updated
              with the latest releases, ensuring that you stay up-to-date with
              the hottest films in the industry.
            </p>

            <p className="leading-relaxed">
              One of the standout features of Web.netmovies.to is our
              personalized recommendation system. Our sophisticated algorithms
              analyze your viewing history, preferences, and ratings to curate a
              customized list of movie recommendations tailored specifically to
              your tastes. Discover new films you'll love and embark on exciting
              cinematic adventures you never knew existed.
            </p>

            <p className="leading-relaxed">
              In addition to our large database and personalized
              recommendations, Web.netmovies.to offers high-quality streaming
              for an immersive viewing experience. Enjoy movies in stunning
              high-definition resolution, accompanied by crisp audio, bringing
              the theater experience right to your home. Our adaptive streaming
              technology ensures smooth playback, adjusting to your internet
              connection for uninterrupted enjoyment.
            </p>

            <p className="leading-relaxed">
              Web.netmovies.to also understands the importance of convenience
              and accessibility. Our platform is compatible with various
              devices, including laptops, tablets, and smartphones, allowing you
              to watch movies anytime, anywhere. Whether you're at home or on
              the go, Web.netmovies.to keeps you connected to your favorite
              films.
            </p>

            <p className="leading-relaxed">
              Furthermore, Web.netmovies.to fosters a vibrant community of movie
              enthusiasts. Engage in discussions, share reviews, and interact
              with fellow cinephiles through our dedicated forums and social
              features. Connect with like-minded individuals, exchange
              recommendations, and dive deeper into the world of cinema.
            </p>

            <p className="leading-relaxed">
              In summary, Web.netmovies.to is the ultimate online movie
              streaming destination, offering a vast database, personalized
              recommendations, high-quality streaming, device compatibility, and
              an engaging community. Prepare to be captivated by the world of
              cinema as you embark on a cinematic journey like no other. Welcome
              to Web.netmovies.to, where movies come to life.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
