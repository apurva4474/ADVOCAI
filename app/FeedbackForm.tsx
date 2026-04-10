import React, { useState, ChangeEvent, FormEvent } from "react";

interface FeedbackData {
  name: string;
  email: string;
  message: string;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Feedback submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Error submitting feedback");
      }
    } catch {
      setStatus("Server error");
    }
  };

  return (
    <div style={{ width: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Feedback</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <p>{status}</p>
    </div>
  );
};

export default FeedbackForm;