import React from 'react';
import Navbar from '../../components/NavBar';

const GenerateCertificate = () => {
  return (
    <div className="min-h-screen bg-[#0d181c] text-white">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">Generate Certificate</h1>
          <p className="text-sm text-gray-400">
            Easily generate and preview a certificate for any registered gym member.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Form */}
          <div className="space-y-6 bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Member</label>
              <select className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-yellow-300">
                <option>Select Member</option>
                <option>Sarah Johnson</option>
                <option>John Smith</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Certificate Title</label>
              <input
                type="text"
                placeholder="e.g. Certificate of Achievement"
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Certificate Description</label>
              <textarea
                rows="4"
                placeholder="Write a custom message for the recipient..."
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button className="px-5 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white transition">
                Send
              </button>
              <button className="px-5 py-2 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition">
                Generate
              </button>
            </div>
          </div>

          {/* Right Preview */}
          <div className="bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-700 flex flex-col sm:flex-row items-center gap-5">
            <img
              src="/images/certificate-sample.png"
              alt="Certificate Preview"
              className="w-full sm:w-1/2 rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-yellow-300">Certificate of Achievement</h3>
              <p className="text-sm text-gray-300">
                This certificate is proudly presented to <span className="text-yellow-400 font-medium">Sarah Johnson</span> for successfully completing the Advanced Fitness Program at FitFlex Gym.
              </p>
              <button className="mt-3 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded transition font-semibold">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificate;
