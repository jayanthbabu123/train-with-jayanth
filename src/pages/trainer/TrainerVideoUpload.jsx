import React, { useState } from "react";

const LANGUAGES = ["English", "Hindi", "Telugu", "Tamil", "Other"];

function getYoutubeEmbedUrl(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}

export default function TrainerVideoUpload() {
  const [form, setForm] = useState({
    title: "",
    link: "",
    description: "",
    language: "",
    batch: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const embedUrl = getYoutubeEmbedUrl(form.link);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.link.trim() || !embedUrl)
      errs.link = "Valid YouTube link required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.language) errs.language = "Language is required";
    if (!form.batch.trim()) errs.batch = "Batch number is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // TODO: Upload logic here (API call)
    setTimeout(() => {
      setSubmitting(false);
      alert("Video uploaded successfully!");
      setForm({
        title: "",
        link: "",
        description: "",
        language: "",
        batch: "",
      });
    }, 1200);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-2">
          Upload Class Video
        </h1>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Video Title<span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter video title"
              required
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              YouTube Link<span className="text-red-500">*</span>
            </label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.link ? "border-red-500" : ""
              }`}
              placeholder="Paste YouTube video link"
              required
            />
            {errors.link && (
              <span className="text-xs text-red-500">{errors.link}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-semibold text-gray-700">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`input input-bordered min-h-[80px] ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Describe the video content"
              required
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Language<span className="text-red-500">*</span>
            </label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.language ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {errors.language && (
              <span className="text-xs text-red-500">{errors.language}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Batch Number<span className="text-red-500">*</span>
            </label>
            <input
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.batch ? "border-red-500" : ""
              }`}
              placeholder="e.g. 2024A"
              required
            />
            {errors.batch && (
              <span className="text-xs text-red-500">{errors.batch}</span>
            )}
          </div>
          <div className="md:col-span-2 flex flex-col items-center gap-2">
            {embedUrl ? (
              <iframe
                className="rounded-xl border shadow-md w-full aspect-video"
                src={embedUrl}
                title="YouTube Preview"
                allowFullScreen
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-gray-400 bg-gray-100 rounded-xl border">
                Paste a valid YouTube link to preview
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#3b82f6] hover:bg-[#1e3a8a] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              disabled={submitting}
            >
              {submitting ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
