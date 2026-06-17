import React from "react";

const About = () => {
  return (
    <div className="bg-[#f8f4ec] min-h-screen">

      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-[#5c4b3d] mb-6">
            About Author Gallery
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed">
            A place where writers, storytellers, poets, educators, and creators
            share their ideas with readers who value meaningful content.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-[#5c4b3d] mb-6">
            Our Story
          </h2>

          <p className="text-gray-700 leading-8">
            Every great author starts with a single page. Author Gallery was
            created to give writers and creators a dedicated space where their
            work can be discovered, appreciated, and shared.
          </p>

          <p className="text-gray-700 leading-8 mt-4">
            Whether it's a novel, poem, story, educational article, shayari, or
            personal essay, every piece of writing deserves an audience. Our
            goal is to connect creators with readers through a beautiful and
            accessible platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold text-[#5c4b3d] mb-4">
              Inspire Creativity
            </h3>

            <p className="text-gray-600">
              Encourage writers to publish and share their work confidently.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold text-[#5c4b3d] mb-4">
              Build Community
            </h3>

            <p className="text-gray-600">
              Create meaningful connections between readers and creators.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold text-[#5c4b3d] mb-4">
              Share Knowledge
            </h3>

            <p className="text-gray-600">
              Make educational and literary content accessible to everyone.
            </p>
          </div>

        </div>
      </section>

      {/* What You'll Find */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-[#5c4b3d] mb-8">
            What You'll Discover
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="p-5 border rounded-xl">
              📚 Books & Novels
            </div>

            <div className="p-5 border rounded-xl">
              ✍️ Stories & Essays
            </div>

            <div className="p-5 border rounded-xl">
              📝 Poetry & Shayari
            </div>

            <div className="p-5 border rounded-xl">
              🎓 Educational Content
            </div>

            <div className="p-5 border rounded-xl">
              💡 Creative Ideas
            </div>

            <div className="p-5 border rounded-xl">
              🌍 Voices From Around The World
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-[#5c4b3d] mb-6">
            Where Meaningful Writing Finds Its Audience
          </h2>

          <p className="text-gray-700 mb-8">
            Join a growing community of readers and creators who believe in the
            power of stories, knowledge, and ideas.
          </p>

          <button className="px-8 py-4 bg-[#5c4b3d] text-white rounded-full hover:opacity-90 transition">
            Explore Authors
          </button>
        </div>
      </section>

    </div>
    
  );
};

export default About;