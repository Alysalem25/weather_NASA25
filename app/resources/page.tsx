import React from 'react'
import data from '@/data/resource.json'

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Data Resources
        </h1>

        <ul className="space-y-6">
          {data.links.map((link, index) => (
            <li
              key={index}
              className="p-5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-cyan-400 transition duration-200 shadow-md"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-cyan-400 hover:underline"
              >
                {link.name}
              </a>
              <p className="text-slate-300 mt-2">{link.description_en}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Page
